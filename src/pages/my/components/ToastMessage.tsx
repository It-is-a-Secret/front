import {IcSvgCheck, IcSvgError} from '@/shared/icons';

interface ToastMessageProps {
  message: string;
  isError?: boolean;
}

export const ToastMessage = ({message, isError = false}: ToastMessageProps) => {
  return (
    <div
      role={isError ? 'alert' : 'status'}
      className='text-body3-14m text-white-800 flex w-full items-center gap-[0.8rem] rounded-[24px] bg-gray-400 p-[1.6rem]'>
      {isError ? (
        <IcSvgError className='size-[1.6rem] shrink-0' />
      ) : (
        <IcSvgCheck className='size-[1.6rem] shrink-0' />
      )}
      {message}
    </div>
  );
};
