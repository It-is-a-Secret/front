import assert from 'node:assert/strict';
import {test} from 'node:test';

import {restoreSession} from '../src/shared/auth/model/restore-session';

test('waits for token refresh before loading the member profile', async () => {
  const calls: string[] = [];
  let finishRefresh!: (token: string) => void;
  const refresh = new Promise<string>((resolve) => {
    finishRefresh = resolve;
  });
  const session = restoreSession({
    getAccessToken: () => null,
    refreshAccessToken: async () => {
      calls.push('refresh');
      return refresh;
    },
    getProfile: async () => {
      calls.push('profile');
      return {data: {id: 42}};
    },
  });

  assert.deepEqual(calls, ['refresh']);
  finishRefresh('new-token');
  assert.equal((await session).memberId, 42);
  assert.deepEqual(calls, ['refresh', 'profile']);
});

test('uses an existing login token without refreshing it', async () => {
  const session = await restoreSession({
    getAccessToken: () => 'login-token',
    refreshAccessToken: async () => {
      throw new Error('Unexpected refresh');
    },
    getProfile: async () => ({data: {id: 42}}),
  });

  assert.equal(session.memberId, 42);
});

test('does not load protected member data when refresh fails', async () => {
  const failure = new Error('Refresh failed');
  let profileRequested = false;

  await assert.rejects(
    restoreSession({
      getAccessToken: () => null,
      refreshAccessToken: async () => {
        throw failure;
      },
      getProfile: async () => {
        profileRequested = true;
        return {data: {id: 42}};
      },
    }),
    failure
  );

  assert.equal(profileRequested, false);
});

test('rejects missing or invalid member IDs instead of authenticating', async () => {
  for (const id of [undefined, 0, -1, 1.5, Number.MAX_SAFE_INTEGER + 1]) {
    await assert.rejects(
      restoreSession({
        getAccessToken: () => 'token',
        refreshAccessToken: async () => 'unused',
        getProfile: async () => ({data: {id}}),
      }),
      /회원 ID/
    );
  }
});
