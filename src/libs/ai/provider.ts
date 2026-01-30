import {createOpenAI} from '@ai-sdk/openai';
import {createAnthropic} from '@ai-sdk/anthropic';
import {createGoogleGenerativeAI} from '@ai-sdk/google';
import type {LanguageModel} from 'ai';
import type {AIProvider} from '@stores/ui';

export interface ProviderConfig {
  provider: AIProvider;
  apiKey: string;
}

export function createProvider(config: ProviderConfig): LanguageModel {
  switch (config.provider) {
    case 'openai': {
      const openai = createOpenAI({apiKey: config.apiKey});
      return openai('gpt-5.2');
    }
    case 'anthropic': {
      const anthropic = createAnthropic({apiKey: config.apiKey});
      return anthropic('claude-sonnet-4-20250514');
    }
    case 'google': {
      const google = createGoogleGenerativeAI({apiKey: config.apiKey});
      return google('gemini-1.5-pro');
    }
    default:
      throw new Error(`Unknown provider: ${config.provider}`);
  }
}

export function getDefaultModel(provider: AIProvider): string {
  switch (provider) {
    case 'openai':
      return 'gpt-5.2';
    case 'anthropic':
      return 'claude-sonnet-4-20250514';
    case 'google':
      return 'gemini-1.5-pro';
    default:
      return 'gpt-5.2';
  }
}
