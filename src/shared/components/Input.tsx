import type {InputHTMLAttributes, ReactNode} from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftItem?: ReactNode;
  rightItem?: ReactNode;
  isError?: boolean;
}

export const Input = ({
  leftItem,
  rightItem,
  isError = false,
  className = '',
  ...props
}: InputProps) => {
  const hasValue =
    props.value !== undefined
      ? String(props.value).length > 0
      : props.defaultValue !== undefined &&
        String(props.defaultValue).length > 0;

  return (
    <div
      className={`bg-white-800 text-regular-14 flex w-full items-center rounded-[1.6rem] border px-[16px] py-[14px] ${
        isError || hasValue
          ? 'border-primary'
          : 'focus-within:border-primary border-gray-200'
      } ${className}`}>
      {leftItem && <div className='mr-[0.4rem] flex shrink-0'>{leftItem}</div>}

      <input
        aria-invalid={isError}
        className='text-regular-14 min-w-0 flex-1 bg-transparent text-gray-800 outline-none placeholder:text-gray-400'
        {...props}
      />

      {rightItem && (
        <div className='ml-[0.4rem] flex shrink-0 items-center'>
          {rightItem}
        </div>
      )}
    </div>
  );
};
