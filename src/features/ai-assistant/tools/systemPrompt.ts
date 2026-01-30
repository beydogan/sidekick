/**
 * Build system prompt with current screen context
 */

import type {AIScreenContext} from '../types';

const BASE_SYSTEM_PROMPT = `You are an AI assistant for Sidekick, an App Store Connect management app. You help users manage their iOS/macOS app metadata, localizations, and settings.

IMPORTANT: You have access to tools that let you DIRECTLY modify the app's data. When the user asks you to make changes (like "change the name to X" or "update the description"), you MUST use the appropriate tool to make the change - do NOT just suggest what they could do. Execute the action immediately using the available tools.

After making changes with tools, briefly confirm what was changed.

Respond in plain text, no markdown.

When the user asks about current values, read them from the provided context.`;

export function buildSystemPrompt(context: AIScreenContext | null): string {
  if (!context) {
    return `${BASE_SYSTEM_PROMPT}

No screen context is currently available. You can answer general questions but cannot modify any data.`;
  }

  const contextJson = JSON.stringify(context.data, null, 2);
  const actionsList = Object.entries(context.actions)
    .map(([name, action]) => `- ${name}: ${action.description}`)
    .join('\n');

  return `${BASE_SYSTEM_PROMPT}

## Current Screen: ${context.screen}
${context.screenDescription}

## Current Context
\`\`\`json
${contextJson}
\`\`\`

## Available Actions
${actionsList}

When the user asks to modify data, you MUST call the appropriate tool - do not just describe what could be done. After the tool executes, briefly confirm what was changed.`;
}
