import type {ReactNode} from 'react';

interface HeaderProps {
  className?: string;
  title?: ReactNode;
  onClickLeft?: () => void;
  leftItem?: ReactNode;
  rightItem?: ReactNode;
  onClickRight?: () => void;
  hasProgress?: boolean;
  progress?: number;
}

export const Header = ({
  className = '',
  title,
  rightItem,
  leftItem,
  onClickLeft,
  onClickRight,
  hasProgress = false,
  progress = 0,
}: HeaderProps) => {
  return (
    <article className={`flex flex-col ${className}`}>
      <div className='grid h-[5.2rem] grid-cols-[8rem_1fr_8rem] items-center'>
        <div className='flex justify-start'>
          {leftItem && (
            <button type='button' onClick={onClickLeft}>
              {leftItem}
            </button>
          )}
        </div>
        <div className='flex justify-center text-center'>{title}</div>
        <div className='flex justify-end'>
          {rightItem && (
            <button type='button' onClick={onClickRight}>
              {rightItem}
            </button>
          )}
        </div>
      </div>
      {hasProgress && (
        <div className='h-[0.3rem] w-full rounded-full bg-gray-200'>
          <div
            className='bg-primary h-full rounded-full'
            style={{width: `${progress}%`}}
          />
        </div>
      )}
    </article>
  );
};
