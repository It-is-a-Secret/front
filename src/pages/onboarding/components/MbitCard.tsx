import type {ButtonHTMLAttributes} from 'react';

import type {MbtiType} from '@/pages/onboarding/constants/constants';

interface MbitCardProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  mbti: MbtiType;
  isSelected?: boolean;
}

export const MbitCard = ({
  mbti,
  isSelected = false,
  className = '',
  type = 'button',
  ...props
}: MbitCardProps) => {
  return (
    <button
      type={type}
      className={`text-medium-15 aspect-square w-full rounded-[16px] border ${
        isSelected
          ? 'border-primary bg-primary text-white-800'
          : 'border-gray-200 bg-white-800 text-gray-800'
      } ${className}`}
      {...props}>
      {mbti}
    </button>
  );
};
