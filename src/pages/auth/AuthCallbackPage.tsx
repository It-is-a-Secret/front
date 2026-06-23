import {useEffect, useRef, useState} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';

import {publicApi} from '@/shared/api/config/instance';
import {API_ENDPOINT} from '@/shared/api/end-point';
import type {
  KakaoCallbackResponse,
} from '@/shared/types/auth/type';

export const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const authorizationCode = searchParams.get('code');
  const hasRequestedCallback = useRef(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!authorizationCode) return;

    if (hasRequestedCallback.current) {
      return;
    }

    hasRequestedCallback.current = true;

    const completeKakaoLogin = async () => {
      const callbackRequestKey = `kakaoCallback:${authorizationCode}`;

      if (sessionStorage.getItem(callbackRequestKey)) {
        return;
      }

      sessionStorage.setItem(callbackRequestKey, 'requested');

      const redirectUri =
        sessionStorage.getItem('kakaoRedirectUri') ??
        new URL('/auth/callback', window.location.origin).toString();

      const query = {
        code: authorizationCode,
        redirect_uri: redirectUri,
      };

      try {
        const {data} = await publicApi
          .get(API_ENDPOINT.auth.kakaoCallback, {searchParams: query})
          .json<KakaoCallbackResponse>();
        const accessToken = data?.accessToken;

        if (!accessToken) {
          throw new Error('카카오 로그인 응답에 accessToken이 없습니다.');
        }

        localStorage.setItem('accessToken', accessToken);
        navigate('/auth?step=email', {replace: true});
      } catch (error) {
        console.error('카카오 로그인 처리에 실패했습니다.', error);
        setErrorMessage('카카오 로그인 처리에 실패했습니다.');
      }
    };

    void completeKakaoLogin();
  }, [authorizationCode, navigate]);

  const displayedErrorMessage = authorizationCode
    ? errorMessage
    : '카카오 인가 코드가 없습니다.';

  if (displayedErrorMessage) {
    return (
      <section className='flex min-h-dvh flex-col items-center justify-center gap-4'>
        <p>{displayedErrorMessage}</p>
        <button type='button' onClick={() => navigate('/auth', {replace: true})}>
          로그인 화면으로 돌아가기
        </button>
      </section>
    );
  }

  return (
    <section className='flex min-h-dvh items-center justify-center'>
      카카오 로그인 처리 중...
    </section>
  );
};
