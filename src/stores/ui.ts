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

interface UIState {
  selectedAppId: string | null;
}

export const ui$ = observable<UIState>({
  selectedAppId: null,
});

// Persist the UI state
persistObservable(ui$, {
  local: 'ui-state',
});
