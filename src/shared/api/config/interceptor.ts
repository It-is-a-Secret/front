import ky from 'ky';

import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from '@/shared/api/config/auth-token';
import {API_ENDPOINT} from '@/shared/api/end-point';
import type {RefreshTokenResponse} from '@/shared/types/auth/type';

const refreshApi = ky.create({
  prefix: import.meta.env.VITE_BASE_URL,
  credentials: 'include',
  retry: 0,
});

let refreshPromise: Promise<string> | null = null;

export const handleCheckAndSetToken = (request: Request) => {
  const token = getAccessToken();

  if (token) {
    request.headers.set('Authorization', `Bearer ${token}`);
  }
};

export const refreshAccessToken = () => {
  if (!refreshPromise) {
    refreshPromise = refreshApi
      .post(API_ENDPOINT.auth.refreshToken)
      .json<RefreshTokenResponse>()
      .then(({data}) => {
        const accessToken = data?.accessToken;

        if (!accessToken) {
          throw new Error('토큰 재발급 응답에 accessToken이 없습니다.');
        }

        setAccessToken(accessToken);
        return accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

interface UnauthorizedResponseParams {
  request: Request;
  response: Response;
  retryCount: number;
  options: {context: Record<string, unknown>};
}

export const handleUnauthorizedResponse = async ({
  request,
  response,
  retryCount,
  options,
}: UnauthorizedResponseParams) => {
  if (response.status !== 401 || retryCount > 0) {
    return response;
  }

  try {
    const accessToken = await refreshAccessToken();
    const headers = new Headers(request.headers);

    headers.set('Authorization', `Bearer ${accessToken}`);

    return ky.retry({
      code: 'TOKEN_REFRESHED',
      request: new Request(request, {headers}),
    });
  } catch (error) {
    clearAccessToken();
    if (options.context.skipAuthRedirect) {
      throw error;
    }
    window.location.replace('/auth');

    return response;
  }
};
