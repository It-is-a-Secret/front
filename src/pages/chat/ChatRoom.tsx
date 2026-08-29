import {useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {ChatInputBox} from '@/pages/chat/components/ChatInputBox';
import {ChatReportSheet} from '@/pages/chat/components/ChatReportSheet';
import {ChatRoomActionMenu} from '@/pages/chat/components/ChatRoomActionMenu';
import {ChatMessageListSection} from '@/pages/chat/section/ChatMessageListSection';
import {ToastMessage} from '@/pages/my/components/ToastMessage';
import {BottomSheet} from '@/shared/components/BottomSheet';
import {Button} from '@/shared/components/Button';
import {Header} from '@/shared/components/Header';
import {useToast} from '@/shared/hooks/useToast';
import {IcSvgEtc, IcSvgLeft} from '@/shared/icons';

const MOCK_CHAT_ROOM = {
  nickname: '행복한코딩러',
  publicPhotoCount: 2,
};

export const ChatRoom = () => {
  const navigate = useNavigate();
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState('');
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [isReportSheetOpen, setIsReportSheetOpen] = useState(false);
  const [isBlockSheetOpen, setIsBlockSheetOpen] = useState(false);
  const [isLeaveSheetOpen, setIsLeaveSheetOpen] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const {
    isVisible: isToastVisible,
    isLeaving: isToastLeaving,
    showToast,
    fadeDuration,
  } = useToast();

  useEffect(() => {
    if (!isActionMenuOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!actionMenuRef.current?.contains(event.target as Node)) {
        setIsActionMenuOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isActionMenuOpen]);

  const handleOpenReportSheet = () => {
    setIsActionMenuOpen(false);
    setIsReportSheetOpen(true);
  };

  const handleOpenBlockSheet = () => {
    setIsActionMenuOpen(false);
    setIsBlockSheetOpen(true);
  };

  const handleOpenLeaveSheet = () => {
    setIsActionMenuOpen(false);
    setIsLeaveSheetOpen(true);
  };

  const handleBlockUser = () => {
    setIsBlockSheetOpen(false);
    setIsBlocked(true);
    setMessage('');
    showToast();
  };

  const handleLeaveChatRoom = () => {
    setIsLeaveSheetOpen(false);
    navigate('/chat', {state: {toastMessage: '채팅방을 나갔어요'}});
  };

  return (
    <section className='relative flex h-dvh flex-col'>
      <div ref={actionMenuRef}>
        <Header
          className='px-[2rem]'
          leftItem={<IcSvgLeft className='size-[2.4rem] text-gray-800' />}
          onClickLeft={() => navigate(-1)}
          title={
            <div className='flex items-center gap-[0.8rem]'>
              <h1 className='text-title-18b text-gray-800'>
                {MOCK_CHAT_ROOM.nickname}
              </h1>
              <span className='bg-primary text-button2-10r text-white-800 rounded-full px-[0.6rem] py-[0.1rem]'>
                {MOCK_CHAT_ROOM.publicPhotoCount}/5
              </span>
            </div>
          }
          rightItem={<IcSvgEtc className='size-[3.2rem] text-gray-800' />}
          onClickRight={() => setIsActionMenuOpen((prev) => !prev)}
        />
        {isActionMenuOpen && (
          <ChatRoomActionMenu
            onReport={handleOpenReportSheet}
            onBlock={handleOpenBlockSheet}
            onLeave={handleOpenLeaveSheet}
          />
        )}
      </div>

      <main className='flex min-h-0 flex-1 flex-col'>
        <ChatMessageListSection />

        <div className='relative'>
          {isToastVisible && (
            <div
              className={`absolute right-[1.2rem] bottom-[8.2rem] left-[1.2rem] z-10 transition-opacity ${
                isToastLeaving ? 'opacity-0' : 'opacity-100'
              }`}
              style={{transitionDuration: `${fadeDuration}ms`}}>
              <ToastMessage message='차단이 완료되었어요' />
            </div>
          )}

          <ChatInputBox
            value={message}
            onValueChange={setMessage}
            inputProps={{disabled: isBlocked}}
            submitDisabled={isBlocked || !message.trim()}
            onSubmit={(event) => {
              event.preventDefault();

              if (isBlocked) {
                return;
              }

              setMessage('');
            }}
          />
        </div>
      </main>

      <ChatReportSheet
        open={isReportSheetOpen}
        onClose={() => setIsReportSheetOpen(false)}
      />
      <BottomSheet
        open={isBlockSheetOpen}
        ariaLabel='사용자 차단 확인'
        onClose={() => setIsBlockSheetOpen(false)}>
        <div className='flex flex-col items-center px-[1.2rem] pb-[3.6rem] text-center'>
          <img src='/chatBlock.png' alt='' className='size-[9.2rem]' />
          <h2 className='text-title-22b text-primary mt-[1.6rem] mb-[0.8rem]'>
            이 사용자를 차단할까요?
          </h2>
          <p className='text-body1-15r mb-[2.8rem] whitespace-pre-line text-gray-600'>
            차단 후에는 서로 탐색·채팅에서 노출되지 않아요
          </p>
          <div className='flex w-full gap-[0.8rem]'>
            <div className='flex-[1]'>
              <Button
                text='취소'
                className='border-primary text-button1-14b text-primary h-[5.6rem] rounded-[28px] border'
                onClick={() => setIsBlockSheetOpen(false)}
              />
            </div>
            <div className='flex-[1.8]'>
              <Button
                text='차단하기'
                aria-label={`${MOCK_CHAT_ROOM.nickname} 차단하기`}
                className='bg-primary text-button1-14b text-white-800 h-[5.6rem] rounded-[28px] shadow-[0_8px_10px_0_rgba(194,30,86,0.25)]'
                onClick={handleBlockUser}
              />
            </div>
          </div>
        </div>
      </BottomSheet>
      <BottomSheet
        open={isLeaveSheetOpen}
        ariaLabel='채팅방 나가기 확인'
        onClose={() => setIsLeaveSheetOpen(false)}>
        <div className='flex flex-col items-center px-[1.2rem] pb-[3.6rem] text-center'>
          <img src='/chatOut.png' alt='' className='size-[9.2rem]' />
          <h2 className='text-title-22b text-primary mt-[1.6rem] mb-[0.8rem]'>
            대화를 종료할까요?
          </h2>
          <p className='text-body1-15r mb-[2.8rem] whitespace-pre-line text-gray-600'>
            채팅방을 나가면 이전 대화는 다시 볼 수 없으며,
            {'\n'}서로 탐색·채팅에서 노출되지 않아요
          </p>
          <div className='flex w-full gap-[0.8rem]'>
            <div className='flex-[1]'>
              <Button
                text='취소'
                className='border-primary text-button1-14b text-primary h-[5.6rem] rounded-[28px] border'
                onClick={() => setIsLeaveSheetOpen(false)}
              />
            </div>
            <div className='flex-[1.8]'>
              <Button
                text='채팅방 나가기'
                aria-label={`${MOCK_CHAT_ROOM.nickname} 채팅방 나가기`}
                className='bg-primary text-button1-14b text-white-800 h-[5.6rem] rounded-[28px] shadow-[0_8px_10px_0_rgba(194,30,86,0.25)]'
                onClick={handleLeaveChatRoom}
              />
            </div>
          </div>
        </div>
      </BottomSheet>
    </section>
  );
};
