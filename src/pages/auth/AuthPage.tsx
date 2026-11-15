import {useRef, useState} from 'react';
import {useMutation} from '@tanstack/react-query';
import {useNavigate, useSearchParams} from 'react-router-dom';

import {AUTH_MUTATION_OPTIONS} from '@/pages/auth/api/query';
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
import {ToastMessage} from '@/pages/my/components/ToastMessage';
import {API_ENDPOINT} from '@/shared/api/end-point';
import {Header} from '@/shared/components/Header';
import {useToast} from '@/shared/hooks/useToast';
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
  const [verificationAttempts, setVerificationAttempts] = useState(0);
  const verifyingRef = useRef(false);
  const [resendNotice, setResendNotice] = useState({
    message: '',
    isError: false,
  });
  const resendToast = useToast({visibleDuration: 1500, fadeDuration: 150});

  const email = `${emailId.trim()}${AUTH_EMAIL_DOMAIN}`;
  const sendEmailCodeMutation = useMutation(
    AUTH_MUTATION_OPTIONS.SEND_SCHOOL_EMAIL_CODE()
  );
  const verifyEmailCodeMutation = useMutation({
    ...AUTH_MUTATION_OPTIONS.VERIFY_SCHOOL_EMAIL(),
    onSettled: () => {
      verifyingRef.current = false;
    },
  });

  const handleKakaoLogin = () => {
    const kakaoAuthorizeUrl = new URL(
      API_ENDPOINT.auth.kakaoAuthorize,
      import.meta.env.VITE_BASE_URL
    );

    const redirectUri = new URL(
      '/auth/callback',
      window.location.origin
    ).toString();

    sessionStorage.setItem('kakaoRedirectUri', redirectUri);
    kakaoAuthorizeUrl.searchParams.set('redirect_uri', redirectUri);

    window.location.href = kakaoAuthorizeUrl.toString();
  };

  const handleBackToEmail = () => {
    resendToast.hideToast();
    setCode('');
    sendEmailCodeMutation.reset();
    verifyEmailCodeMutation.reset();
    setStep('email');
  };

  const handleSendEmailCode = () => {
    sendEmailCodeMutation.mutate(
      {schoolEmail: email},
      {
        onSuccess: () => {
          setCode('');
          setStep('code');
        },
      }
    );
  };

  const handleMoveComplete = () => {
    resendToast.hideToast();
    setVerificationAttempts(0);
    setStep('complete');
    navigate('/auth?step=complete', {replace: true});
  };

  const handleVerifyEmailCode = () => {
    if (
      verifyingRef.current ||
      sendEmailCodeMutation.isPending ||
      !/^\d{6}$/.test(code)
    )
      return;
    verifyingRef.current = true;
    verifyEmailCodeMutation.mutate(
      {schoolEmail: email, code},
      {
        onSuccess: handleMoveComplete,
        onError: () => {
          const attempts = verificationAttempts + 1;
          setVerificationAttempts(attempts);
          if (attempts >= AUTH_MOCK.maxAttemptCount) {
            resendToast.hideToast();
            setEmailId('');
            setCode('');
            setVerificationAttempts(0);
            sendEmailCodeMutation.reset();
            verifyEmailCodeMutation.reset();
            setStep('login');
            navigate('/auth', {replace: true});
          }
        },
      }
    );
  };

  const handleResendEmailCode = () => {
    if (sendEmailCodeMutation.isPending || verifyEmailCodeMutation.isPending)
      return;
    verifyEmailCodeMutation.reset();
    setResendNotice({
      message: '인증번호 재발송을 요청했어요.',
      isError: false,
    });
    resendToast.showToast();
    sendEmailCodeMutation.mutate(
      {schoolEmail: email},
      {
        onSuccess: () => {
          setCode('');
        },
        onError: (error) => {
          setResendNotice({
            message:
              error.message ||
              '인증번호 재발송에 실패했어요. 다시 시도해 주세요.',
            isError: true,
          });
          resendToast.showToast();
        },
      }
    );
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
          attemptCount={verificationAttempts}
          errorMessage={
            verifyEmailCodeMutation.error?.message ??
            sendEmailCodeMutation.error?.message
          }
          isPending={
            verifyEmailCodeMutation.isPending || sendEmailCodeMutation.isPending
          }
          onCodeChange={(nextCode) => {
            verifyEmailCodeMutation.reset();
            setCode(nextCode);
          }}
          onConfirm={handleVerifyEmailCode}
          onResend={handleResendEmailCode}
        />
      );
    }

    return (
      <EmailAuthStep
        emailId={emailId}
        errorMessage={sendEmailCodeMutation.error?.message}
        isPending={sendEmailCodeMutation.isPending}
        onEmailIdChange={(nextEmailId) => {
          sendEmailCodeMutation.reset();
          setEmailId(nextEmailId);
        }}
        onSubmit={handleSendEmailCode}
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
        hasProgress
        progress={AUTH_STEP_PROGRESS[step]}
      />
      {renderStepContent()}
      {step === 'code' && resendToast.isVisible && (
        <div
          className={`pointer-events-none fixed right-[2rem] bottom-[16rem] left-[2rem] z-[80] mx-auto max-w-[39rem] transition-opacity ${resendToast.isLeaving ? 'opacity-0' : 'opacity-100'}`}
          style={{transitionDuration: `${resendToast.fadeDuration}ms`}}>
          <ToastMessage
            message={resendNotice.message}
            isError={resendNotice.isError}
          />
        </div>
      )}
    </section>
  );
};
