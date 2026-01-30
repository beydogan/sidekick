import {get, patch, post, del} from '../client';
import type {
  AppStoreVersion,
  AppStoreVersionLocalization,
  APIListResponse,
  APIResponse,
} from '../types';

export async function listAppStoreVersions(
  appId: string,
): Promise<APIListResponse<AppStoreVersion>> {
  return get<APIListResponse<AppStoreVersion>>(`/apps/${appId}/appStoreVersions`, {
    'fields[appStoreVersions]':
      'versionString,platform,appVersionState,appStoreState,releaseType,createdDate',
    limit: '50',
  });
}

export async function getAppStoreVersions(
  appId: string,
): Promise<APIListResponse<AppStoreVersion>> {
  return get<APIListResponse<AppStoreVersion>>(
    `/apps/${appId}/appStoreVersions`,
    {
      'fields[appStoreVersions]': 'versionString,platform,appVersionState,appStoreState,releaseType,createdDate',
      limit: '5',
    },
  );
}

export async function getVersionLocalizations(
  versionId: string,
): Promise<APIListResponse<AppStoreVersionLocalization>> {
  return get<APIListResponse<AppStoreVersionLocalization>>(
    `/appStoreVersions/${versionId}/appStoreVersionLocalizations`,
    {
      'fields[appStoreVersionLocalizations]': 'locale,description,keywords,marketingUrl,promotionalText,supportUrl,whatsNew',
    },
  );
}

export async function updateVersionLocalization(
  localizationId: string,
  attributes: {
    description?: string;
    keywords?: string;
    marketingUrl?: string;
    promotionalText?: string;
    supportUrl?: string;
    whatsNew?: string;
  },
): Promise<APIResponse<AppStoreVersionLocalization>> {
  return patch<APIResponse<AppStoreVersionLocalization>>(
    `/appStoreVersionLocalizations/${localizationId}`,
    {
      data: {
        type: 'appStoreVersionLocalizations',
        id: localizationId,
        attributes,
      },
    },
  );
}

export async function createVersionLocalization(
  versionId: string,
  locale: string,
  attributes: {
    description?: string;
    keywords?: string;
    marketingUrl?: string;
    promotionalText?: string;
    supportUrl?: string;
    whatsNew?: string;
  },
): Promise<APIResponse<AppStoreVersionLocalization>> {
  return post<APIResponse<AppStoreVersionLocalization>>(
    '/appStoreVersionLocalizations',
    {
      data: {
        type: 'appStoreVersionLocalizations',
        attributes: {
          locale,
          ...attributes,
        },
        relationships: {
          appStoreVersion: {
            data: {
              type: 'appStoreVersions',
              id: versionId,
            },
          },
        },
      },
    },
  );
}

export async function deleteVersionLocalization(
  localizationId: string,
): Promise<void> {
  return del<void>(`/appStoreVersionLocalizations/${localizationId}`);
}
