/**
 * AI Context Provider
 *
 * Provides a way for screens to register their context and actions
 * that the AI assistant can access.
 */

import React, {createContext, useContext, useState, useCallback, useMemo, useRef} from 'react';
import type {AIScreenContext, AIModifiedFields} from '../types';

interface AIContextValue {
  /** Get current screen's context (from ref, doesn't trigger re-renders) */
  getScreenContext: () => AIScreenContext | null;
  /** Register a screen's context and actions */
  setScreenContext: (context: AIScreenContext | null) => void;
  /** Fields modified by AI in the current session */
  aiModifiedFields: AIModifiedFields;
  /** Mark a field as modified by AI */
  markFieldAsAIModified: (field: string) => void;
  /** Mark multiple fields as modified by AI */
  markFieldsAsAIModified: (fields: string[]) => void;
  /** Clear AI modified status for a field (e.g., when user manually edits) */
  clearAIModified: (field: string) => void;
  /** Clear all AI modified fields */
  clearAllAIModified: () => void;
}

const AIContext = createContext<AIContextValue | null>(null);

export function AIContextProvider({children}: {children: React.ReactNode}) {
  // Use ref for screen context to avoid re-renders when it changes
  const screenContextRef = useRef<AIScreenContext | null>(null);
  const [aiModifiedFields, setAIModifiedFields] = useState<AIModifiedFields>(new Set());

  const getScreenContext = useCallback(() => screenContextRef.current, []);

  const setScreenContext = useCallback((context: AIScreenContext | null) => {
    screenContextRef.current = context;
  }, []);

  const markFieldAsAIModified = useCallback((field: string) => {
    setAIModifiedFields(prev => new Set(prev).add(field));
  }, []);

  const markFieldsAsAIModified = useCallback((fields: string[]) => {
    setAIModifiedFields(prev => {
      const next = new Set(prev);
      fields.forEach(f => next.add(f));
      return next;
    });
  }, []);

  const clearAIModified = useCallback((field: string) => {
    setAIModifiedFields(prev => {
      const next = new Set(prev);
      next.delete(field);
      return next;
    });
  }, []);

  const clearAllAIModified = useCallback(() => {
    setAIModifiedFields(new Set());
  }, []);

  const value = useMemo(
    () => ({
      getScreenContext,
      setScreenContext,
      aiModifiedFields,
      markFieldAsAIModified,
      markFieldsAsAIModified,
      clearAIModified,
      clearAllAIModified,
    }),
    [
      getScreenContext,
      setScreenContext,
      aiModifiedFields,
      markFieldAsAIModified,
      markFieldsAsAIModified,
      clearAIModified,
      clearAllAIModified,
    ],
  );

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
}

export function useAIContextValue(): AIContextValue {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAIContextValue must be used within AIContextProvider');
  }
  return context;
}
