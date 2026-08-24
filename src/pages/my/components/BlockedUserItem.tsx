interface BlockedUserItemProps {
  userName: string;
  description: string;
  blockTime: string;
  onClick: () => void;
}

export const BlockedUserItem = ({
  userName,
  description,
  blockTime,
  onClick,
}: BlockedUserItemProps) => {
  return (
    <div className='bg-white-800 flex h-[8.9rem] w-full flex-col gap-[0.7rem] p-[1.6rem]'>
      <div className='flex justify-between'>
        <span className='text-body4-16m'>{userName}</span>
        <span className='text-caption1-12r text-gray-600'>{blockTime}</span>
      </div>
      <div className='flex justify-between'>
        <span className='text-body1-15r text-gray-600'>{description}</span>
        <button
          type='button'
          className='text-caption1-12r bg-primary text-white-800 rounded-[1.2rem] px-[0.8rem] py-[0.6rem]'
          onClick={onClick}>
          차단 해제
        </button>
      </div>
    </div>
  );
};
