import type {ButtonHTMLAttributes} from 'react';

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  isSelected?: boolean;
}

export const Chip = ({
  value,
  isSelected = false,
  className = '',
  type = 'button',
  ...props
}: ChipProps) => {
  return (
    <button
      type={type}
      className={`text-input1-14r rounded-full border px-[1.8rem] py-[0.8rem] ${
        isSelected
          ? 'border-primary bg-primary text-white-800 shadow-[0_4px_8px_0_rgba(194,30,86,0.25)]'
          : 'border-gray-200 bg-white-800 text-gray-800'
      } ${className}`}
      {...props}>
      {value}
    </button>
  );
};
