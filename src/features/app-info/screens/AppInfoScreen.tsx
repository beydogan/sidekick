import React, {useMemo} from 'react';
import {View, StyleSheet, ActivityIndicator, ScrollView} from 'react-native';
import {Screen, Text, NavigationHeader, Banner} from '@ui';
import {RightSidebar} from '@ui/composite';
import {colors, spacing} from '@theme';
import {useApp, useAppInfos, useAppCategories, useAppStoreVersions} from '../hooks/useAppInfo';
import {useAppInfoForm} from '../hooks/useAppInfoForm';
import {useLocaleManager} from '../hooks/useLocaleManager';
import {useAIContext, useAIContextValue} from '@features/ai-assistant';
import {useAppInfoAIContext} from '../hooks/useAppInfoAIContext';
import {LocalizableInfoSection} from '../components/LocalizableInfoSection';
import {GeneralInfoSection} from '../components/GeneralInfoSection';
import {getCategoryName} from '../constants';

interface AppInfoScreenProps {
  appId: string;
  appName?: string;
}

export const AppInfoScreen: React.FC<AppInfoScreenProps> = ({appId}) => {
  // Data fetching
  const {data: appData, isLoading: appLoading} = useApp(appId);
  const {data: appInfoData, isLoading: appInfoLoading} = useAppInfos(appId);
  const {data: versionsData, isLoading: versionsLoading} = useAppStoreVersions(appId);
  const {data: categoriesData} = useAppCategories();

  const app = appData?.data;
  const categories = categoriesData?.data || [];

  // Find editable app info (PREPARE_FOR_SUBMISSION or REJECTED)
  const editableAppInfo = appInfoData?.infos?.find(
    info =>
      info.attributes.appStoreState === 'PREPARE_FOR_SUBMISSION' ||
      info.attributes.appStoreState === 'REJECTED',
  );
  const displayAppInfo =
    editableAppInfo ||
    appInfoData?.infos?.find(info => info.attributes.appStoreState === 'READY_FOR_SALE') ||
    appInfoData?.infos?.[0];
  const isEditable = !!editableAppInfo;

  // Editable version
  const editableVersion = versionsData?.editableVersion;

  // Locale management
  const localeManager = useLocaleManager({
    appId,
    appInfoId: displayAppInfo?.id,
    primaryLocale: app?.attributes.primaryLocale,
    appName: app?.attributes.name,
    allLocalizations: appInfoData?.localizations || [],
    allVersionLocalizations: versionsData?.localizations || [],
    localizationIds:
      displayAppInfo?.relationships?.appInfoLocalizations?.data?.map((l: {id: string}) => l.id) ||
      [],
    isEditable,
  });

  // Form state
  const form = useAppInfoForm({
    appId,
    appInfoId: displayAppInfo?.id,
    currentLocalization: localeManager.currentLocalization,
    currentVersionLocalization: localeManager.currentVersionLocalization,
    initialPrimaryCategory: displayAppInfo?.relationships?.primaryCategory?.data?.id,
    initialSecondaryCategory: displayAppInfo?.relationships?.secondaryCategory?.data?.id,
  });

  // AI Context
  const {aiModifiedFields, clearAIModified} = useAIContextValue();
  const availableCategories = useMemo(
    () => categories.map(c => ({id: c.id, name: getCategoryName(c.id)})),
    [categories],
  );

  const aiContext = useAppInfoAIContext({
    app: app ? {id: app.id, attributes: app.attributes} : null,
    selectedLocale: localeManager.selectedLocale,
    localizedLocales: localeManager.localizedLocales,
    notLocalizedLocales: localeManager.notLocalizedLocales,
    isEditable,
    version: editableVersion?.attributes.versionString ?? null,
    name: form.localizable.name,
    subtitle: form.localizable.subtitle,
    promotionalText: form.version.promotionalText,
    description: form.version.description,
    whatsNew: form.version.whatsNew,
    keywords: form.version.keywords,
    supportUrl: form.version.supportUrl,
    marketingUrl: form.version.marketingUrl,
    selectedPrimaryCategory: form.categories.primary,
    selectedSecondaryCategory: form.categories.secondary,
    availableCategories,
    setName: form.setName,
    setSubtitle: form.setSubtitle,
    setPromotionalText: form.setPromotionalText,
    setDescription: form.setDescription,
    setWhatsNew: form.setWhatsNew,
    setKeywords: form.setKeywords,
    setSupportUrl: form.setSupportUrl,
    setMarketingUrl: form.setMarketingUrl,
    handlePrimaryCategoryChange: form.setPrimaryCategory,
    handleSecondaryCategoryChange: form.setSecondaryCategory,
    setSelectedLocale: localeManager.setSelectedLocale,
    handleAddLocalization: localeManager.handleAddLocalization,
    handleDeleteLocalization: localeManager.handleDeleteLocalization,
  });

  useAIContext(aiContext);

  const isLoading = appLoading || appInfoLoading || versionsLoading;
  const hasChanges = isEditable && form.isDirty;

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
                onPress: form.save,
                loading: form.isSaving,
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
            {form.error && (
                <View style={styles.errorBox}>
                  <Text variant="body" color={colors.error}>
                    {form.error instanceof Error ? form.error.message : 'Failed to save changes'}
                  </Text>
                </View>
              )}
            <LocalizableInfoSection
              selectedLocale={localeManager.selectedLocale}
              localizable={form.localizable}
              version={form.version}
              isEditable={isEditable}
              aiModifiedFields={aiModifiedFields}
              clearAIModified={clearAIModified}
              onNameChange={form.setName}
              onSubtitleChange={form.setSubtitle}
              onPromotionalTextChange={form.setPromotionalText}
              onDescriptionChange={form.setDescription}
              onWhatsNewChange={form.setWhatsNew}
              onKeywordsChange={form.setKeywords}
              onSupportUrlChange={form.setSupportUrl}
              onMarketingUrlChange={form.setMarketingUrl}
            />

            <GeneralInfoSection
              app={app}
              versionString={editableVersion?.attributes.versionString}
              categories={categories}
              primaryCategory={form.categories.primary}
              secondaryCategory={form.categories.secondary}
              isEditable={isEditable}
              onPrimaryCategoryChange={form.setPrimaryCategory}
              onSecondaryCategoryChange={form.setSecondaryCategory}
            />
          </View>
        </ScrollView>
        <RightSidebar sections={localeManager.sidebarSections} />
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
  errorBox: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: 6,
    padding: spacing.md,
  },
});
