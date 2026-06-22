import ky from 'ky';

import {API_ENDPOINT} from '@/shared/api/end-point';
import type {RefreshTokenResponse} from '@/shared/types/auth/type';

const refreshApi = ky.create({
  prefix: import.meta.env.VITE_BASE_URL,
  credentials: 'include',
  retry: 0,
});

let refreshPromise: Promise<string> | null = null;

export const handleCheckAndSetToken = (request: Request) => {
  const token = localStorage.getItem('accessToken');

  if (token) {
    request.headers.set('Authorization', `Bearer ${token}`);
  }
};

const refreshAccessToken = () => {
  if (!refreshPromise) {
    refreshPromise = refreshApi
      .post(API_ENDPOINT.auth.refreshToken)
      .json<RefreshTokenResponse>()
      .then(({data}) => {
        const accessToken = data?.accessToken;

        if (!accessToken) {
          throw new Error('토큰 재발급 응답에 accessToken이 없습니다.');
        }

        localStorage.setItem('accessToken', accessToken);
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
}

export const handleUnauthorizedResponse = async ({
  request,
  response,
  retryCount,
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
  } catch {
    localStorage.removeItem('accessToken');
    window.location.replace('/auth');

    return response;
  }
};
