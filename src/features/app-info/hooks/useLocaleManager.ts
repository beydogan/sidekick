import {useState, useEffect, useMemo, useCallback} from 'react';
import {Alert} from 'react-native';
import type {AppInfoLocalization, AppStoreVersionLocalization} from '@libs/appStoreConnect';
import {useCreateAppInfoLocalization, useDeleteAppInfoLocalization} from './useAppInfo';
import {getLocaleName, ALL_LOCALES} from '../constants';

interface UseLocaleManagerParams {
  appId: string;
  appInfoId: string | undefined;
  primaryLocale: string | undefined;
  appName: string | undefined;
  allLocalizations: AppInfoLocalization[];
  allVersionLocalizations: AppStoreVersionLocalization[];
  localizationIds: string[];
  isEditable: boolean;
}

export function useLocaleManager({
  appId,
  appInfoId,
  primaryLocale,
  appName,
  allLocalizations,
  allVersionLocalizations,
  localizationIds,
  isEditable,
}: UseLocaleManagerParams) {
  const createLocalization = useCreateAppInfoLocalization();
  const deleteLocalization = useDeleteAppInfoLocalization();

  const [selectedLocale, setSelectedLocale] = useState<string | null>(null);
  const [loadingLocales, setLoadingLocales] = useState<Set<string>>(new Set());

  // Filter localizations to those belonging to the current appInfo
  const localizations = useMemo(
    () => allLocalizations.filter(l => localizationIds.includes(l.id)),
    [allLocalizations, localizationIds],
  );

  // Compute locale lists
  const localizedLocales = useMemo(
    () =>
      [...new Set(localizations.map(l => l.attributes.locale))].sort((a, b) =>
        getLocaleName(a).localeCompare(getLocaleName(b)),
      ),
    [localizations],
  );

  const notLocalizedLocales = useMemo(
    () =>
      ALL_LOCALES.filter(locale => !localizedLocales.includes(locale)).sort((a, b) =>
        getLocaleName(a).localeCompare(getLocaleName(b)),
      ),
    [localizedLocales],
  );

  // Current localizations for selected locale
  const currentLocalization = useMemo(() => {
    if (!selectedLocale) return null;
    return localizations.find(l => l.attributes.locale === selectedLocale) || null;
  }, [localizations, selectedLocale]);

  const currentVersionLocalization = useMemo(() => {
    if (!selectedLocale) return null;
    return allVersionLocalizations.find(l => l.attributes.locale === selectedLocale) || null;
  }, [allVersionLocalizations, selectedLocale]);

  // Initialize selected locale from primary locale
  useEffect(() => {
    if (primaryLocale && !selectedLocale) {
      setSelectedLocale(primaryLocale);
    }
  }, [primaryLocale, selectedLocale]);

  const handleAddLocalization = useCallback(
    async (locale: string) => {
      if (!appInfoId) return;
      const primaryLoc = localizations.find(l => l.attributes.locale === primaryLocale);
      const defaultName = primaryLoc?.attributes.name || appName || '';

      setLoadingLocales(prev => new Set(prev).add(locale));
      try {
        await createLocalization.mutateAsync({
          appInfoId,
          appId,
          locale,
          attributes: {name: defaultName},
        });
        setSelectedLocale(locale);
      } catch (error) {
        console.error('Failed to add localization', error);
      } finally {
        setLoadingLocales(prev => {
          const next = new Set(prev);
          next.delete(locale);
          return next;
        });
      }
    },
    [appInfoId, appId, createLocalization, localizations, primaryLocale, appName],
  );

  const handleDeleteLocalization = useCallback(
    (locale: string) => {
      const localization = localizations.find(l => l.attributes.locale === locale);
      if (!localization) return;

      Alert.alert(
        'Remove Localization',
        `Are you sure you want to remove ${getLocaleName(locale)}?`,
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Remove',
            style: 'destructive',
            onPress: async () => {
              setLoadingLocales(prev => new Set(prev).add(locale));
              try {
                await deleteLocalization.mutateAsync({
                  localizationId: localization.id,
                  appId,
                });
                if (selectedLocale === locale) {
                  setSelectedLocale(primaryLocale || localizedLocales[0] || null);
                }
              } catch (error) {
                console.error('Failed to delete localization', error);
              } finally {
                setLoadingLocales(prev => {
                  const next = new Set(prev);
                  next.delete(locale);
                  return next;
                });
              }
            },
          },
        ],
      );
    },
    [localizations, deleteLocalization, appId, selectedLocale, primaryLocale, localizedLocales],
  );

  // Sidebar sections
  const sidebarSections = useMemo(() => {
    const sections = [];

    if (localizedLocales.length > 0) {
      sections.push({
        title: 'Localized',
        items: localizedLocales.map(locale => ({
          id: locale,
          label: getLocaleName(locale),
          selected: locale === selectedLocale,
          loading: loadingLocales.has(locale),
          onPress: () => setSelectedLocale(locale),
          action:
            isEditable && locale !== primaryLocale
              ? {
                  icon: '-' as const,
                  onPress: () => handleDeleteLocalization(locale),
                }
              : undefined,
        })),
      });
    }

    if (isEditable && notLocalizedLocales.length > 0) {
      sections.push({
        title: 'Not Localized',
        items: notLocalizedLocales.map(locale => ({
          id: locale,
          label: getLocaleName(locale),
          loading: loadingLocales.has(locale),
          onPress: () => handleAddLocalization(locale),
          action: {
            icon: '+' as const,
            onPress: () => handleAddLocalization(locale),
          },
        })),
      });
    }

    return sections;
  }, [
    localizedLocales,
    notLocalizedLocales,
    selectedLocale,
    primaryLocale,
    loadingLocales,
    handleAddLocalization,
    handleDeleteLocalization,
    isEditable,
  ]);

  return {
    selectedLocale,
    setSelectedLocale,
    localizedLocales,
    notLocalizedLocales,
    currentLocalization,
    currentVersionLocalization,
    sidebarSections,
    handleAddLocalization,
    handleDeleteLocalization,
  };
}
