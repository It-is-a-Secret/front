import assert from 'node:assert/strict';
import {test} from 'node:test';

import {
  getAuthPageDestination,
  hasVerifiedSchoolEmail,
} from '../src/shared/auth/model/registration-status';

test('only verified and completed members have verified their school email', () => {
  assert.equal(hasVerifiedSchoolEmail('UNVERIFIED'), false);
  assert.equal(hasVerifiedSchoolEmail(undefined), false);
  assert.equal(hasVerifiedSchoolEmail('VERIFIED'), true);
  assert.equal(hasVerifiedSchoolEmail('COMPLETED'), true);
});

test('resumes email verification when an unverified member reopens login', () => {
  assert.equal(
    getAuthPageDestination('UNVERIFIED', null, null),
    '/auth?step=email'
  );
  assert.equal(
    getAuthPageDestination('UNVERIFIED', null, '/chat/42'),
    '/auth?step=email&returnTo=%2Fchat%2F42'
  );
  assert.equal(getAuthPageDestination('UNVERIFIED', 'email', null), null);
});

test('does not let an unverified member open the completion URL or a chat return path', () => {
  assert.equal(
    getAuthPageDestination('UNVERIFIED', 'complete', '/chat/42'),
    '/auth?step=email&returnTo=%2Fchat%2F42'
  );
});

test('requires email verification when registration status is missing', () => {
  for (const step of [null, 'complete', 'unexpected']) {
    assert.equal(
      getAuthPageDestination(undefined, step, '/chat/42'),
      '/auth?step=email&returnTo=%2Fchat%2F42'
    );
  }
  assert.equal(getAuthPageDestination(undefined, 'email', null), null);
});

test('allows a verified member to view the verification completion step', () => {
  assert.equal(getAuthPageDestination('VERIFIED', 'complete', null), null);
});

test('shows the completion step when verification succeeds on the email route', () => {
  assert.equal(
    getAuthPageDestination('VERIFIED', 'email', null),
    '/auth?step=complete'
  );
  assert.equal(
    getAuthPageDestination('VERIFIED', 'email', '/chat/42'),
    '/auth?step=complete&returnTo=%2Fchat%2F42'
  );
});

test('preserves home browsing for verified members who postponed onboarding', () => {
  assert.equal(getAuthPageDestination('VERIFIED', null, '/chat/42'), '/home');
});

test('returns completed members to their chat or home from every auth step', () => {
  for (const step of [null, 'email', 'complete']) {
    assert.equal(getAuthPageDestination('COMPLETED', step, null), '/home');
    assert.equal(
      getAuthPageDestination('COMPLETED', step, '/chat/42'),
      '/chat/42'
    );
  }
});
