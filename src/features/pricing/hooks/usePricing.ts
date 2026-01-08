import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {pricing, apps} from '../../../libs/appStoreConnect';

export const pricingKeys = {
  all: ['pricing'] as const,
  schedule: (appId: string) => [...pricingKeys.all, 'schedule', appId] as const,
  pricePoints: (appId: string) =>
    [...pricingKeys.all, 'pricePoints', appId] as const,
};

export const appKeys = {
  all: ['apps'] as const,
  list: () => [...appKeys.all, 'list'] as const,
  detail: (appId: string) => [...appKeys.all, 'detail', appId] as const,
};

export function useApps(options?: {enabled?: boolean}) {
  return useQuery({
    queryKey: appKeys.list(),
    queryFn: () => apps.listApps(),
    enabled: options?.enabled ?? true,
  });
}

export function usePriceSchedule(appId: string | undefined) {
  return useQuery({
    queryKey: pricingKeys.schedule(appId || ''),
    queryFn: () => pricing.getAppPriceSchedule(appId!),
    enabled: !!appId,
  });
}

export function usePricePoints(appId: string | undefined) {
  return useQuery({
    queryKey: pricingKeys.pricePoints(appId || ''),
    queryFn: () => pricing.getPricePoints(appId!, 'USA'),
    enabled: !!appId,
  });
}

export function useUpdateBasePrice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      appId,
      pricePointId,
      startDate,
    }: {
      appId: string;
      pricePointId: string;
      startDate?: string;
    }) => pricing.updateBasePrice(appId, pricePointId, startDate),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: pricingKeys.schedule(variables.appId),
      });
    },
  });
}

export function useDeletePrice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({priceId, appId}: {priceId: string; appId: string}) =>
      pricing.deletePrice(priceId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: pricingKeys.schedule(variables.appId),
      });
    },
  });
}
