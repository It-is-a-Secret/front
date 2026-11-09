import type {components} from '../../types/schema';

type ProfileResponse =
  components['schemas']['DataResponseMemberProfileResponse'];

interface RestoreSessionDependencies {
  getAccessToken: () => string | null;
  refreshAccessToken: () => Promise<string>;
  getProfile: () => Promise<ProfileResponse>;
}

export const restoreSession = async ({
  getAccessToken,
  refreshAccessToken,
  getProfile,
}: RestoreSessionDependencies) => {
  if (!getAccessToken()) {
    await refreshAccessToken();
  }

  const profile = await getProfile();
  const memberId = profile.data?.id;

  if (
    typeof memberId !== 'number' ||
    !Number.isSafeInteger(memberId) ||
    memberId <= 0
  ) {
    throw new Error('내 정보 응답에 올바른 회원 ID가 없습니다.');
  }

  return {memberId, profile};
};
