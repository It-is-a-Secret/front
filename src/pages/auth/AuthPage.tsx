import {useState} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';

import {
  AUTH_EMAIL_DOMAIN,
  AUTH_MOCK,
  AUTH_STEP_PROGRESS,
} from '@/pages/auth/mocks/mock';
import type {AuthStep} from '@/pages/auth/mocks/mock';
import {CodeAuthStep} from '@/pages/auth/steps/CodeAuthStep';
import {CompleteAuthStep} from '@/pages/auth/steps/CompleteAuthStep';
import {EmailAuthStep} from '@/pages/auth/steps/EmailAuthStep';
import {LoginAuthStep} from '@/pages/auth/steps/LoginAuthStep';
import {API_ENDPOINT} from '@/shared/api/end-point';
import {Header} from '@/shared/components/Header';
import {IcSvgLeft} from '@/shared/icons';

export const AuthPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const stepParam = searchParams.get('step');
  const initialStep: AuthStep =
    stepParam === 'email' || stepParam === 'complete' ? stepParam : 'login';
  const [step, setStep] = useState<AuthStep>(initialStep);
  const [emailId, setEmailId] = useState('');
  const [code, setCode] = useState('');

  const email = `${emailId || AUTH_MOCK.emailId}${AUTH_EMAIL_DOMAIN}`;

  const handleKakaoLogin = () => {
    const kakaoAuthorizeUrl = new URL(
      API_ENDPOINT.auth.kakaoAuthorize,
      import.meta.env.VITE_BASE_URL,
    );

    const redirectUri = new URL(
      '/auth/callback',
      window.location.origin,
    ).toString();

    sessionStorage.setItem('kakaoRedirectUri', redirectUri);
    kakaoAuthorizeUrl.searchParams.set('redirect_uri', redirectUri);

    window.location.href = kakaoAuthorizeUrl.toString();
  };

  const handleBackToEmail = () => {
    setCode('');
    setStep('email');
  };

  const handleMoveComplete = () => {
    setStep('complete');
    navigate('/auth?step=complete', {replace: true});
  };

  const handleBack = () => {
    if (step === 'code') {
      handleBackToEmail();
      return;
    }

    if (step === 'email') {
      setStep('login');
    }
  };

  const renderStepContent = () => {
    if (step === 'code') {
      return (
        <CodeAuthStep
          email={email}
          code={code}
          onCodeChange={setCode}
          onConfirm={handleMoveComplete}
          onResend={() => setCode('')}
        />
      );
    }

    return (
      <EmailAuthStep
        emailId={emailId}
        onEmailIdChange={setEmailId}
        onSubmit={() => setStep('code')}
      />
    );
  };

  if (step === 'login') {
    return <LoginAuthStep onKakaoLogin={handleKakaoLogin} />;
  }

  if (step === 'complete') {
    return (
      <CompleteAuthStep
        onNext={() => navigate('/onboarding')}
        onLater={() => navigate('/home')}
      />
    );
  }

  return (
    <section className='flex min-h-dvh flex-col'>
      <Header
        leftItem={
          <IcSvgLeft width={24} height={24} className='text-gray-400' />
        }
        onClickLeft={handleBack}
        rightItem={
          <span className='text-caption1-12r text-gray-400'>건너뛰기</span>
        }
        onClickRight={handleMoveComplete}
        hasProgress
        progress={AUTH_STEP_PROGRESS[step]}
      />
      {renderStepContent()}
    </section>
  );
};
