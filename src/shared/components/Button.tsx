import type {ButtonHTMLAttributes} from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  description?: string;
}

export const Button = ({text, description, ...props}: ButtonProps) => {
  return (
    <div className='flex w-full flex-col gap-[10px]'>
      <span className='text-regular-12 text-center text-gray-600'>
        {description}
      </span>
      <button
        type='button'
        className='text-bold-14 text-white-800 bg-primary flex-1 rounded-[20px] p-[1.55rem] shadow-[0_8px_10px_0_rgba(194,30,86,0.25)] disabled:bg-gray-100 disabled:shadow-none'
        {...props}>
        {text}
      </button>
    </div>
  );
};
