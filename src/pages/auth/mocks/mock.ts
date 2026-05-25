export type AuthStep = 'login' | 'email' | 'code' | 'complete';

export const AUTH_EMAIL_DOMAIN = '@gs.anyang.ac.kr';

export const AUTH_MOCK = {
  emailId: 'abcde',
  attemptCount: 1,
  maxAttemptCount: 5,
  expireSeconds: 10 * 60,
} as const;

export const AUTH_STEP_PROGRESS: Record<AuthStep, number> = {
  login: 0,
  email: 50,
  code: 100,
  complete: 100,
};
