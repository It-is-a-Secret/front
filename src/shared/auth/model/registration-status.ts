import type {components} from '../../types/schema';

type RegistrationStatus =
  components['schemas']['MemberProfileResponse']['registrationStatus'];

export const hasVerifiedSchoolEmail = (status: RegistrationStatus) =>
  status === 'VERIFIED' || status === 'COMPLETED';

export const getAuthPageDestination = (
  status: RegistrationStatus,
  requestedStep: string | null,
  returnPath: string | null
): string | null => {
  if (status === 'COMPLETED') {
    return returnPath ?? '/home';
  }

  const step = status === 'VERIFIED' ? 'complete' : 'email';
  if (requestedStep === step) return null;
  if (status === 'VERIFIED' && requestedStep !== 'email') return '/home';

  const search = new URLSearchParams({step});
  if (returnPath) search.set('returnTo', returnPath);
  return `/auth?${search}`;
};
