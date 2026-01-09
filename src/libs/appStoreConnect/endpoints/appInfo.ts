import {get, patch, del} from '../client';
import type {
  AppInfo,
  AppInfoLocalization,
  AppCategory,
  APIListResponse,
  APIResponse,
} from '../types';

export async function getAppInfos(
  appId: string,
): Promise<APIListResponse<AppInfo>> {
  // Don't restrict fields[appInfos] so relationships are included in response
  return get<APIListResponse<AppInfo>>(`/apps/${appId}/appInfos`, {
    include: 'appInfoLocalizations,primaryCategory,secondaryCategory',
    'fields[appInfoLocalizations]':
      'locale,name,subtitle,privacyPolicyUrl,privacyChoicesUrl,privacyPolicyText',
    'fields[appCategories]': 'platforms',
    'limit[appInfoLocalizations]': '50',
  });
}

export async function getAppInfoLocalizations(
  appInfoId: string,
): Promise<APIListResponse<AppInfoLocalization>> {
  return get<APIListResponse<AppInfoLocalization>>(
    `/appInfos/${appInfoId}/appInfoLocalizations`,
    {
      'fields[appInfoLocalizations]':
        'locale,name,subtitle,privacyPolicyUrl,privacyChoicesUrl,privacyPolicyText',
    },
  );
}

export async function updateAppInfoLocalization(
  localizationId: string,
  attributes: {
    name?: string;
    subtitle?: string;
    privacyPolicyUrl?: string;
    privacyChoicesUrl?: string;
    privacyPolicyText?: string;
  },
): Promise<APIResponse<AppInfoLocalization>> {
  return patch<APIResponse<AppInfoLocalization>>(
    `/appInfoLocalizations/${localizationId}`,
    {
      data: {
        type: 'appInfoLocalizations',
        id: localizationId,
        attributes,
      },
    },
  );
}

export async function createAppInfoLocalization(
  appInfoId: string,
  locale: string,
  attributes: {
    name?: string;
    subtitle?: string;
    privacyPolicyUrl?: string;
    privacyChoicesUrl?: string;
    privacyPolicyText?: string;
  },
): Promise<APIResponse<AppInfoLocalization>> {
  const {post} = await import('../client');
  return post<APIResponse<AppInfoLocalization>>('/appInfoLocalizations', {
    data: {
      type: 'appInfoLocalizations',
      attributes: {
        locale,
        ...attributes,
      },
      relationships: {
        appInfo: {
          data: {
            type: 'appInfos',
            id: appInfoId,
          },
        },
      },
    },
  });
}

export async function getAppCategories(): Promise<APIListResponse<AppCategory>> {
  return get<APIListResponse<AppCategory>>('/appCategories', {
    'fields[appCategories]': 'platforms',
    'filter[platforms]': 'IOS',
    limit: '200',
  });
}

export async function updateAppInfo(
  appInfoId: string,
  relationships: {
    primaryCategory?: {type: 'appCategories'; id: string} | null;
    secondaryCategory?: {type: 'appCategories'; id: string} | null;
  },
): Promise<APIResponse<AppInfo>> {
  const data: Record<string, unknown> = {
    type: 'appInfos',
    id: appInfoId,
  };

  if (relationships.primaryCategory !== undefined) {
    data.relationships = {
      ...(data.relationships as object),
      primaryCategory: {
        data: relationships.primaryCategory,
      },
    };
  }

  if (relationships.secondaryCategory !== undefined) {
    data.relationships = {
      ...(data.relationships as object),
      secondaryCategory: {
        data: relationships.secondaryCategory,
      },
    };
  }

  return patch<APIResponse<AppInfo>>(`/appInfos/${appInfoId}`, {data});
}

export async function deleteAppInfoLocalization(
  localizationId: string,
): Promise<void> {
  return del<void>(`/appInfoLocalizations/${localizationId}`);
}
