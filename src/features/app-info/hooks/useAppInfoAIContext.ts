/**
 * AI Context hook for AppInfoScreen
 *
 * Provides the AI assistant with context and actions for the app info screen.
 */

import {useMemo} from 'react';
import {z} from 'zod';
import type {AIScreenContext, AIActions, AppInfoContextData} from '@features/ai-assistant';
import {getLocaleName} from '../constants';

interface UseAppInfoAIContextParams {
  // App data
  app: {
    id: string;
    attributes: {
      name: string;
      bundleId: string;
      sku: string;
      primaryLocale: string;
    };
  } | null;

  // Current state
  selectedLocale: string | null;
  localizedLocales: string[];
  notLocalizedLocales: string[];
  isEditable: boolean;
  version: string | null;

  // Form values
  name: string;
  subtitle: string;
  promotionalText: string;
  description: string;
  whatsNew: string;
  keywords: string;
  supportUrl: string;
  marketingUrl: string;

  // Categories
  selectedPrimaryCategory: string | undefined;
  selectedSecondaryCategory: string | undefined;
  availableCategories: Array<{id: string; name: string}>;

  // Setters for localizable fields
  setName: (value: string) => void;
  setSubtitle: (value: string) => void;
  setPromotionalText: (value: string) => void;
  setDescription: (value: string) => void;
  setWhatsNew: (value: string) => void;
  setKeywords: (value: string) => void;
  setSupportUrl: (value: string) => void;
  setMarketingUrl: (value: string) => void;

  // Category handlers
  handlePrimaryCategoryChange: (categoryId: string | undefined) => void;
  handleSecondaryCategoryChange: (categoryId: string | undefined) => void;

  // Locale handlers
  setSelectedLocale: (locale: string | null) => void;
  handleAddLocalization: (locale: string) => Promise<void>;
  handleDeleteLocalization: (locale: string) => void;
}

export function useAppInfoAIContext(params: UseAppInfoAIContextParams): AIScreenContext | null {
  const {
    app,
    selectedLocale,
    localizedLocales,
    notLocalizedLocales,
    isEditable,
    version,
    name,
    subtitle,
    promotionalText,
    description,
    whatsNew,
    keywords,
    supportUrl,
    marketingUrl,
    selectedPrimaryCategory,
    selectedSecondaryCategory,
    availableCategories,
    setName,
    setSubtitle,
    setPromotionalText,
    setDescription,
    setWhatsNew,
    setKeywords,
    setSupportUrl,
    setMarketingUrl,
    handlePrimaryCategoryChange,
    handleSecondaryCategoryChange,
    setSelectedLocale,
    handleAddLocalization,
    handleDeleteLocalization,
  } = params;

  return useMemo(() => {
    if (!app) return null;

    const data: AppInfoContextData = {
      app: {
        id: app.id,
        name: app.attributes.name,
        bundleId: app.attributes.bundleId,
        sku: app.attributes.sku,
        primaryLocale: app.attributes.primaryLocale,
      },
      selectedLocale,
      localizedLocales,
      notLocalizedLocales,
      currentLocalization: {
        name,
        subtitle,
      },
      currentVersionLocalization: {
        promotionalText,
        description,
        whatsNew,
        keywords,
        supportUrl,
        marketingUrl,
      },
      categories: {
        primary: selectedPrimaryCategory ?? null,
        secondary: selectedSecondaryCategory ?? null,
        available: availableCategories,
      },
      isEditable,
      version,
    };

    const fieldSetters: Record<string, (value: string) => void> = {
      name: setName,
      subtitle: setSubtitle,
      promotionalText: setPromotionalText,
      description: setDescription,
      whatsNew: setWhatsNew,
      keywords: setKeywords,
      supportUrl: setSupportUrl,
      marketingUrl: setMarketingUrl,
    };

    const fieldNames = Object.keys(fieldSetters);

    const actions: AIActions = {
      setField: {
        description: `Set a single field. Available fields: ${fieldNames.join(', ')}`,
        schema: z.object({
          field: z.enum(fieldNames as [string, ...string[]]),
          value: z.string(),
        }),
        handler: ({field, value}) => {
          const setter = fieldSetters[field];
          if (setter) setter(value);
        },
      },
      setFields: {
        description: `Set multiple fields at once. Available fields: ${fieldNames.join(', ')}`,
        schema: z.object({
          fields: z.record(z.string(), z.string()),
        }),
        handler: ({fields}) => {
          for (const [field, value] of Object.entries(fields)) {
            const setter = fieldSetters[field];
            if (setter && typeof value === 'string') setter(value);
          }
        },
      },
      setPrimaryCategory: {
        description: `Set the primary category. Available categories: ${availableCategories.map(c => c.id).join(', ')}`,
        schema: z.object({categoryId: z.string()}),
        handler: ({categoryId}) => handlePrimaryCategoryChange(categoryId),
      },
      setSecondaryCategory: {
        description: `Set the secondary category (optional). Available categories: ${availableCategories.map(c => c.id).join(', ')}. Pass empty string to clear.`,
        schema: z.object({categoryId: z.string()}),
        handler: ({categoryId}) => handleSecondaryCategoryChange(categoryId || undefined),
      },
      switchLocale: {
        description: `Switch to a different locale. Available localized locales: ${localizedLocales.map(l => `${l} (${getLocaleName(l)})`).join(', ')}`,
        schema: z.object({locale: z.string()}),
        handler: ({locale}) => setSelectedLocale(locale),
      },
      addLocalization: {
        description: `Add a new localization. Available locales to add: ${notLocalizedLocales.slice(0, 10).map(l => `${l} (${getLocaleName(l)})`).join(', ')}${notLocalizedLocales.length > 10 ? '...' : ''}`,
        schema: z.object({locale: z.string()}),
        handler: async ({locale}) => {
          await handleAddLocalization(locale);
        },
      },
      removeLocalization: {
        description: 'Remove a localization (cannot remove primary locale)',
        schema: z.object({locale: z.string()}),
        handler: ({locale}) => handleDeleteLocalization(locale),
      },
    };

    return {
      screen: 'AppInfoScreen',
      screenDescription: `Editing app information for "${app.attributes.name}". Currently viewing ${selectedLocale ? getLocaleName(selectedLocale) : 'no locale selected'}. ${isEditable ? 'Changes can be made.' : 'Read-only mode - create a new version to edit.'}`,
      data,
      actions,
    };
  }, [
    app,
    selectedLocale,
    localizedLocales,
    notLocalizedLocales,
    isEditable,
    version,
    name,
    subtitle,
    promotionalText,
    description,
    whatsNew,
    keywords,
    supportUrl,
    marketingUrl,
    selectedPrimaryCategory,
    selectedSecondaryCategory,
    availableCategories,
    setName,
    setSubtitle,
    setPromotionalText,
    setDescription,
    setWhatsNew,
    setKeywords,
    setSupportUrl,
    setMarketingUrl,
    handlePrimaryCategoryChange,
    handleSecondaryCategoryChange,
    setSelectedLocale,
    handleAddLocalization,
    handleDeleteLocalization,
  ]);
}
