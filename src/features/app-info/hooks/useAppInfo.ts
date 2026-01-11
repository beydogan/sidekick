import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {apps, appInfo, versions} from '@libs/appStoreConnect';
import type {
  AppInfo,
  AppInfoLocalization,
  AppCategory,
  AppStoreVersion,
  AppStoreVersionLocalization,
} from '@libs/appStoreConnect';

export const appInfoKeys = {
  all: ['app-info'] as const,
  detail: (appId: string) => [...appInfoKeys.all, 'detail', appId] as const,
  infos: (appId: string) => [...appInfoKeys.all, 'infos', appId] as const,
  localizations: (appInfoId: string) =>
    [...appInfoKeys.all, 'localizations', appInfoId] as const,
  categories: () => [...appInfoKeys.all, 'categories'] as const,
  versions: (appId: string) => [...appInfoKeys.all, 'versions', appId] as const,
};

export function useApp(appId: string | undefined) {
  return useQuery({
    queryKey: appInfoKeys.detail(appId || ''),
    queryFn: () => apps.getApp(appId!),
    enabled: !!appId,
  });
}

export function useAppInfos(appId: string | undefined) {
  return useQuery({
    queryKey: appInfoKeys.infos(appId || ''),
    queryFn: () => appInfo.getAppInfos(appId!),
    enabled: !!appId,
    select: data => {
      const infos = data.data;
      const included = data.included || [];
      const localizations = included.filter(
        (item): item is AppInfoLocalization =>
          (item as AppInfoLocalization).type === 'appInfoLocalizations',
      );
      const categories = included.filter(
        (item): item is AppCategory =>
          (item as AppCategory).type === 'appCategories',
      );
      return {infos, localizations, categories};
    },
  });
}

export function useAppCategories() {
  return useQuery({
    queryKey: appInfoKeys.categories(),
    queryFn: () => appInfo.getAppCategories(),
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
    select: data => ({
      ...data,
      data: data.data.filter(
        cat => !cat.id.startsWith('GAMES_') && !cat.id.startsWith('STICKERS_'),
      ),
    }),
  });
}

export function useAppInfoLocalizations(appInfoId: string | undefined) {
  return useQuery({
    queryKey: appInfoKeys.localizations(appInfoId || ''),
    queryFn: () => appInfo.getAppInfoLocalizations(appInfoId!),
    enabled: !!appInfoId,
  });
}

export function useUpdateAppInfoLocalization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      localizationId,
      attributes,
    }: {
      localizationId: string;
      appId: string;
      attributes: {
        name?: string;
        subtitle?: string;
        privacyPolicyUrl?: string;
        privacyChoicesUrl?: string;
        privacyPolicyText?: string;
      };
    }) => appInfo.updateAppInfoLocalization(localizationId, attributes),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: appInfoKeys.infos(variables.appId),
      });
    },
  });
}

export function useCreateAppInfoLocalization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      appInfoId,
      locale,
      attributes,
    }: {
      appInfoId: string;
      appId: string;
      locale: string;
      attributes: {
        name?: string;
        subtitle?: string;
        privacyPolicyUrl?: string;
        privacyChoicesUrl?: string;
        privacyPolicyText?: string;
      };
    }) => appInfo.createAppInfoLocalization(appInfoId, locale, attributes),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: appInfoKeys.infos(variables.appId),
      });
    },
  });
}

export function useUpdateAppInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      appInfoId,
      relationships,
    }: {
      appInfoId: string;
      appId: string;
      relationships: {
        primaryCategory?: {type: 'appCategories'; id: string} | null;
        secondaryCategory?: {type: 'appCategories'; id: string} | null;
      };
    }) => appInfo.updateAppInfo(appInfoId, relationships),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: appInfoKeys.infos(variables.appId),
      });
    },
  });
}

export function useDeleteAppInfoLocalization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      localizationId,
    }: {
      localizationId: string;
      appId: string;
    }) => appInfo.deleteAppInfoLocalization(localizationId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: appInfoKeys.infos(variables.appId),
      });
    },
  });
}

export function useAppStoreVersions(appId: string | undefined) {
  return useQuery({
    queryKey: appInfoKeys.versions(appId || ''),
    queryFn: () => versions.getAppStoreVersionWithLocalizations(appId!),
    enabled: !!appId,
    select: data => {
      const versionList = data.data;
      const included = data.included || [];
      const versionLocalizations = included.filter(
        (item): item is AppStoreVersionLocalization =>
          (item as AppStoreVersionLocalization).type === 'appStoreVersionLocalizations',
      );
      return {versions: versionList, localizations: versionLocalizations};
    },
  });
}

export function useUpdateVersionLocalization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      localizationId,
      attributes,
    }: {
      localizationId: string;
      appId: string;
      attributes: {
        description?: string;
        keywords?: string;
        marketingUrl?: string;
        promotionalText?: string;
        supportUrl?: string;
        whatsNew?: string;
      };
    }) => versions.updateVersionLocalization(localizationId, attributes),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: appInfoKeys.versions(variables.appId),
      });
    },
  });
}

export function useCreateVersionLocalization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      versionId,
      locale,
      attributes,
    }: {
      versionId: string;
      appId: string;
      locale: string;
      attributes: {
        description?: string;
        keywords?: string;
        marketingUrl?: string;
        promotionalText?: string;
        supportUrl?: string;
        whatsNew?: string;
      };
    }) => versions.createVersionLocalization(versionId, locale, attributes),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: appInfoKeys.versions(variables.appId),
      });
    },
  });
}

export function useDeleteVersionLocalization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      localizationId,
    }: {
      localizationId: string;
      appId: string;
    }) => versions.deleteVersionLocalization(localizationId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: appInfoKeys.versions(variables.appId),
      });
    },
  });
}
