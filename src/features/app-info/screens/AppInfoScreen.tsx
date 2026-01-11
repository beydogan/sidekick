import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {View, StyleSheet, ActivityIndicator, ScrollView, Alert} from 'react-native';
import {Screen, Text, TextInput, Pressable, NavigationHeader, Banner} from '@ui';
import {RightSidebar} from '@ui/composite';
import {colors, spacing, radii, typography} from '@theme';
import {
  useApp,
  useAppInfos,
  useAppCategories,
  useUpdateAppInfoLocalization,
  useUpdateAppInfo,
  useCreateAppInfoLocalization,
  useDeleteAppInfoLocalization,
} from '../hooks/useAppInfo';

// Locale codes must match exactly what ASC API returns
const LOCALE_NAMES: Record<string, string> = {
  'en-US': 'English (U.S.)',
  'en-GB': 'English (U.K.)',
  'en-AU': 'English (Australia)',
  'en-CA': 'English (Canada)',
  'de-DE': 'German',
  'fr-FR': 'French',
  'fr-CA': 'French (Canada)',
  'es-ES': 'Spanish (Spain)',
  'es-MX': 'Spanish (Mexico)',
  'it': 'Italian',
  'pt-BR': 'Portuguese (Brazil)',
  'pt-PT': 'Portuguese (Portugal)',
  'ja': 'Japanese',
  'ko': 'Korean',
  'zh-Hans': 'Chinese (Simplified)',
  'zh-Hant': 'Chinese (Traditional)',
  'nl-NL': 'Dutch',
  'ru': 'Russian',
  'tr': 'Turkish',
  'ar-SA': 'Arabic',
  'th': 'Thai',
  'vi': 'Vietnamese',
  'id': 'Indonesian',
  'ms': 'Malay',
  'sv': 'Swedish',
  'da': 'Danish',
  'fi': 'Finnish',
  'no': 'Norwegian',
  'pl': 'Polish',
  'cs': 'Czech',
  'el': 'Greek',
  'he': 'Hebrew',
  'hi': 'Hindi',
  'hu': 'Hungarian',
  'ro': 'Romanian',
  'sk': 'Slovak',
  'uk': 'Ukrainian',
  'ca': 'Catalan',
  'hr': 'Croatian',
};

const ALL_LOCALES = Object.keys(LOCALE_NAMES);

const CATEGORY_NAMES: Record<string, string> = {
  BOOKS: 'Books',
  BUSINESS: 'Business',
  DEVELOPER_TOOLS: 'Developer Tools',
  EDUCATION: 'Education',
  ENTERTAINMENT: 'Entertainment',
  FINANCE: 'Finance',
  FOOD_AND_DRINK: 'Food & Drink',
  GAMES: 'Games',
  GRAPHICS_AND_DESIGN: 'Graphics & Design',
  HEALTH_AND_FITNESS: 'Health & Fitness',
  LIFESTYLE: 'Lifestyle',
  MAGAZINES_AND_NEWSPAPERS: 'Magazines & Newspapers',
  MEDICAL: 'Medical',
  MUSIC: 'Music',
  NAVIGATION: 'Navigation',
  NEWS: 'News',
  PHOTO_AND_VIDEO: 'Photo & Video',
  PRODUCTIVITY: 'Productivity',
  REFERENCE: 'Reference',
  SHOPPING: 'Shopping',
  SOCIAL_NETWORKING: 'Social Networking',
  SPORTS: 'Sports',
  STICKERS: 'Stickers',
  TRAVEL: 'Travel',
  UTILITIES: 'Utilities',
  WEATHER: 'Weather',
};

function getLocaleName(locale: string): string {
  return LOCALE_NAMES[locale] || locale;
}

function getCategoryName(categoryId: string): string {
  return CATEGORY_NAMES[categoryId] || categoryId;
}

interface AppInfoScreenProps {
  appId: string;
  appName?: string;
}

export const AppInfoScreen: React.FC<AppInfoScreenProps> = ({appId}) => {
  const {data: appData, isLoading: appLoading} = useApp(appId);
  const {data: appInfoData, isLoading: appInfoLoading} = useAppInfos(appId);
  const {data: categoriesData} = useAppCategories();
  const updateLocalization = useUpdateAppInfoLocalization();
  const updateAppInfo = useUpdateAppInfo();
  const createLocalization = useCreateAppInfoLocalization();
  const deleteLocalization = useDeleteAppInfoLocalization();

  const [selectedLocale, setSelectedLocale] = useState<string | null>(null);
  const [showPrimaryCategoryPicker, setShowPrimaryCategoryPicker] = useState(false);
  const [showSecondaryCategoryPicker, setShowSecondaryCategoryPicker] = useState(false);
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [selectedPrimaryCategory, setSelectedPrimaryCategory] = useState<string | undefined>(undefined);
  const [selectedSecondaryCategory, setSelectedSecondaryCategory] = useState<string | undefined>(undefined);
  const [hasLocalizationChanges, setHasLocalizationChanges] = useState(false);
  const [hasCategoryChanges, setHasCategoryChanges] = useState(false);
  const [categoriesInitialized, setCategoriesInitialized] = useState(false);
  const [loadingLocales, setLoadingLocales] = useState<Set<string>>(new Set());

  const app = appData?.data;

  // Only PREPARE_FOR_SUBMISSION is editable - live versions cannot be modified
  const editableAppInfo = appInfoData?.infos?.find(
    info => info.attributes.appStoreState === 'PREPARE_FOR_SUBMISSION',
  );
  // For display purposes, fall back to the live version
  const displayAppInfo = editableAppInfo || appInfoData?.infos?.find(
    info => info.attributes.appStoreState === 'READY_FOR_SALE',
  ) || appInfoData?.infos?.[0];

  const appInfo = displayAppInfo;
  const isEditable = !!editableAppInfo;
  const allLocalizations = appInfoData?.localizations || [];
  // Filter localizations to only those belonging to the editable appInfo
  const localizations = useMemo(() => {
    const localizationIds = appInfo?.relationships?.appInfoLocalizations?.data?.map(
      (l: {id: string}) => l.id
    ) || [];
    return allLocalizations.filter(l => localizationIds.includes(l.id));
  }, [allLocalizations, appInfo?.relationships?.appInfoLocalizations?.data]);
  const categories = categoriesData?.data || [];

  const localizedLocales = useMemo(() =>
    [...new Set(localizations.map(l => l.attributes.locale))]
      .sort((a, b) => getLocaleName(a).localeCompare(getLocaleName(b))),
    [localizations]
  );

  const notLocalizedLocales = useMemo(() =>
    ALL_LOCALES.filter(locale => !localizedLocales.includes(locale))
      .sort((a, b) => getLocaleName(a).localeCompare(getLocaleName(b))),
    [localizedLocales]
  );

  const currentPrimaryCategoryId = appInfo?.relationships?.primaryCategory?.data?.id;
  const currentSecondaryCategoryId = appInfo?.relationships?.secondaryCategory?.data?.id;

  const currentLocalization = useMemo(() => {
    if (!selectedLocale) return null;
    return localizations.find(l => l.attributes.locale === selectedLocale);
  }, [localizations, selectedLocale]);

  useEffect(() => {
    if (app?.attributes.primaryLocale && !selectedLocale) {
      setSelectedLocale(app.attributes.primaryLocale);
    }
  }, [app?.attributes.primaryLocale, selectedLocale]);

  useEffect(() => {
    if (appInfo && !categoriesInitialized) {
      setSelectedPrimaryCategory(currentPrimaryCategoryId);
      setSelectedSecondaryCategory(currentSecondaryCategoryId);
      setCategoriesInitialized(true);
    }
  }, [appInfo, currentPrimaryCategoryId, currentSecondaryCategoryId, categoriesInitialized]);

  useEffect(() => {
    if (currentLocalization) {
      setName(currentLocalization.attributes.name || '');
      setSubtitle(currentLocalization.attributes.subtitle || '');
      setHasLocalizationChanges(false);
    }
  }, [currentLocalization]);

  const handleNameChange = (text: string) => {
    setName(text);
    setHasLocalizationChanges(
      text !== (currentLocalization?.attributes.name || '') ||
        subtitle !== (currentLocalization?.attributes.subtitle || ''),
    );
  };

  const handleSubtitleChange = (text: string) => {
    setSubtitle(text);
    setHasLocalizationChanges(
      name !== (currentLocalization?.attributes.name || '') ||
        text !== (currentLocalization?.attributes.subtitle || ''),
    );
  };

  const handlePrimaryCategoryChange = (categoryId: string | undefined) => {
    setSelectedPrimaryCategory(categoryId);
    setShowPrimaryCategoryPicker(false);
    setHasCategoryChanges(
      categoryId !== currentPrimaryCategoryId ||
        selectedSecondaryCategory !== currentSecondaryCategoryId,
    );
  };

  const handleSecondaryCategoryChange = (categoryId: string | undefined) => {
    setSelectedSecondaryCategory(categoryId);
    setShowSecondaryCategoryPicker(false);
    setHasCategoryChanges(
      selectedPrimaryCategory !== currentPrimaryCategoryId ||
        categoryId !== currentSecondaryCategoryId,
    );
  };

  const handleAddLocalization = useCallback(async (locale: string) => {
    if (!appInfo) return;
    // Get name from primary locale as default
    const primaryLocalization = localizations.find(
      l => l.attributes.locale === app?.attributes.primaryLocale
    );
    const defaultName = primaryLocalization?.attributes.name || app?.attributes.name || '';

    setLoadingLocales(prev => new Set(prev).add(locale));
    try {
      await createLocalization.mutateAsync({
        appInfoId: appInfo.id,
        appId,
        locale,
        attributes: {
          name: defaultName,
        },
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
  }, [appInfo, appId, createLocalization, localizations, app?.attributes.primaryLocale, app?.attributes.name]);

  const handleDeleteLocalization = useCallback((locale: string) => {
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
                setSelectedLocale(app?.attributes.primaryLocale || localizedLocales[0] || null);
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
      ]
    );
  }, [localizations, deleteLocalization, appId, selectedLocale, app?.attributes.primaryLocale, localizedLocales]);

  const handleSave = async () => {
    const promises: Promise<unknown>[] = [];

    if (hasLocalizationChanges && currentLocalization) {
      promises.push(
        updateLocalization.mutateAsync({
          localizationId: currentLocalization.id,
          appId,
          attributes: {
            name: name || undefined,
            subtitle: subtitle || undefined,
          },
        }),
      );
    }

    if (hasCategoryChanges && appInfo) {
      promises.push(
        updateAppInfo.mutateAsync({
          appInfoId: appInfo.id,
          appId,
          relationships: {
            primaryCategory: selectedPrimaryCategory
              ? {type: 'appCategories' as const, id: selectedPrimaryCategory}
              : null,
            secondaryCategory: selectedSecondaryCategory
              ? {type: 'appCategories' as const, id: selectedSecondaryCategory}
              : null,
          },
        }),
      );
    }

    await Promise.all(promises);
    setHasLocalizationChanges(false);
    setHasCategoryChanges(false);
  };

  const hasChanges = isEditable && (hasLocalizationChanges || hasCategoryChanges);
  const isSaving = updateLocalization.isPending || updateAppInfo.isPending;
  const isLoading = appLoading || appInfoLoading;
  const primaryLocale = app?.attributes.primaryLocale;

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
          action: isEditable && locale !== primaryLocale ? {
            icon: '-' as const,
            onPress: () => handleDeleteLocalization(locale),
          } : undefined,
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
  }, [localizedLocales, notLocalizedLocales, selectedLocale, primaryLocale, loadingLocales, handleAddLocalization, handleDeleteLocalization, isEditable]);

  if (isLoading) {
    return (
      <Screen>
        <View style={styles.centered}>
          <ActivityIndicator color={colors.primary} />
          <Text variant="body" color={colors.textSecondary} style={styles.mt}>
            Loading app info...
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen padded={false}>
      <NavigationHeader
        title="App Information"
        showBack={false}
        rightAction={
          hasChanges
            ? {
                label: 'Save',
                onPress: handleSave,
                loading: isSaving,
              }
            : undefined
        }
      />
      {!isEditable && (
        <Banner variant="warning">
          This app has no version in progress. Create a new version to edit app information.
        </Banner>
      )}
      <View style={styles.mainLayout}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Localizable Information</Text>
              <Text style={styles.sectionSubtitle}>
                {selectedLocale ? getLocaleName(selectedLocale) : 'Select a language'}
              </Text>
              <View style={styles.card}>
                <View style={styles.field}>
                  <View style={styles.fieldHeader}>
                    <Text style={styles.label}>Name</Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={handleNameChange}
                    placeholder="App name"
                    placeholderTextColor={colors.textTertiary}
                    editable={isEditable}
                  />
                </View>
                <View style={styles.divider} />
                <View style={styles.field}>
                  <View style={styles.fieldHeader}>
                    <Text style={styles.label}>Subtitle</Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    value={subtitle}
                    onChangeText={handleSubtitleChange}
                    placeholder="App subtitle"
                    placeholderTextColor={colors.textTertiary}
                    editable={isEditable}
                  />
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>General Information</Text>
              <View style={styles.card}>
                <View style={styles.fieldRow}>
                  <View style={styles.fieldHalf}>
                    <Text style={styles.label}>Bundle ID</Text>
                    <Text style={[styles.valueText, styles.mono]}>
                      {app?.attributes.bundleId || '—'}
                    </Text>
                  </View>
                  <View style={styles.fieldHalf}>
                    <Text style={styles.label}>Primary Language</Text>
                    <Text style={styles.valueText}>
                      {app?.attributes.primaryLocale
                        ? getLocaleName(app.attributes.primaryLocale)
                        : '—'}
                    </Text>
                  </View>
                </View>
                <View style={styles.divider} />
                <View style={styles.fieldRow}>
                  <View style={styles.fieldHalf}>
                    <Text style={styles.label}>SKU</Text>
                    <Text style={[styles.valueText, styles.mono]}>
                      {app?.attributes.sku || '—'}
                    </Text>
                  </View>
                  <View style={styles.fieldHalf}>
                    <Text style={styles.label}>Apple ID</Text>
                    <Text style={[styles.valueText, styles.mono]}>{app?.id || '—'}</Text>
                  </View>
                </View>
                <View style={styles.divider} />
                <View style={styles.field}>
                  <Text style={styles.label}>Category</Text>
                  <Pressable
                    style={styles.selectField}
                    onPress={() => isEditable && setShowPrimaryCategoryPicker(!showPrimaryCategoryPicker)}
                    disabled={!isEditable}>
                    <Text style={styles.selectText}>
                      {selectedPrimaryCategory
                        ? getCategoryName(selectedPrimaryCategory)
                        : 'Select category'}
                    </Text>
                    <Text style={styles.selectChevron}>▾</Text>
                  </Pressable>
                  {showPrimaryCategoryPicker && (
                    <View style={styles.inlineDropdown}>
                      <ScrollView style={styles.dropdownScroll}>
                        {categories.map(cat => (
                          <Pressable
                            key={cat.id}
                            style={[
                              styles.dropdownOption,
                              cat.id === selectedPrimaryCategory && styles.dropdownOptionSelected,
                            ]}
                            onPress={() => handlePrimaryCategoryChange(cat.id)}>
                            <Text
                              variant="body"
                              color={
                                cat.id === selectedPrimaryCategory
                                  ? colors.primary
                                  : colors.textPrimary
                              }>
                              {getCategoryName(cat.id)}
                            </Text>
                          </Pressable>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
                <View style={styles.divider} />
                <View style={styles.field}>
                  <Text style={styles.label}>Secondary Category (Optional)</Text>
                  <Pressable
                    style={styles.selectField}
                    onPress={() => isEditable && setShowSecondaryCategoryPicker(!showSecondaryCategoryPicker)}
                    disabled={!isEditable}>
                    <Text
                      style={[
                        styles.selectText,
                        !selectedSecondaryCategory && styles.selectTextPlaceholder,
                      ]}>
                      {selectedSecondaryCategory
                        ? getCategoryName(selectedSecondaryCategory)
                        : 'None'}
                    </Text>
                    <Text style={styles.selectChevron}>▾</Text>
                  </Pressable>
                  {showSecondaryCategoryPicker && (
                    <View style={styles.inlineDropdown}>
                      <ScrollView style={styles.dropdownScroll}>
                        <Pressable
                          style={[
                            styles.dropdownOption,
                            !selectedSecondaryCategory && styles.dropdownOptionSelected,
                          ]}
                          onPress={() => handleSecondaryCategoryChange(undefined)}>
                          <Text
                            variant="body"
                            color={!selectedSecondaryCategory ? colors.primary : colors.textTertiary}>
                            None
                          </Text>
                        </Pressable>
                        {categories
                          .filter(cat => cat.id !== selectedPrimaryCategory)
                          .map(cat => (
                            <Pressable
                              key={cat.id}
                              style={[
                                styles.dropdownOption,
                                cat.id === selectedSecondaryCategory && styles.dropdownOptionSelected,
                              ]}
                              onPress={() => handleSecondaryCategoryChange(cat.id)}>
                              <Text
                                variant="body"
                                color={
                                  cat.id === selectedSecondaryCategory
                                    ? colors.primary
                                    : colors.textPrimary
                                }>
                                {getCategoryName(cat.id)}
                              </Text>
                            </Pressable>
                          ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
              </View>
              <Text style={styles.sectionFooter}>
                Primary Language cannot be changed after app creation.
              </Text>
            </View>

            {(updateLocalization.isError || updateAppInfo.isError) && (
              <View style={styles.errorBox}>
                <Text variant="body" color={colors.error}>
                  {updateLocalization.error instanceof Error
                    ? updateLocalization.error.message
                    : updateAppInfo.error instanceof Error
                      ? updateAppInfo.error.message
                      : 'Failed to save changes'}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
        <RightSidebar sections={sidebarSections} />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  mainLayout: {
    flex: 1,
    flexDirection: 'row',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mt: {
    marginTop: spacing.sm,
  },
  content: {
    maxWidth: 560,
    gap: spacing.xl,
  },
  section: {},
  sectionTitle: {
    ...typography.headline,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  sectionFooter: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: spacing.sm,
    marginLeft: spacing.xs,
  },
  inlineDropdown: {
    backgroundColor: colors.content,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownOption: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  dropdownOptionSelected: {
    backgroundColor: colors.selection,
  },
  card: {
    backgroundColor: colors.sidebar,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radii.xl,
    overflow: 'hidden',
  },
  field: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  fieldRow: {
    flexDirection: 'row',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  fieldHalf: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginLeft: spacing.lg,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  input: {
    ...typography.body,
    color: colors.textPrimary,
    padding: 0,
    marginTop: spacing.xs,
  },
  valueText: {
    ...typography.body,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  mono: {
    fontFamily: 'Menlo',
    fontSize: 13,
  },
  selectField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.content,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radii.md,
  },
  selectText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  selectTextPlaceholder: {
    color: colors.textTertiary,
  },
  selectChevron: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  errorBox: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: radii.md,
    padding: spacing.md,
  },
});
