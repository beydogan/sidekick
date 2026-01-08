import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {subscriptions} from '../../../libs/appStoreConnect';

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
 * Fetch ALL price points for a subscription (all territories)
 */
export function useAllSubscriptionPricePoints(subscriptionId: string | undefined) {
  return useQuery({
    queryKey: subscriptionKeys.pricePoints(subscriptionId || '', 'all'),
    queryFn: () => subscriptions.getAllSubscriptionPricePoints(subscriptionId!),
    enabled: !!subscriptionId,
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

/**
 * Mutation to apply PPP prices to multiple territories
 */
export function useApplyPPPPrices() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      subscriptionId,
      prices,
      startDate,
    }: {
      subscriptionId: string;
      prices: Array<{pricePointId: string; territoryCode: string}>;
      startDate?: string;
    }) => {
      const results: Array<{territoryCode: string; success: boolean; error?: string}> = [];

      for (const price of prices) {
        try {
          await subscriptions.createSubscriptionPrice(
            subscriptionId,
            price.pricePointId,
            startDate,
          );
          results.push({territoryCode: price.territoryCode, success: true});
        } catch (err) {
          results.push({
            territoryCode: price.territoryCode,
            success: false,
            error: err instanceof Error ? err.message : 'Unknown error',
          });
        }
      }

      return results;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.prices(variables.subscriptionId),
      });
    },
  });
}
