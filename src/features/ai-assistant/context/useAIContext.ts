/**
 * useAIContext - Hook for screens to register context and actions
 *
 * Usage:
 * ```tsx
 * useAIContext({
 *   screen: 'AppInfoScreen',
 *   screenDescription: 'Edit app information and localizations',
 *   data: { app, selectedLocale, ... },
 *   actions: { setName, setSubtitle, ... },
 * });
 * ```
 */

import {useEffect, useRef} from 'react';
import {useAIContextValue} from './AIContextProvider';
import type {AIScreenContext} from '../types';

export function useAIContext(context: AIScreenContext | null): void {
  const {setScreenContext, clearAllAIModified} = useAIContextValue();
  const prevScreenRef = useRef<string | null>(null);

  // Always keep context ref updated (no re-renders triggered)
  setScreenContext(context);

  // Clear AI modified fields when screen changes
  useEffect(() => {
    const currentScreen = context?.screen ?? null;
    if (currentScreen !== prevScreenRef.current) {
      clearAllAIModified();
      prevScreenRef.current = currentScreen;
    }
  }, [context?.screen, clearAllAIModified]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setScreenContext(null);
    };
  }, [setScreenContext]);
}

export {useAIContextValue} from './AIContextProvider';
