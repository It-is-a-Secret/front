import type {HTMLAttributes, ReactNode} from 'react';

import {IcSvgError} from '@/shared/icons';

interface FieldErrorMessageProps extends HTMLAttributes<HTMLParagraphElement> {
  message: ReactNode;
  variant?: 'error' | 'default';
}

export const FieldErrorMessage = ({
  message,
  variant = 'error',
  className = '',
  ...props
}: FieldErrorMessageProps) => {
  const colorClassName = variant === 'error' ? 'text-error' : 'text-gray-600';

  return (
    <p
      role='alert'
      className={`text-caption1-12r flex items-center gap-[0.4rem] ${colorClassName} ${className}`}
      {...props}>
      <IcSvgError className='size-[1.6rem] shrink-0' />
      <span>{message}</span>
    </p>
  );
};
