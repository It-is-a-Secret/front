import {IcSvgCheck} from '@/shared/icons';

interface NoticeMessageProps {
  message: string;
}
export const NoticeMessage = ({message}: NoticeMessageProps) => {
  return (
    <div
      role='status'
      className='text-body4-16m text-white-800 bg-primary-600 flex w-full items-center gap-[0.4rem] rounded-[16px] px-[1.8rem] py-[1.2rem]'>
      <IcSvgCheck className='size-[1.6rem]' />
      {message}
    </div>
  );
};
