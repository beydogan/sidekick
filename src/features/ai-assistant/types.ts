/**
 * AI Assistant Context Types
 *
 * Defines the contract for screens to expose context and actions to the AI assistant.
 */

import {z} from 'zod';

/**
 * Generic context that any screen can provide to the AI.
 * Screens extend this with their specific data.
 */
export interface AIScreenContext {
  /** Screen identifier */
  screen: string;
  /** Human-readable description of the current screen */
  screenDescription: string;
  /** Arbitrary context data the AI can read */
  data: unknown;
  /** Available actions the AI can take */
  actions: AIActions;
}

/**
 * Actions are functions the AI can call.
 * Each action has a schema for validation and a handler.
 */
export interface AIAction<TSchema extends z.ZodTypeAny = z.ZodTypeAny> {
  /** Description shown to the AI */
  description: string;
  /** Zod schema for parameters */
  schema: TSchema;
  /** Handler that executes the action */
  handler: (params: z.infer<TSchema>) => void | Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AIActions = Record<string, AIAction<any>>;

/**
 * App Info Screen specific context
 */
export interface AppInfoContextData {
  app: {
    id: string;
    name: string;
    bundleId: string;
    sku: string;
    primaryLocale: string;
  } | null;
  selectedLocale: string | null;
  localizedLocales: string[];
  notLocalizedLocales: string[];
  currentLocalization: {
    name: string;
    subtitle: string;
  } | null;
  currentVersionLocalization: {
    promotionalText: string;
    description: string;
    whatsNew: string;
    keywords: string;
    supportUrl: string;
    marketingUrl: string;
  } | null;
  categories: {
    primary: string | null;
    secondary: string | null;
    available: Array<{id: string; name: string}>;
  };
  isEditable: boolean;
  version: string | null;
}

/**
 * Tracks which fields have been modified by AI
 */
export type AIModifiedFields = Set<string>;

/**
 * Message with potential tool calls
 */
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'tool';
  content: string;
  toolCalls?: ToolCall[];
  toolResults?: ToolResult[];
}

export interface ToolCall {
  id: string;
  name: string;
  args: Record<string, unknown>;
}

export interface ToolResult {
  toolCallId: string;
  result: unknown;
}
