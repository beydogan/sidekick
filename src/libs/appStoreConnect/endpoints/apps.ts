import {get} from '../client';
import type {App, APIListResponse} from '../types';

export async function listApps(): Promise<APIListResponse<App>> {
  return get<APIListResponse<App>>('/apps', {
    'fields[apps]': 'name,bundleId,sku,primaryLocale',
    limit: '200',
  });
}

export async function getApp(appId: string): Promise<{data: App}> {
  return get<{data: App}>(`/apps/${appId}`, {
    'fields[apps]': 'name,bundleId,sku,primaryLocale',
  });
}
