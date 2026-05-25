import {useRef} from 'react';
import type {ClipboardEvent, KeyboardEvent} from 'react';

import {useCountdown} from '@/pages/auth/hooks/useCountdown';

const DEFAULT_CODE_LENGTH = 6;
const DEFAULT_EXPIRE_SECONDS = 10 * 60;

interface VerificationCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
}

const VerificationCodeInput = ({
  value,
  onChange,
  length = DEFAULT_CODE_LENGTH,
  disabled = false,
}: VerificationCodeInputProps) => {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const code = value.padEnd(length).slice(0, length).split('');

  const updateCode = (index: number, nextValue: string) => {
    const nextDigit = nextValue.replace(/\D/g, '').slice(-1);
    const nextCode = [...code];

    nextCode[index] = nextDigit;
    onChange(nextCode.join('').trim());

    if (nextDigit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    const pastedCode = event.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, length);

    onChange(pastedCode);
    inputRefs.current[Math.min(pastedCode.length, length - 1)]?.focus();
  };

  return (
    <div className='flex gap-[1.2rem]'>
      {code.map((digit, index) => (
        <input
          key={index}
          ref={(element) => {
            inputRefs.current[index] = element;
          }}
          value={digit.trim()}
          onChange={(event) => updateCode(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          maxLength={1}
          inputMode='numeric'
          disabled={disabled}
          className='text-bold-24 bg-white-800 focus:border-primary h-[5.2rem] w-[4.5rem] rounded-[1.8rem] border border-gray-200 text-center text-gray-800 outline-none disabled:cursor-not-allowed'
        />
      ))}
    </div>
  );
};

interface AuthInputProps {
  value: string;
  onChange: (value: string) => void;
  expireSeconds?: number;
  attemptCount: number;
  maxAttemptCount: number;
  disabled?: boolean;
  onExpire?: () => void;
}

export const AuthInput = ({
  value,
  onChange,
  expireSeconds = DEFAULT_EXPIRE_SECONDS,
  attemptCount,
  maxAttemptCount,
  disabled = false,
  onExpire,
}: AuthInputProps) => {
  const {formattedTime, isExpired} = useCountdown({
    initialSeconds: expireSeconds,
    enabled: !disabled,
    onExpire,
  });

  return (
    <div>
      <VerificationCodeInput
        value={value}
        onChange={onChange}
        disabled={disabled || isExpired}
      />

      <p className='text-regular-14 mt-[1.6rem] text-center text-gray-600'>
        코드 만료까지{' '}
        <span className='text-bold-14 text-primary'>{formattedTime}</span> ·
        시도 {attemptCount}/{maxAttemptCount}회
      </p>
    </div>
  );
};
