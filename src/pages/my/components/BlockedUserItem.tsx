interface BlockedUserItemProps {
  userName: string;
  description?: string;
  blockTime: string;
  onClick: () => void;
  disabled?: boolean;
}

export const BlockedUserItem = ({
  userName,
  description,
  blockTime,
  onClick,
  disabled = false,
}: BlockedUserItemProps) => {
  return (
    <div className='bg-white-800 flex h-[8.9rem] w-full flex-col gap-[0.7rem] p-[1.6rem]'>
      <div className='flex justify-between'>
        <span className='text-body4-16m'>{userName}</span>
        <span className='text-caption1-12r text-gray-600'>{blockTime}</span>
      </div>
      <div className='flex items-center justify-between gap-[0.8rem]'>
        <span
          className='text-body1-15r min-w-0 truncate text-gray-600'
          title={description}>
          {description}
        </span>
        <button
          type='button'
          disabled={disabled}
          className='text-caption1-12r bg-primary text-white-800 shrink-0 rounded-[1.2rem] px-[0.8rem] py-[0.6rem]'
          onClick={onClick}>
          차단 해제
        </button>
      </div>
    </div>
  );
};
