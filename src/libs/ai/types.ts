import type {AIProvider} from '@stores/ui';

export interface AICredentials {
  provider: AIProvider;
  apiKey: string;
}

export interface AIConfig {
  credentials: AICredentials | null;
}
