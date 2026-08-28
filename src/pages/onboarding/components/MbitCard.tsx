import type {ButtonHTMLAttributes} from 'react';

import type {MbtiType} from '@/pages/onboarding/constants/constants';

interface MbitCardProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  mbti: MbtiType | string;
  isSelected?: boolean;
  textClassName?: string;
}

export const MbitCard = ({
  mbti,
  isSelected = false,
  textClassName = 'text-medium-15',
  className = '',
  type = 'button',
  ...props
}: MbitCardProps) => {
  return (
    <button
      type={type}
      className={`${textClassName} aspect-square w-full rounded-[16px] border ${
        isSelected
          ? 'border-primary bg-primary text-white-800'
          : 'border-gray-200 bg-white-800 text-gray-800'
      } ${className}`}
      {...props}>
      {mbti}
    </button>
  );
};
