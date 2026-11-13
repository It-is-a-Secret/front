import {infiniteQueryOptions} from '@tanstack/react-query';
import {QUERY_KEYS} from '@/shared/api/config/query-key';

import type {GetDiscoveryParams, GetDiscoveryResponse} from '../api/type';

export const discoveryInfiniteQueryOptions = (
  getDiscovery: (params: GetDiscoveryParams) => Promise<GetDiscoveryResponse>
) =>
  infiniteQueryOptions({
    queryKey: QUERY_KEYS.discovery.infinite(),
    initialPageParam: 0,
    queryFn: async ({pageParam}) => {
      const response = await getDiscovery({
        page: pageParam,
      });
      if (!response.data) throw new Error('프로필 목록이 없습니다.');
      return response;
    },
    // The response has no last-page flag; confirm exhaustion with an empty page.
    getNextPageParam: (lastPage, _pages, lastPageParam) => {
      if (!lastPage.data?.length) return undefined;
      return lastPageParam + 1;
    },
  });
