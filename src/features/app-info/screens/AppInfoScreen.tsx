import React, {useState, useEffect, useMemo} from 'react';
import {View, StyleSheet, ActivityIndicator, ScrollView} from 'react-native';
import {Screen, Text, TextInput, Pressable} from '@ui';
import {colors, spacing, radii, typography} from '@theme';
import {
  useApp,
  useAppInfos,
  useAppCategories,
  useUpdateAppInfoLocalization,
  useUpdateAppInfo,
} from '../hooks/useAppInfo';

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
  'it-IT': 'Italian',
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

  const [selectedLocale, setSelectedLocale] = useState<string | null>(null);
  const [showLocalePicker, setShowLocalePicker] = useState(false);
  const [showPrimaryCategoryPicker, setShowPrimaryCategoryPicker] = useState(false);
  const [showSecondaryCategoryPicker, setShowSecondaryCategoryPicker] = useState(false);
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [selectedPrimaryCategory, setSelectedPrimaryCategory] = useState<string | undefined>(undefined);
  const [selectedSecondaryCategory, setSelectedSecondaryCategory] = useState<string | undefined>(undefined);
  const [hasLocalizationChanges, setHasLocalizationChanges] = useState(false);
  const [hasCategoryChanges, setHasCategoryChanges] = useState(false);
  const [categoriesInitialized, setCategoriesInitialized] = useState(false);

  const app = appData?.data;
  // Use the editable appInfo (PREPARE_FOR_SUBMISSION) if available, otherwise use READY_FOR_SALE
  const appInfo = appInfoData?.infos?.find(
    info => info.attributes.appStoreState === 'PREPARE_FOR_SUBMISSION',
  ) || appInfoData?.infos?.find(
    info => info.attributes.appStoreState === 'READY_FOR_SALE',
  ) || appInfoData?.infos?.[0];
  const localizations = appInfoData?.localizations || [];
  const categories = categoriesData?.data || [];

  const currentPrimaryCategoryId = appInfo?.relationships?.primaryCategory?.data?.id;
  const currentSecondaryCategoryId = appInfo?.relationships?.secondaryCategory?.data?.id;

  const currentLocalization = useMemo(() => {
    if (!selectedLocale) return null;
    return localizations.find(l => l.attributes.locale === selectedLocale);
  }, [localizations, selectedLocale]);

  // Set initial locale to primary locale
  useEffect(() => {
    if (app?.attributes.primaryLocale && !selectedLocale) {
      setSelectedLocale(app.attributes.primaryLocale);
    }
  }, [app?.attributes.primaryLocale, selectedLocale]);

  // Set initial categories when data loads
  useEffect(() => {
    if (appInfo && !categoriesInitialized) {
      setSelectedPrimaryCategory(currentPrimaryCategoryId);
      setSelectedSecondaryCategory(currentSecondaryCategoryId);
      setCategoriesInitialized(true);
    }
  }, [appInfo, currentPrimaryCategoryId, currentSecondaryCategoryId, categoriesInitialized]);

  // Update form when localization changes
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

  const hasChanges = hasLocalizationChanges || hasCategoryChanges;
  const isSaving = updateLocalization.isPending || updateAppInfo.isPending;
  const isLoading = appLoading || appInfoLoading;

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
    <Screen>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <View style={styles.header}>
            <Text variant="title">App Information</Text>
            <Text variant="body" color={colors.textSecondary} style={styles.subtitle}>
              Any changes will be released with your next app version.
            </Text>
          </View>
          {hasChanges && (
            <Pressable
              style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={isSaving}>
              {isSaving ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text variant="bodyMedium" color="#FFFFFF">
                  Save
                </Text>
              )}
            </Pressable>
          )}
        </View>

        <View style={styles.content}>
          {/* Localizable Information Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Localizable Information</Text>
              <Pressable
                style={styles.localePicker}
                onPress={() => setShowLocalePicker(!showLocalePicker)}>
                <Text variant="body" color={colors.primary}>
                  {selectedLocale ? getLocaleName(selectedLocale) : 'Select locale'}
                </Text>
                <Text style={styles.chevron}>▾</Text>
              </Pressable>
            </View>

            {showLocalePicker && (
              <View style={styles.dropdown}>
                {localizations.map(loc => (
                  <Pressable
                    key={loc.id}
                    style={[
                      styles.dropdownOption,
                      loc.attributes.locale === selectedLocale && styles.dropdownOptionSelected,
                    ]}
                    onPress={() => {
                      setSelectedLocale(loc.attributes.locale);
                      setShowLocalePicker(false);
                    }}>
                    <Text
                      variant="body"
                      color={
                        loc.attributes.locale === selectedLocale
                          ? colors.primary
                          : colors.textPrimary
                      }>
                      {getLocaleName(loc.attributes.locale)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}

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
                />
              </View>
            </View>
          </View>

          {/* General Information Section */}
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
                  onPress={() => setShowPrimaryCategoryPicker(!showPrimaryCategoryPicker)}>
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
                  onPress={() => setShowSecondaryCategoryPicker(!showSecondaryCategoryPicker)}>
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
    </Screen>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  header: {
    flex: 1,
  },
  subtitle: {
    marginTop: spacing.xs,
  },
  content: {
    maxWidth: 560,
    gap: spacing.xl,
  },
  section: {},
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.headline,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  sectionFooter: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: spacing.sm,
    marginLeft: spacing.xs,
  },
  localePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  chevron: {
    color: colors.primary,
    fontSize: 12,
  },
  dropdown: {
    backgroundColor: colors.content,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
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
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    minWidth: 60,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  errorBox: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: radii.md,
    padding: spacing.md,
  },
});
