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
  if (!hasVerifiedSchoolEmail(status)) {
    if (requestedStep === 'email') return null;

    const search = new URLSearchParams({step: 'email'});
    if (returnPath) search.set('returnTo', returnPath);
    return `/auth?${search}`;
  }

  if (status === 'COMPLETED') {
    return returnPath ?? '/home';
  }

  return requestedStep === 'complete' ? null : '/home';
};
