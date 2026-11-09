import {useNavigate} from 'react-router-dom';

import {Button} from '@/shared/components/Button';

interface ChatRoomStateProps {
  title: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export const ChatRoomState = ({
  title,
  onRetry,
  isRetrying = false,
}: ChatRoomStateProps) => {
  const navigate = useNavigate();
  const goToChatList = () => navigate('/chat', {replace: true});

  return (
    <section className='flex min-h-dvh flex-col items-center justify-center gap-[2.4rem] px-[2rem] text-center'>
      <p role='alert' className='text-body1-15r text-gray-600'>
        {title}
      </p>
      <div className='w-full max-w-[28rem] [&>div]:h-[5.2rem]'>
        <Button
          text={
            isRetrying
              ? '확인 중...'
              : onRetry
                ? '다시 시도'
                : '채팅 목록으로 돌아가기'
          }
          disabled={isRetrying}
          onClick={onRetry ?? goToChatList}
        />
      </div>
      {onRetry && (
        <button
          type='button'
          className='text-caption2-12sb text-primary'
          onClick={goToChatList}>
          채팅 목록으로 돌아가기
        </button>
      )}
    </section>
  );
};
