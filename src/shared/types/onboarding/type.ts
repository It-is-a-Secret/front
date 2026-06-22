import type {paths} from '@/shared/types/schema';

export type CompleteOnboardingRequest =
  paths['/api/members/me/onboarding']['post']['requestBody']['content']['application/json'];

export type CompleteOnboardingResponse =
  paths['/api/members/me/onboarding']['post']['responses'][200]['content']['*/*'];
