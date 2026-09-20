import {queryOptions} from '@tanstack/react-query';

import {api, API_ENDPOINT, QUERY_KEYS} from '@/shared/api';

import type {GetMyProfileResponse} from './type';

const getMyProfile = () =>
  api.get(API_ENDPOINT.profile.me).json<GetMyProfileResponse>();

export const MY_QUERY_OPTIONS = {
  PROFILE: () =>
    queryOptions({
      queryKey: QUERY_KEYS.profile.me(),
      queryFn: getMyProfile,
    }),
};
