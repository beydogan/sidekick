import {useState, useCallback, useEffect} from 'react';
import {generateText} from 'ai';
import {loadAICredentials, createProvider} from '@libs/ai';
import type {LanguageModel} from 'ai';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface UseAIChatReturn {
  messages: Message[];
  isLoading: boolean;
  isConfigured: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}

export function useAIChat(): UseAIChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [model, setModel] = useState<LanguageModel | null>(null);

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
        const result = await generateText({
          model,
          messages: [
            ...messages.map(m => ({
              role: m.role as 'user' | 'assistant',
              content: m.content,
            })),
            {role: 'user' as const, content},
          ],
        });

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: result.text,
        };

        setMessages(prev => [...prev, assistantMessage]);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to get response';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [model, messages],
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
  };
}
