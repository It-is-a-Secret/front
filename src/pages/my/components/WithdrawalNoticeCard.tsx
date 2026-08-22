import type {ReactNode} from 'react';

interface WithdrawalNoticeCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export const WithdrawalNoticeCard = ({
  icon,
  title,
  description,
}: WithdrawalNoticeCardProps) => {
  return (
    <article className='bg-white-800 flex items-center gap-[1.2rem] rounded-[16px] px-[1.6rem] py-[2.4rem]'>
      <div>{icon}</div>
      <div className='flex flex-col gap-[0.4rem]'>
        <span className='text-body4-16m'>{title}</span>
        <span className='text-input1-14r text-gray-600'>{description}</span>
      </div>
    </article>
  );
};
