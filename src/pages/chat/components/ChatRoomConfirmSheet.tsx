import {BottomSheet} from '@/shared/components/BottomSheet';
import {Button} from '@/shared/components/Button';

const CONTENT = {
  block: {
    ariaLabel: '사용자 차단 확인',
    image: '/chatBlock.png',
    title: '이 사용자를 차단할까요?',
    description: '차단 후에는 서로 탐색·채팅에서 노출되지 않아요',
    confirmText: '차단하기',
  },
  leave: {
    ariaLabel: '채팅방 나가기 확인',
    image: '/chatOut.png',
    title: '대화를 종료할까요?',
    description:
      '채팅방을 나가면 이전 대화는 다시 볼 수 없으며,\n서로 탐색·채팅에서 노출되지 않아요',
    confirmText: '채팅방 나가기',
  },
} as const;

interface ChatRoomConfirmSheetProps {
  action: 'block' | 'leave' | null;
  partnerNickname: string;
  isPending: boolean;
  canConfirm: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const ChatRoomConfirmSheet = ({
  action,
  partnerNickname,
  isPending,
  canConfirm,
  errorMessage,
  onClose,
  onConfirm,
}: ChatRoomConfirmSheetProps) => {
  if (!action) return null;
  const content = CONTENT[action];

  return (
    <BottomSheet open ariaLabel={content.ariaLabel} onClose={onClose}>
      <div className='flex flex-col items-center px-[1.2rem] pb-[3.6rem] text-center'>
        <img src={content.image} alt='' className='size-[9.2rem]' />
        <h2 className='text-title-22b text-primary mt-[1.6rem] mb-[0.8rem]'>
          {content.title}
        </h2>
        <p className='text-body1-15r mb-[2.8rem] whitespace-pre-line text-gray-600'>
          {content.description}
        </p>
        {errorMessage && (
          <p
            role='alert'
            className='text-caption2-12sb mb-[1.6rem] text-gray-600'>
            {errorMessage}
          </p>
        )}
        <div className='flex w-full gap-[0.8rem]'>
          <div className='flex-[1]'>
            <Button
              text='취소'
              disabled={isPending}
              className='border-primary text-button1-14b text-primary h-[5.6rem] rounded-[28px] border'
              onClick={onClose}
            />
          </div>
          <div className='flex-[1.8]'>
            <Button
              text={isPending ? '처리 중...' : content.confirmText}
              disabled={!canConfirm}
              aria-label={`${partnerNickname} ${content.confirmText}`}
              className='bg-primary text-button1-14b text-white-800 h-[5.6rem] rounded-[28px] shadow-[0_8px_10px_0_rgba(194,30,86,0.25)]'
              onClick={onConfirm}
            />
          </div>
        </div>
      </div>
    </BottomSheet>
  );
};
