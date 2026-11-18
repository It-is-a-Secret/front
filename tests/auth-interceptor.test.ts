import assert from 'node:assert/strict';
import {afterEach, beforeEach, test} from 'node:test';
import ky, {isHTTPError} from 'ky';

import {
  getAccessToken,
  setAccessToken,
} from '../src/shared/api/config/auth-token';
import {createAuthInterceptor} from '../src/shared/api/config/create-auth-interceptor';
import {restoreSession} from '../src/shared/auth/model/restore-session';
import {isAuthenticationError} from '../src/shared/auth/model/session-error';

const originalLocalStorage = globalThis.localStorage;

beforeEach(() => {
  setAccessToken(null);
  globalThis.localStorage = {
    length: 0,
    clear: () => {},
    getItem: () => null,
    key: () => null,
    removeItem: () => {},
    setItem: () => {},
  };
});

afterEach(() => {
  setAccessToken(null);
  globalThis.localStorage = originalLocalStorage;
});

const deferred = <T>() => {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((finish) => {
    resolve = finish;
  });
  return {promise, resolve};
};

const createClient = (
  respond: (request: Request) => Response | Promise<Response>
) => {
  const requests: Request[] = [];
  let redirects = 0;
  const fetch: typeof globalThis.fetch = async (input, init) => {
    const request = input instanceof Request ? input : new Request(input, init);
    requests.push(request.clone());
    return respond(request);
  };
  const refreshApi = ky.create({credentials: 'include', retry: 0, fetch});
  const interceptor = createAuthInterceptor({
    requestAccessToken: () =>
      refreshApi
        .post('https://api.example/api/auth/token/refresh')
        .json<{data?: {accessToken?: string}}>()
        .then(({data}) => data?.accessToken),
    redirectToLogin: () => {
      redirects++;
    },
  });
  const api = ky.create({
    credentials: 'include',
    fetch,
    retry: {limit: 1, methods: [], statusCodes: [], delay: () => 0},
    hooks: {
      beforeRequest: [
        ({request}) => interceptor.handleCheckAndSetToken(request),
      ],
      afterResponse: [interceptor.handleUnauthorizedResponse],
    },
  });

  return {...interceptor, api, requests, getRedirects: () => redirects};
};

const refreshed = () => Response.json({data: {accessToken: 'new-token'}});
const unauthorized = () => new Response(null, {status: 401});
const isRefresh = (request: Request) =>
  new URL(request.url).pathname === '/api/auth/token/refresh';

test('restores a cold-start session through refresh before fetching the profile', async () => {
  const client = createClient((request) => {
    if (isRefresh(request)) return refreshed();
    assert.equal(request.headers.get('Authorization'), 'Bearer new-token');
    return Response.json({data: {id: 42}});
  });
  const session = await restoreSession({
    getAccessToken,
    refreshAccessToken: client.refreshAccessToken,
    getProfile: () =>
      client.api.get('https://api.example/api/members/me').json(),
  });

  assert.equal(session.memberId, 42);
  assert.deepEqual(
    client.requests.map((request) => new URL(request.url).pathname),
    ['/api/auth/token/refresh', '/api/members/me']
  );
  assert.ok(
    client.requests.every((request) => request.credentials === 'include')
  );
  assert.equal(client.getRedirects(), 0);
});

test('refreshes an expired token and retries a POST with its original body', async () => {
  setAccessToken('old-token');
  const client = createClient(async (request) => {
    if (isRefresh(request)) return refreshed();
    if (request.headers.get('Authorization') === 'Bearer old-token') {
      return unauthorized();
    }
    assert.equal(request.headers.get('Authorization'), 'Bearer new-token');
    assert.deepEqual(await request.json(), {content: '안녕하세요'});
    return Response.json({sent: true});
  });

  assert.deepEqual(
    await client.api
      .post('https://api.example/messages', {json: {content: '안녕하세요'}})
      .json(),
    {sent: true}
  );
  assert.equal(client.requests.filter(isRefresh).length, 1);
});

test('shares an in-flight refresh between concurrent unauthorized requests', async () => {
  setAccessToken('old-token');
  const refreshReply = deferred<Response>();
  const bothUnauthorized = deferred<void>();
  let unauthorizedCount = 0;
  const client = createClient((request) => {
    if (isRefresh(request)) return refreshReply.promise;
    if (request.headers.get('Authorization') === 'Bearer old-token') {
      if (++unauthorizedCount === 2) bothUnauthorized.resolve();
      return unauthorized();
    }
    return Response.json({ok: true});
  });

  const first = client.api.get('https://api.example/first').json();
  const second = client.api.get('https://api.example/second').json();
  await bothUnauthorized.promise;
  refreshReply.resolve(refreshed());
  await Promise.all([first, second]);

  assert.equal(client.requests.filter(isRefresh).length, 1);
  assert.equal(client.getRedirects(), 0);
});

test('reuses the latest token for an old 401 arriving after refresh has finished', async () => {
  setAccessToken('old-token');
  const lateReply = deferred<Response>();
  const lateRequestStarted = deferred<void>();
  const client = createClient((request) => {
    if (isRefresh(request)) return refreshed();
    if (request.headers.get('Authorization') === 'Bearer old-token') {
      if (request.url.endsWith('/late')) {
        lateRequestStarted.resolve();
        return lateReply.promise;
      }
      return unauthorized();
    }
    assert.equal(request.headers.get('Authorization'), 'Bearer new-token');
    return Response.json({ok: true});
  });

  const late = client.api.get('https://api.example/late').json();
  await lateRequestStarted.promise;
  await client.api.get('https://api.example/first').json();
  lateReply.resolve(unauthorized());
  await late;

  assert.equal(client.requests.filter(isRefresh).length, 1);
});

for (const status of [401, 403]) {
  for (const skipAuthRedirect of [false, true]) {
    test(`refresh ${status} clears authentication, skipAuthRedirect=${skipAuthRedirect}`, async () => {
      setAccessToken('old-token');
      const client = createClient((request) =>
        isRefresh(request) ? new Response(null, {status}) : unauthorized()
      );

      await assert.rejects(
        client.api.get('https://api.example/protected', {
          context: {skipAuthRedirect},
        }),
        isAuthenticationError
      );
      assert.equal(getAccessToken(), null);
      assert.equal(client.getRedirects(), skipAuthRedirect ? 0 : 1);
    });
  }
}

for (const failure of ['network', 'server', 'invalid-response'] as const) {
  test(`refresh ${failure} failure preserves the token and does not redirect`, async () => {
    setAccessToken('old-token');
    const client = createClient((request) => {
      if (!isRefresh(request)) return unauthorized();
      if (failure === 'network') throw new TypeError('Failed to fetch');
      if (failure === 'server') return new Response(null, {status: 503});
      return Response.json({data: {}});
    });

    await assert.rejects(
      client.api.get('https://api.example/protected'),
      (error) => {
        assert.equal(isAuthenticationError(error), false);
        if (failure === 'server') {
          assert.ok(isHTTPError(error));
          assert.equal(error.response.status, 503);
        }
        return true;
      }
    );
    assert.equal(getAccessToken(), 'old-token');
    assert.equal(client.getRedirects(), 0);
  });
}

test('a failed cold-start refresh can recover on retry', async () => {
  let refreshCalls = 0;
  const client = createClient((request) => {
    if (isRefresh(request)) {
      return ++refreshCalls === 1
        ? new Response(null, {status: 503})
        : refreshed();
    }
    return Response.json({data: {id: 42}});
  });

  await assert.rejects(client.refreshAccessToken());
  assert.equal(await client.refreshAccessToken(), 'new-token');
  assert.equal(refreshCalls, 2);
  assert.equal(client.getRedirects(), 0);
});

test('a repeated 401 after refresh stops after one replay', async () => {
  setAccessToken('old-token');
  const client = createClient((request) =>
    isRefresh(request) ? refreshed() : unauthorized()
  );

  await assert.rejects(
    client.api.get('https://api.example/protected'),
    isAuthenticationError
  );
  assert.equal(client.requests.filter(isRefresh).length, 1);
  assert.equal(
    client.requests.filter((request) => !isRefresh(request)).length,
    2
  );
});
