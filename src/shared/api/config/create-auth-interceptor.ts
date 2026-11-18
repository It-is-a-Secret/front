import ky from 'ky';

import {isAuthenticationError} from '../../auth/model/session-error';

import {clearAccessToken, getAccessToken, setAccessToken} from './auth-token';

interface AuthInterceptorDependencies {
  requestAccessToken: () => Promise<string | undefined>;
  redirectToLogin: () => void;
}

interface UnauthorizedResponseParams {
  request: Request;
  response: Response;
  retryCount: number;
  options: {context: Record<string, unknown>};
}

export const createAuthInterceptor = ({
  requestAccessToken,
  redirectToLogin,
}: AuthInterceptorDependencies) => {
  let refreshPromise: Promise<string> | null = null;

  const handleCheckAndSetToken = (request: Request) => {
    const token = getAccessToken();

    if (token) {
      request.headers.set('Authorization', `Bearer ${token}`);
    }
  };

  const refreshAccessToken = () => {
    if (!refreshPromise) {
      refreshPromise = requestAccessToken()
        .then((accessToken) => {
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

  const handleUnauthorizedResponse = async ({
    request,
    response,
    retryCount,
    options,
  }: UnauthorizedResponseParams) => {
    if (response.status !== 401 || retryCount > 0) {
      return response;
    }

    try {
      // 다른 요청이 이미 갱신했다면 늦게 도착한 401에도 새 토큰을 사용합니다.
      const currentToken = getAccessToken();
      const accessToken =
        currentToken &&
        request.headers.get('Authorization') !== `Bearer ${currentToken}`
          ? currentToken
          : await refreshAccessToken();
      const headers = new Headers(request.headers);

      headers.set('Authorization', `Bearer ${accessToken}`);

      return ky.retry({
        code: 'TOKEN_REFRESHED',
        request: new Request(request, {headers}),
      });
    } catch (error) {
      if (isAuthenticationError(error)) {
        clearAccessToken();
        if (!options.context.skipAuthRedirect) {
          redirectToLogin();
        }
      }

      throw error;
    }
  };

  return {
    handleCheckAndSetToken,
    refreshAccessToken,
    handleUnauthorizedResponse,
  };
};
