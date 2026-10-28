import {queryOptions} from '@tanstack/react-query';

import {api, API_ENDPOINT} from '@/shared/api';
import {getAccessToken} from '@/shared/api/config/auth-token';
import {refreshAccessToken} from '@/shared/api/config/interceptor';
import type {components} from '@/shared/types/schema';

import {restoreSession} from './model/restore-session';

export const authSessionQueryOptions = () =>
  queryOptions({
    queryKey: ['auth', 'session'] as const,
    queryFn: () =>
      restoreSession({
        getAccessToken,
        refreshAccessToken,
        getProfile: () =>
          api
            .get(API_ENDPOINT.profile.me, {
              context: {skipAuthRedirect: true},
            })
            .json<components['schemas']['DataResponseMemberProfileResponse']>(),
      }),
    staleTime: Infinity,
    retry: false,
  });
