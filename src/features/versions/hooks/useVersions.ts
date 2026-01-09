import {useQuery} from '@tanstack/react-query';
import {versions} from '@libs/appStoreConnect';

export const versionKeys = {
  all: ['versions'] as const,
  list: (appId: string) => [...versionKeys.all, 'list', appId] as const,
};

export function useAppStoreVersions(appId: string | undefined) {
  return useQuery({
    queryKey: versionKeys.list(appId || ''),
    queryFn: () => versions.listAppStoreVersions(appId!),
    enabled: !!appId,
  });
}
