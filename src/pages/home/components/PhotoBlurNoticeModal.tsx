import {useRef, type RefObject} from 'react';
import * as Dialog from '@radix-ui/react-dialog';

import {Button} from '@/shared/components/Button';

interface PhotoBlurNoticeModalProps {
  open: boolean;
  onClose: () => void;
  fallbackFocusRef: RefObject<HTMLElement | null>;
}

export const PhotoBlurNoticeModal = ({
  open,
  onClose,
  fallbackFocusRef,
}: PhotoBlurNoticeModalProps) => {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}>
      <Dialog.Portal>
        <Dialog.Overlay className='fixed inset-0 z-[90] bg-black/40' />
        <Dialog.Content
          className='border-primary-400 bg-white-800 fixed top-1/2 left-1/2 z-[91] max-h-[calc(100dvh-4rem)] w-[calc(100%-4rem)] max-w-[35.9rem] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[24px] border p-[2.4rem] text-center shadow-[0_4px_24px_rgba(194,30,86,0.16)] outline-none'
          onOpenAutoFocus={() => {
            previousFocusRef.current =
              document.activeElement instanceof HTMLElement
                ? document.activeElement
                : null;
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            const previous = previousFocusRef.current;
            const target =
              previous?.isConnected && previous !== document.body
                ? previous
                : fallbackFocusRef.current;
            target?.focus({preventScroll: true});
          }}
          onPointerDownOutside={(event) => event.preventDefault()}>
          <Dialog.Title className='text-bold-18 text-gray-800'>
            사진을 블러 처리하고 있어요
          </Dialog.Title>
          <Dialog.Description asChild>
            <div className='text-body1-15r mt-[1.6rem] space-y-[1.2rem] break-keep text-gray-600'>
              <p>
                처리 환경에 따라 약 1~3분 정도 걸릴 수 있고 처리가 끝나기
                전에는 채팅 이용이 제한될 수 있어요.
              </p>
              <p>기다리는 동안 다른 사람들의 프로필을 둘러보세요!</p>
            </div>
          </Dialog.Description>
          <div className='mt-[2.4rem]'>
            <Button text='확인했어요' onClick={onClose} />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
