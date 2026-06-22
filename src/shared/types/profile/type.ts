import type {paths} from '@/shared/types/schema';

export type GetMyProfileResponse =
  paths['/api/members/me']['get']['responses'][200]['content']['*/*'];
