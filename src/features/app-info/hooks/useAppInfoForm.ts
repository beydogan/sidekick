import {useState, useEffect, useMemo, useCallback} from 'react';
import type {
  AppInfoLocalization,
  AppStoreVersionLocalization,
} from '@libs/appStoreConnect';
import {
  useUpdateAppInfoLocalization,
  useUpdateAppInfo,
  useUpdateVersionLocalization,
} from './useAppInfo';

export interface LocalizableFields {
  name: string;
  subtitle: string;
}

export interface VersionFields {
  promotionalText: string;
  description: string;
  whatsNew: string;
  keywords: string;
  supportUrl: string;
  marketingUrl: string;
}

export interface CategoryFields {
  primary: string | undefined;
  secondary: string | undefined;
}

interface UseAppInfoFormParams {
  appId: string;
  appInfoId: string | undefined;
  currentLocalization: AppInfoLocalization | null;
  currentVersionLocalization: AppStoreVersionLocalization | null;
  initialPrimaryCategory: string | undefined;
  initialSecondaryCategory: string | undefined;
}

export function useAppInfoForm({
  appId,
  appInfoId,
  currentLocalization,
  currentVersionLocalization,
  initialPrimaryCategory,
  initialSecondaryCategory,
}: UseAppInfoFormParams) {
  const updateLocalization = useUpdateAppInfoLocalization();
  const updateAppInfo = useUpdateAppInfo();
  const updateVersionLocalization = useUpdateVersionLocalization();

  // Localizable fields (app info localization)
  const [localizable, setLocalizableState] = useState<LocalizableFields>({
    name: '',
    subtitle: '',
  });

  // Version fields (version localization)
  const [version, setVersionState] = useState<VersionFields>({
    promotionalText: '',
    description: '',
    whatsNew: '',
    keywords: '',
    supportUrl: '',
    marketingUrl: '',
  });

  // Category fields
  const [categories, setCategoriesState] = useState<CategoryFields>({
    primary: undefined,
    secondary: undefined,
  });
  const [categoriesInitialized, setCategoriesInitialized] = useState(false);

  // Sync localizable fields when localization changes
  useEffect(() => {
    if (currentLocalization) {
      setLocalizableState({
        name: currentLocalization.attributes.name || '',
        subtitle: currentLocalization.attributes.subtitle || '',
      });
    }
  }, [currentLocalization]);

  // Sync version fields when version localization changes
  useEffect(() => {
    if (currentVersionLocalization) {
      setVersionState({
        promotionalText: currentVersionLocalization.attributes.promotionalText || '',
        description: currentVersionLocalization.attributes.description || '',
        whatsNew: currentVersionLocalization.attributes.whatsNew || '',
        keywords: currentVersionLocalization.attributes.keywords || '',
        supportUrl: currentVersionLocalization.attributes.supportUrl || '',
        marketingUrl: currentVersionLocalization.attributes.marketingUrl || '',
      });
    }
  }, [currentVersionLocalization]);

  // Initialize categories once
  useEffect(() => {
    if (!categoriesInitialized && (initialPrimaryCategory !== undefined || initialSecondaryCategory !== undefined)) {
      setCategoriesState({
        primary: initialPrimaryCategory,
        secondary: initialSecondaryCategory,
      });
      setCategoriesInitialized(true);
    }
  }, [initialPrimaryCategory, initialSecondaryCategory, categoriesInitialized]);

  // Dirty checking
  const isLocalizableDirty = useMemo(() => {
    if (!currentLocalization) return false;
    return (
      localizable.name !== (currentLocalization.attributes.name || '') ||
      localizable.subtitle !== (currentLocalization.attributes.subtitle || '')
    );
  }, [localizable, currentLocalization]);

  const isVersionDirty = useMemo(() => {
    if (!currentVersionLocalization) return false;
    const orig = currentVersionLocalization.attributes;
    return (
      version.promotionalText !== (orig.promotionalText || '') ||
      version.description !== (orig.description || '') ||
      version.whatsNew !== (orig.whatsNew || '') ||
      version.keywords !== (orig.keywords || '') ||
      version.supportUrl !== (orig.supportUrl || '') ||
      version.marketingUrl !== (orig.marketingUrl || '')
    );
  }, [version, currentVersionLocalization]);

  const isCategoriesDirty = useMemo(() => {
    return (
      categories.primary !== initialPrimaryCategory ||
      categories.secondary !== initialSecondaryCategory
    );
  }, [categories, initialPrimaryCategory, initialSecondaryCategory]);

  const isDirty = isLocalizableDirty || isVersionDirty || isCategoriesDirty;

  // Field setters
  const setName = useCallback((value: string) => {
    setLocalizableState(prev => ({...prev, name: value}));
  }, []);

  const setSubtitle = useCallback((value: string) => {
    setLocalizableState(prev => ({...prev, subtitle: value}));
  }, []);

  const setPromotionalText = useCallback((value: string) => {
    setVersionState(prev => ({...prev, promotionalText: value}));
  }, []);

  const setDescription = useCallback((value: string) => {
    setVersionState(prev => ({...prev, description: value}));
  }, []);

  const setWhatsNew = useCallback((value: string) => {
    setVersionState(prev => ({...prev, whatsNew: value}));
  }, []);

  const setKeywords = useCallback((value: string) => {
    setVersionState(prev => ({...prev, keywords: value}));
  }, []);

  const setSupportUrl = useCallback((value: string) => {
    setVersionState(prev => ({...prev, supportUrl: value}));
  }, []);

  const setMarketingUrl = useCallback((value: string) => {
    setVersionState(prev => ({...prev, marketingUrl: value}));
  }, []);

  const setPrimaryCategory = useCallback((value: string | undefined) => {
    setCategoriesState(prev => ({...prev, primary: value}));
  }, []);

  const setSecondaryCategory = useCallback((value: string | undefined) => {
    setCategoriesState(prev => ({...prev, secondary: value}));
  }, []);

  // Save function
  const save = useCallback(async () => {
    const promises: Promise<unknown>[] = [];

    if (isLocalizableDirty && currentLocalization) {
      promises.push(
        updateLocalization.mutateAsync({
          localizationId: currentLocalization.id,
          appId,
          attributes: {
            name: localizable.name || undefined,
            subtitle: localizable.subtitle || undefined,
          },
        })
      );
    }

    if (isCategoriesDirty && appInfoId) {
      promises.push(
        updateAppInfo.mutateAsync({
          appInfoId,
          appId,
          relationships: {
            primaryCategory: categories.primary
              ? {type: 'appCategories' as const, id: categories.primary}
              : null,
            secondaryCategory: categories.secondary
              ? {type: 'appCategories' as const, id: categories.secondary}
              : null,
          },
        })
      );
    }

    if (isVersionDirty && currentVersionLocalization) {
      promises.push(
        updateVersionLocalization.mutateAsync({
          localizationId: currentVersionLocalization.id,
          appId,
          attributes: {
            promotionalText: version.promotionalText || undefined,
            description: version.description || undefined,
            whatsNew: version.whatsNew || undefined,
            keywords: version.keywords || undefined,
            supportUrl: version.supportUrl || undefined,
            marketingUrl: version.marketingUrl || undefined,
          },
        })
      );
    }

    await Promise.all(promises);
  }, [
    isLocalizableDirty,
    isVersionDirty,
    isCategoriesDirty,
    currentLocalization,
    currentVersionLocalization,
    appInfoId,
    appId,
    localizable,
    version,
    categories,
    updateLocalization,
    updateAppInfo,
    updateVersionLocalization,
  ]);

  const isSaving =
    updateLocalization.isPending ||
    updateAppInfo.isPending ||
    updateVersionLocalization.isPending;

  const error =
    updateLocalization.error ||
    updateAppInfo.error ||
    updateVersionLocalization.error;

  return {
    // Field values
    localizable,
    version,
    categories,

    // Individual setters for AI tools
    setName,
    setSubtitle,
    setPromotionalText,
    setDescription,
    setWhatsNew,
    setKeywords,
    setSupportUrl,
    setMarketingUrl,
    setPrimaryCategory,
    setSecondaryCategory,

    // State
    isDirty,
    isLocalizableDirty,
    isVersionDirty,
    isCategoriesDirty,
    isSaving,
    error,

    // Actions
    save,
  };
}
