import {useState, useCallback, useEffect} from 'react';
import {generateText, stepCountIs, type ModelMessage} from 'ai';
import {loadAICredentials, createProvider} from '@libs/ai';
import type {LanguageModel} from 'ai';
import {useAIContextValue} from '../context/AIContextProvider';
import {buildToolsFromActions} from '../tools/buildTools';
import {buildSystemPrompt} from '../tools/systemPrompt';

/**
 * Infer which fields were modified based on the tool name and args.
 */
function inferModifiedFields(toolName: string, args?: Record<string, unknown>): string[] {
  if (toolName === 'setField' && args?.field) {
    return [args.field as string];
  }
  if (toolName === 'setFields' && args?.fields) {
    return Object.keys(args.fields as Record<string, unknown>);
  }
  const fieldMap: Record<string, string[]> = {
    setPrimaryCategory: ['primaryCategory'],
    setSecondaryCategory: ['secondaryCategory'],
    switchLocale: ['locale'],
  };
  return fieldMap[toolName] || [];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  /** Tools that were called in this message */
  toolsCalled?: string[];
}

interface UseAIChatReturn {
  messages: Message[];
  isLoading: boolean;
  isConfigured: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  /** Whether the AI has context from the current screen */
  hasScreenContext: boolean;
}

export function useAIChat(): UseAIChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [model, setModel] = useState<LanguageModel | null>(null);

  const {getScreenContext, markFieldsAsAIModified} = useAIContextValue();

  useEffect(() => {
    loadAICredentials().then(credentials => {
      if (credentials) {
        const provider = createProvider(credentials);
        setModel(provider);
        setIsConfigured(true);
      }
    });
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!model) {
        setError('AI not configured. Go to Settings to add your API key.');
        return;
      }

      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content,
      };

      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        // Get current screen context (from ref, always up-to-date)
        const screenContext = getScreenContext();

        console.log('[AI] Screen context:', screenContext?.screen);
        console.log('[AI] Available actions:', screenContext?.actions ? Object.keys(screenContext.actions) : 'none');

        // Build system prompt with current context
        const systemPrompt = buildSystemPrompt(screenContext);

        // Build tools from current screen's actions
        const tools = screenContext?.actions
          ? buildToolsFromActions(screenContext.actions)
          : undefined;

        console.log('[AI] Tools built:', tools ? Object.keys(tools) : 'none');
        if (tools) {
          console.log('[AI] First tool example:', JSON.stringify(tools.setName, null, 2))
        }

        // Convert messages to AI SDK message format
        const aiMessages: ModelMessage[] = messages.map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }));
        aiMessages.push({
          role: 'user' as const,
          content,
        });

        const result = await generateText({
          experimental_telemetry: { isEnabled: true },
          model,
          system: systemPrompt,
          messages: aiMessages,
          tools,
          toolChoice: tools ? 'auto' : undefined,
          stopWhen: stepCountIs(5),
        });

        console.log('[AI] Result text:', result.text?.substring(0, 100));
        console.log('[AI] Steps:', result.steps?.length);
        console.log('[AI] Tool calls in steps:', result.steps?.map(s => s.toolCalls?.length));

        // Track which tools were called and mark fields as AI-modified
        const allModifiedFields: string[] = [];
        const toolsCalled: string[] = [];

        if (result.steps) {
          for (const step of result.steps) {
            if (step.toolCalls) {
              for (const toolCall of step.toolCalls) {
                toolsCalled.push(toolCall.toolName);
                const args = 'args' in toolCall ? toolCall.args as Record<string, unknown> : undefined;
                console.log('[AI] Tool called:', toolCall.toolName, args ?? {});
                // Infer modified fields from tool name and args
                const modifiedFields = inferModifiedFields(toolCall.toolName, args);
                allModifiedFields.push(...modifiedFields);
              }
            }
          }
        }

        // Mark fields as AI-modified
        if (allModifiedFields.length > 0) {
          markFieldsAsAIModified(allModifiedFields);
        }

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: result.text,
          toolsCalled: toolsCalled.length > 0 ? toolsCalled : undefined,
        };

        setMessages(prev => [...prev, assistantMessage]);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to get response';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [model, messages, getScreenContext, markFieldsAsAIModified],
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    isConfigured,
    error,
    sendMessage,
    clearMessages,
    hasScreenContext: !!getScreenContext(),
  };
}
