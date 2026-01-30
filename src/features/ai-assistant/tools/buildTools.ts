/**
 * Build Vercel AI SDK tools from screen actions
 */

import {zodSchema, type Tool} from 'ai';
import type {AIActions} from '../types';

interface ToolResult {
  success: boolean;
  action: string;
  error?: string;
}

/**
 * Converts our AIActions to Vercel AI SDK compatible tools.
 * Each tool includes an execute function that calls the action handler.
 */
export function buildToolsFromActions(actions: AIActions): Record<string, Tool> {
  const tools: Record<string, Tool> = {};

  for (const [name, action] of Object.entries(actions)) {
    tools[name] = {
      description: action.description,
      inputSchema: zodSchema(action.schema),
      execute: async (args: unknown): Promise<ToolResult> => {
        try {
          await action.handler(args);
          return {success: true, action: name};
        } catch (err) {
          return {success: false, action: name, error: String(err)};
        }
      },
    } as Tool;
  }

  return tools;
}
