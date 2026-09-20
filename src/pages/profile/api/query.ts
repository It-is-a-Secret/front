import {queryOptions} from '@tanstack/react-query';

import {api, API_ENDPOINT, QUERY_KEYS} from '@/shared/api';

import type {GetPublicFeedImagesResponse} from './type';

const getPublicFeedImages = (feedId: number) =>
  api
    .get(API_ENDPOINT.profile.images(feedId))
    .json<GetPublicFeedImagesResponse>();

export const PROFILE_QUERY_OPTIONS = {
  IMAGES: (feedId: number) =>
    queryOptions({
      queryKey: QUERY_KEYS.profile.images(feedId),
      queryFn: () => getPublicFeedImages(feedId),
    }),
};
