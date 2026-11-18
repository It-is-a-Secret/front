import ky from 'ky';

import {createAuthInterceptor} from '@/shared/api/config/create-auth-interceptor';
import {API_ENDPOINT} from '@/shared/api/end-point';
import type {RefreshTokenResponse} from '@/shared/types/auth/type';

const refreshApi = ky.create({
  credentials: 'include',
  retry: 0,
});

export const {
  handleCheckAndSetToken,
  refreshAccessToken,
  handleUnauthorizedResponse,
} = createAuthInterceptor({
  requestAccessToken: () =>
    refreshApi
      .post(API_ENDPOINT.auth.refreshToken)
      .json<RefreshTokenResponse>()
      .then(({data}) => data?.accessToken),
  redirectToLogin: () => window.location.replace('/auth'),
});
