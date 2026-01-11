/**
 * UI Store - Cross-feature UI state with persistence
 */

import {observable} from '@legendapp/state';
import {
  configureObservablePersistence,
  persistObservable,
} from '@legendapp/state/persist';
import {ObservablePersistAsyncStorage} from '@legendapp/state/persist-plugins/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure AsyncStorage as the persistence layer
configureObservablePersistence({
  pluginLocal: ObservablePersistAsyncStorage,
  localOptions: {
    asyncStorage: {
      AsyncStorage,
    },
  },
});

export type AIProvider = 'openai' | 'anthropic' | 'google';

export const AI_PROVIDERS: {id: AIProvider; label: string}[] = [
  {id: 'openai', label: 'OpenAI'},
  {id: 'anthropic', label: 'Anthropic'},
  {id: 'google', label: 'Google AI'},
];

interface UIState {
  selectedAppId: string | null;
  mcpServer: {
    enabled: boolean;
    port: number;
  };
  aiAssistant: {
    visible: boolean;
    provider: AIProvider | null;
  };
}

export const ui$ = observable<UIState>({
  selectedAppId: null,
  mcpServer: {
    enabled: false,
    port: 3000,
  },
  aiAssistant: {
    visible: false,
    provider: null,
  },
});

// Persist the UI state
persistObservable(ui$, {
  local: 'ui-state',
});
