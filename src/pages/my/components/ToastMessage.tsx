import {IcSvgCheck} from '@/shared/icons';

interface ToastMessageProps {
  message: string;
}

export const ToastMessage = ({message}: ToastMessageProps) => {
  return (
    <div
      role='status'
      className='text-body3-14m text-white-800 flex w-full items-center gap-[0.8rem] rounded-[24px] bg-gray-400 p-[1.6rem]'>
      <IcSvgCheck className='size-[1.6rem]' />
      {message}
    </div>
  );
};
