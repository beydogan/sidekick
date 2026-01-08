import {get, post, getByUrl} from '../client';
import type {
  SubscriptionGroup,
  Subscription,
  SubscriptionPricePoint,
  SubscriptionPrice,
  APIResponse,
  APIListResponse,
} from '../types';

// List subscription groups for an app
export async function listSubscriptionGroups(
  appId: string,
): Promise<APIListResponse<SubscriptionGroup>> {
  return get<APIListResponse<SubscriptionGroup>>(
    `/apps/${appId}/subscriptionGroups`,
    {
      limit: '200',
    },
  );
}

// List subscriptions in a group
export async function listSubscriptions(
  groupId: string,
): Promise<APIListResponse<Subscription>> {
  return get<APIListResponse<Subscription>>(
    `/subscriptionGroups/${groupId}/subscriptions`,
    {
      limit: '200',
    },
  );
}

// Get price points for a subscription
export async function getSubscriptionPricePoints(
  subscriptionId: string,
  territoryId?: string,
): Promise<APIListResponse<SubscriptionPricePoint>> {
  const params: Record<string, string> = {limit: '200', include: 'territory'};
  if (territoryId) {
    params['filter[territory]'] = territoryId;
  }
  return get<APIListResponse<SubscriptionPricePoint>>(
    `/subscriptions/${subscriptionId}/pricePoints`,
    params,
  );
}

// Get price points by full URL (for pagination)
export async function getSubscriptionPricePointsUrl(
  url: string,
): Promise<APIListResponse<SubscriptionPricePoint>> {
  return getByUrl<APIListResponse<SubscriptionPricePoint>>(url);
}

// Get price points for specific territories (parallel fetch)
// NOTE: Consider using static tier lookup from priceTiers.ts instead for better performance
export async function getPricePointsForTerritories(
  subscriptionId: string,
  territoryCodes: string[],
): Promise<{data: SubscriptionPricePoint[]; byTerritory: Record<string, SubscriptionPricePoint[]>}> {
  const BATCH_SIZE = 10;
  const byTerritory: Record<string, SubscriptionPricePoint[]> = {};
  const allPricePoints: SubscriptionPricePoint[] = [];

  for (let i = 0; i < territoryCodes.length; i += BATCH_SIZE) {
    const batch = territoryCodes.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(
      batch.map(async (territory) => {
        try {
          const response = await get<APIListResponse<SubscriptionPricePoint>>(
            `/subscriptions/${subscriptionId}/pricePoints`,
            {limit: '200', 'filter[territory]': territory},
          );
          return {territory, data: response.data};
        } catch (err) {
          console.warn(`[PricePoints] Failed to fetch for ${territory}:`, err);
          return {territory, data: []};
        }
      })
    );

    for (const result of batchResults) {
      byTerritory[result.territory] = result.data;
      allPricePoints.push(...result.data);
    }
  }

  return {data: allPricePoints, byTerritory};
}

// Get current prices for a subscription
export async function getSubscriptionPrices(
  subscriptionId: string,
): Promise<APIListResponse<SubscriptionPrice>> {
  return get<APIListResponse<SubscriptionPrice>>(
    `/subscriptions/${subscriptionId}/prices`,
    {
      limit: '200',
      include: 'subscriptionPricePoint,territory',
    },
  );
}

// Create subscription price for a territory
export async function createSubscriptionPrice(
  subscriptionId: string,
  pricePointId: string,
  territoryCode?: string,
  startDate?: string,
): Promise<APIResponse<SubscriptionPrice>> {
  console.log(`[ApplyPrice] Creating price for ${territoryCode || 'unknown'}: subscription=${subscriptionId}, pricePoint=${pricePointId}`);

  const data: {
    type: string;
    attributes?: {startDate: string};
    relationships: {
      subscription: {data: {type: string; id: string}};
      subscriptionPricePoint: {data: {type: string; id: string}};
    };
  } = {
    type: 'subscriptionPrices',
    relationships: {
      subscription: {
        data: {type: 'subscriptions', id: subscriptionId},
      },
      subscriptionPricePoint: {
        data: {type: 'subscriptionPricePoints', id: pricePointId},
      },
    },
  };

  if (startDate) {
    data.attributes = {startDate};
  }

  const result = await post<APIResponse<SubscriptionPrice>>('/subscriptionPrices', {data});
  console.log(`[ApplyPrice] Success for ${territoryCode || 'unknown'}:`, result.data.id);
  return result;
}
