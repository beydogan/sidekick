import {get} from '../client';
import type {AppStoreVersion, APIListResponse} from '../types';

export async function listAppStoreVersions(
  appId: string,
): Promise<APIListResponse<AppStoreVersion>> {
  return get<APIListResponse<AppStoreVersion>>(`/apps/${appId}/appStoreVersions`, {
    'fields[appStoreVersions]':
      'versionString,platform,appVersionState,appStoreState,releaseType,createdDate',
    limit: '50',
  });
}
