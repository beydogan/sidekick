import {get, post, patch, del} from '../client';
import type {
  AppPriceSchedule,
  AppPrice,
  AppPricePoint,
  Territory,
  APIResponse,
  APIListResponse,
} from '../types';

// Get app's price schedule
export async function getAppPriceSchedule(
  appId: string,
): Promise<APIResponse<AppPriceSchedule>> {
  return get<APIResponse<AppPriceSchedule>>(
    `/apps/${appId}/appPriceSchedule`,
    {
      include: 'baseTerritory,manualPrices,automaticPrices',
    },
  );
}

// Get manual prices for a schedule
export async function getManualPrices(
  scheduleId: string,
): Promise<APIListResponse<AppPrice>> {
  return get<APIListResponse<AppPrice>>(
    `/appPriceSchedules/${scheduleId}/manualPrices`,
    {
      include: 'appPricePoint,territory',
    },
  );
}

// Get available price points for an app in a territory
export async function getPricePoints(
  appId: string,
  territoryId: string = 'USA',
): Promise<APIListResponse<AppPricePoint>> {
  return get<APIListResponse<AppPricePoint>>('/appPricePoints', {
    'filter[app]': appId,
    'filter[territory]': territoryId,
    limit: '200',
  });
}

// Get all territories
export async function getTerritories(): Promise<APIListResponse<Territory>> {
  return get<APIListResponse<Territory>>('/territories', {
    limit: '200',
  });
}

// Create/update price schedule with new base price
export async function updateBasePrice(
  appId: string,
  pricePointId: string,
  startDate?: string,
): Promise<APIResponse<AppPriceSchedule>> {
  const manualPrice: {
    type: string;
    attributes: {startDate?: string};
    relationships: {
      appPricePoint: {data: {type: string; id: string}};
    };
  } = {
    type: 'appPrices',
    attributes: {},
    relationships: {
      appPricePoint: {
        data: {type: 'appPricePoints', id: pricePointId},
      },
    },
  };

  if (startDate) {
    manualPrice.attributes.startDate = startDate;
  }

  return post<APIResponse<AppPriceSchedule>>('/appPriceSchedules', {
    data: {
      type: 'appPriceSchedules',
      relationships: {
        app: {
          data: {type: 'apps', id: appId},
        },
        baseTerritory: {
          data: {type: 'territories', id: 'USA'},
        },
        manualPrices: {
          data: [manualPrice],
        },
      },
    },
    included: [manualPrice],
  });
}

// Update an existing price
export async function updatePrice(
  priceId: string,
  pricePointId: string,
): Promise<APIResponse<AppPrice>> {
  return patch<APIResponse<AppPrice>>(`/appPrices/${priceId}`, {
    data: {
      type: 'appPrices',
      id: priceId,
      relationships: {
        appPricePoint: {
          data: {type: 'appPricePoints', id: pricePointId},
        },
      },
    },
  });
}

// Delete a scheduled price
export async function deletePrice(priceId: string): Promise<void> {
  await del<void>(`/appPrices/${priceId}`);
}
