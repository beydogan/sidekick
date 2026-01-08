import {get, post} from '../client';
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
  const params: Record<string, string> = {limit: '200'};
  if (territoryId) {
    params['filter[territory]'] = territoryId;
  }
  return get<APIListResponse<SubscriptionPricePoint>>(
    `/subscriptions/${subscriptionId}/pricePoints`,
    params,
  );
}

// Get ALL price points for a subscription (all territories, handles pagination)
export async function getAllSubscriptionPricePoints(
  subscriptionId: string,
): Promise<{data: SubscriptionPricePoint[]; byTerritory: Record<string, SubscriptionPricePoint[]>}> {
  const allPricePoints: SubscriptionPricePoint[] = [];
  let nextUrl: string | null = `/subscriptions/${subscriptionId}/pricePoints?limit=200&include=territory`;

  // Paginate through all price points
  while (nextUrl) {
    const response = await get<APIListResponse<SubscriptionPricePoint>>(nextUrl);
    allPricePoints.push(...response.data);
    nextUrl = response.links?.next || null;
  }

  // Group by territory
  const byTerritory: Record<string, SubscriptionPricePoint[]> = {};
  for (const pricePoint of allPricePoints) {
    const territoryId = pricePoint.relationships?.territory?.data?.id;
    if (territoryId) {
      if (!byTerritory[territoryId]) {
        byTerritory[territoryId] = [];
      }
      byTerritory[territoryId].push(pricePoint);
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
  startDate?: string,
): Promise<APIResponse<SubscriptionPrice>> {
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

  return post<APIResponse<SubscriptionPrice>>('/subscriptionPrices', {data});
}
