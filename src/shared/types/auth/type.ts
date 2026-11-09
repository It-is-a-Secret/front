import type {paths} from '@/shared/types/schema';

export type SendSchoolEmailCodeRequest =
  paths['/api/members/me/school-email/verification-codes']['post']['requestBody']['content']['application/json'];

export type VerifySchoolEmailRequest =
  paths['/api/members/me/school-email/verifications']['post']['requestBody']['content']['application/json'];

export type RefreshTokenResponse =
  paths['/api/auth/token/refresh']['post']['responses'][200]['content']['*/*'];

export type KakaoCallbackQuery =
  paths['/api/auth/oauth/kakao/callback']['get']['parameters']['query'];

export type KakaoCallbackResponse =
  paths['/api/auth/oauth/kakao/callback']['get']['responses'][200]['content']['*/*'];
