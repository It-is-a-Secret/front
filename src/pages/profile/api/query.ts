import {queryOptions} from '@tanstack/react-query';
import {isHTTPError} from 'ky';

import {api, API_ENDPOINT, QUERY_KEYS} from '@/shared/api';

import type {
  GetDiscoveryDetailResponse,
  GetPublicFeedImagesResponse,
} from './type';

const getDiscoveryDetail = async (feedId: number, signal: AbortSignal) => {
  const response = await api
    .get(API_ENDPOINT.discovery.detail(feedId), {signal})
    .json<GetDiscoveryDetailResponse>();

  if (!response.data) {
    throw new Error('프로필 정보가 없습니다.');
  }

  return response;
};

const getPublicFeedImages = (feedId: number, signal: AbortSignal) =>
  api
    .get(API_ENDPOINT.profile.images(feedId), {signal})
    .json<GetPublicFeedImagesResponse>();

export const PROFILE_QUERY_OPTIONS = {
  DETAIL: (feedId: number) =>
    queryOptions({
      queryKey: QUERY_KEYS.discovery.detail(feedId),
      queryFn: ({signal}) => getDiscoveryDetail(feedId, signal),
      enabled: Number.isSafeInteger(feedId) && feedId > 0,
      staleTime: 0,
      refetchOnMount: 'always',
      retry: (failureCount, error) => {
        if (isHTTPError(error) && [403, 404].includes(error.response.status)) {
          return false;
        }
        return failureCount < 1;
      },
    }),
  IMAGES: (feedId: number) =>
    queryOptions({
      queryKey: QUERY_KEYS.profile.images(feedId),
      queryFn: ({signal}) => getPublicFeedImages(feedId, signal),
      enabled: Number.isSafeInteger(feedId) && feedId > 0,
    }),
};
