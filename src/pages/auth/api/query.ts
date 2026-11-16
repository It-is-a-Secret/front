import {mutationOptions} from '@tanstack/react-query';
import {isHTTPError} from 'ky';

import {api, API_ENDPOINT, publicApi} from '@/shared/api';
import {
  getCurrentChatPushSubscription,
  runChatPushOperation,
  setChatPushDisabledOnDevice,
} from '@/shared/pwa/chat-push';
import type {components} from '@/shared/types/schema';

import type {
  AuthTokenResponse,
  KakaoCallbackQuery,
  SendSchoolEmailCodeRequest,
  VerifySchoolEmailRequest,
} from './type';

const sendSchoolEmailCode = async (body: SendSchoolEmailCodeRequest) => {
  try {
    await api.post(API_ENDPOINT.auth.sendSchoolEmailCode, {json: body});
  } catch (error) {
    if (isHTTPError(error)) {
      const data = error.data as {message?: string} | undefined;

      throw new Error(data?.message || '인증 코드 발송에 실패했습니다.', {
        cause: error,
      });
    }

    throw new Error('네트워크 연결을 확인한 뒤 다시 시도해 주세요.', {
      cause: error,
    });
  }
};

const verifySchoolEmail = async (body: VerifySchoolEmailRequest) => {
  try {
    await api.post(API_ENDPOINT.auth.verifySchoolEmail, {json: body});
  } catch (error) {
    if (isHTTPError(error)) {
      const data = error.data as {message?: string} | undefined;
      const message =
        error.response.status === 400
          ? '인증번호가 일치하지 않아요'
          : data?.message || '인증 코드 확인에 실패했습니다.';

      throw new Error(message, {
        cause: error,
      });
    }

    throw new Error('네트워크 연결을 확인한 뒤 다시 시도해 주세요.', {
      cause: error,
    });
  }
};

const kakaoCallback = (params: KakaoCallbackQuery) =>
  publicApi
    .get(API_ENDPOINT.auth.kakaoCallback, {searchParams: params})
    .json<AuthTokenResponse>();

const logout = () =>
  runChatPushOperation(async () => {
    const subscription = await getCurrentChatPushSubscription().catch(
      () => null
    );
    const body: components['schemas']['LogoutRequest'] | undefined =
      subscription ? {endpoint: subscription.endpoint} : undefined;
    const response = await api.post(API_ENDPOINT.auth.logout, {json: body});
    setChatPushDisabledOnDevice(true);
    await subscription?.unsubscribe().catch(() => undefined);
    return response;
  });

export const AUTH_MUTATION_OPTIONS = {
  SEND_SCHOOL_EMAIL_CODE: () =>
    mutationOptions({mutationFn: sendSchoolEmailCode}),
  VERIFY_SCHOOL_EMAIL: () => mutationOptions({mutationFn: verifySchoolEmail}),
  KAKAO_CALLBACK: () => mutationOptions({mutationFn: kakaoCallback}),
  LOGOUT: () => mutationOptions({mutationFn: logout}),
};
