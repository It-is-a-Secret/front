import {useState} from 'react';

import {AUTH_EMAIL_DOMAIN, AUTH_MOCK} from '@/pages/auth/mocks/mock';
import type {AuthStep} from '@/pages/auth/mocks/mock';
import {CodeAuthStep} from '@/pages/auth/steps/CodeAuthStep';
import {CompleteAuthStep} from '@/pages/auth/steps/CompleteAuthStep';
import {EmailAuthStep} from '@/pages/auth/steps/EmailAuthStep';
import {LoginAuthStep} from '@/pages/auth/steps/LoginAuthStep';

export const AuthPage = () => {
  const [step, setStep] = useState<AuthStep>('login');
  const [emailId, setEmailId] = useState('');
  const [code, setCode] = useState('');

  const email = `${emailId || AUTH_MOCK.emailId}${AUTH_EMAIL_DOMAIN}`;

  const handleBackToEmail = () => {
    setCode('');
    setStep('email');
  };

  if (step === 'login') {
    return <LoginAuthStep onKakaoLogin={() => setStep('email')} />;
  }

  if (step === 'code') {
    return (
      <CodeAuthStep
        email={email}
        code={code}
        onCodeChange={setCode}
        onConfirm={() => setStep('complete')}
        onResend={() => setCode('')}
        onSkip={() => setStep('complete')}
        onBack={handleBackToEmail}
      />
    );
  }

  if (step === 'complete') {
    return <CompleteAuthStep onNext={() => {}} onLater={() => {}} />;
  }

  return (
    <EmailAuthStep
      emailId={emailId}
      onEmailIdChange={setEmailId}
      onSubmit={() => setStep('code')}
      onSkip={() => setStep('complete')}
      onBack={() => setStep('login')}
    />
  );
};
