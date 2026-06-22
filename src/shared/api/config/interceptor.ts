import ky from 'ky';

interface RefreshTokenResponse {
  timestamp: string;
  data: {
    accessToken: string;
    tokenType: string;
    expiresIn: number;
  };
}

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
      .post('/api/auth/token/refresh')
      .json<RefreshTokenResponse>()
      .then(({data}) => {
        localStorage.setItem('accessToken', data.accessToken);
        return data.accessToken;
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
