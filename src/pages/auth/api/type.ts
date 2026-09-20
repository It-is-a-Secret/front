import type {components, operations} from '@/shared/types/schema';

export type SendSchoolEmailCodeRequest =
  components['schemas']['SendSchoolEmailCodeRequest'];
export type VerifySchoolEmailRequest =
  components['schemas']['VerifySchoolEmailRequest'];
export type KakaoAuthorizeQuery =
  operations['kakaoAuthorize']['parameters']['query'];
export type KakaoCallbackQuery =
  operations['kakaoCallback']['parameters']['query'];
export type AuthTokenResponse =
  components['schemas']['DataResponseAuthTokenResponse'];
