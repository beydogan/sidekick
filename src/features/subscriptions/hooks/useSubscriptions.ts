import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {subscriptions} from '../../../libs/appStoreConnect';
import type {CreateSubscriptionGroupRequest, CreateSubscriptionRequest} from '../../../libs/appStoreConnect';

// Query keys
export const subscriptionKeys = {
  all: ['subscriptions'] as const,
  groups: (appId: string) => [...subscriptionKeys.all, 'groups', appId] as const,
  list: (groupId: string) => [...subscriptionKeys.all, 'list', groupId] as const,
  pricePoints: (subscriptionId: string, territoryId?: string) =>
    [...subscriptionKeys.all, 'pricePoints', subscriptionId, territoryId] as const,
  prices: (subscriptionId: string) =>
    [...subscriptionKeys.all, 'prices', subscriptionId] as const,
};

/**
 * Fetch subscription groups for an app
 */
export function useSubscriptionGroups(appId: string | undefined) {
  return useQuery({
    queryKey: subscriptionKeys.groups(appId || ''),
    queryFn: () => subscriptions.listSubscriptionGroups(appId!),
    enabled: !!appId,
  });
}

/**
 * Fetch subscriptions in a group
 */
export function useSubscriptions(groupId: string | undefined) {
  return useQuery({
    queryKey: subscriptionKeys.list(groupId || ''),
    queryFn: () => subscriptions.listSubscriptions(groupId!),
    enabled: !!groupId,
  });
}

/**
 * Fetch price points for a subscription
 */
export function useSubscriptionPricePoints(
  subscriptionId: string | undefined,
  territoryId?: string,
) {
  return useQuery({
    queryKey: subscriptionKeys.pricePoints(subscriptionId || '', territoryId),
    queryFn: () =>
      subscriptions.getSubscriptionPricePoints(subscriptionId!, territoryId),
    enabled: !!subscriptionId,
  });
}

/**
 * Fetch price points for specific territories
 */
export function usePricePointsForTerritories(
  subscriptionId: string | undefined,
  territoryCodes: string[],
) {
  return useQuery({
    queryKey: subscriptionKeys.pricePoints(subscriptionId || '', territoryCodes.join(',')),
    queryFn: () => subscriptions.getPricePointsForTerritories(subscriptionId!, territoryCodes),
    enabled: !!subscriptionId && territoryCodes.length > 0,
    staleTime: 1000 * 60 * 60, // 1 hour - price points rarely change
    gcTime: 1000 * 60 * 60, // Keep in cache for 1 hour
  });
}

/**
 * Fetch current prices for a subscription
 */
export function useSubscriptionPrices(subscriptionId: string | undefined) {
  return useQuery({
    queryKey: subscriptionKeys.prices(subscriptionId || ''),
    queryFn: () => subscriptions.getSubscriptionPrices(subscriptionId!),
    enabled: !!subscriptionId,
  });
}

/**
 * Mutation to create/update subscription price
 */
export function useCreateSubscriptionPrice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      subscriptionId,
      pricePointId,
      startDate,
    }: {
      subscriptionId: string;
      pricePointId: string;
      startDate?: string;
    }) =>
      subscriptions.createSubscriptionPrice(
        subscriptionId,
        pricePointId,
        startDate,
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.prices(variables.subscriptionId),
      });
    },
  });
}

export type TerritoryStatus = 'pending' | 'saving' | 'saved' | 'error';

/**
 * Mutation to apply PPP prices to multiple territories (parallel batches)
 */
export function useApplyPPPPrices() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      subscriptionId,
      prices,
      startDate,
      onProgress,
    }: {
      subscriptionId: string;
      prices: Array<{pricePointId: string; territoryCode: string}>;
      startDate?: string;
      onProgress?: (territoryCode: string, status: TerritoryStatus) => void;
    }) => {
      console.log(`[ApplyPPP] Starting to apply prices for ${prices.length} territories`);
      const startTime = Date.now();
      const results: Array<{territoryCode: string; success: boolean; error?: string}> = [];

      // Mark all as saving initially
      prices.forEach(p => onProgress?.(p.territoryCode, 'saving'));

      // Process in parallel batches
      const BATCH_SIZE = 10;
      for (let i = 0; i < prices.length; i += BATCH_SIZE) {
        const batch = prices.slice(i, i + BATCH_SIZE);
        const batchResults = await Promise.all(
          batch.map(async (price) => {
            try {
              await subscriptions.createSubscriptionPrice(
                subscriptionId,
                price.pricePointId,
                price.territoryCode,
                startDate,
              );
              onProgress?.(price.territoryCode, 'saved');
              return {territoryCode: price.territoryCode, success: true};
            } catch (err) {
              const errorMsg = err instanceof Error ? err.message : 'Unknown error';
              console.error(`[ApplyPPP] Failed for ${price.territoryCode}:`, errorMsg);
              onProgress?.(price.territoryCode, 'error');
              return {territoryCode: price.territoryCode, success: false, error: errorMsg};
            }
          })
        );
        results.push(...batchResults);
        console.log(`[ApplyPPP] Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${results.length}/${prices.length} completed`);
      }

      const elapsed = Date.now() - startTime;
      const successCount = results.filter(r => r.success).length;
      console.log(`[ApplyPPP] Completed: ${successCount}/${prices.length} succeeded in ${elapsed}ms`);

      return results;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.prices(variables.subscriptionId),
      });
    },
  });
}

/**
 * Mutation to create a subscription group
 */
export function useCreateSubscriptionGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      appId,
      request,
    }: {
      appId: string;
      request: CreateSubscriptionGroupRequest;
    }) => subscriptions.createSubscriptionGroup(appId, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.groups(variables.appId),
      });
    },
  });
}

/**
 * Mutation to create a subscription
 */
export function useCreateSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      request,
    }: {
      groupId: string;
      request: CreateSubscriptionRequest;
    }) => subscriptions.createSubscription(groupId, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.list(variables.groupId),
      });
    },
  });
}
