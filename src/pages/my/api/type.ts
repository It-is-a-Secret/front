import type {components} from '@/shared/types/schema';

export type GetMyProfileResponse =
  components['schemas']['DataResponseMemberProfileResponse'];

export type MemberProfile = components['schemas']['MemberProfileResponse'];
export type ProfileEditStatus = components['schemas']['ProfileEditItemStatus'];
// The API documents null as the explicit "unknown MBTI" value.
export type UpdateProfileRequest = Omit<
  components['schemas']['ProfileUpdateRequest'],
  'mbti'
> & {mbti: NonNullable<MemberProfile['mbti']> | null};
export type NicknameAvailabilityResponse =
  components['schemas']['DataResponseNickNameAvailabilityResponse'];
