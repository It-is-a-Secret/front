import {useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';

import {ChatInputBox} from '@/pages/chat/components/ChatInputBox';
import {ChatImageList} from '@/pages/chat/components/ChatImageList';
import {ChatReportSheet} from '@/pages/chat/components/ChatReportSheet';
import {ChatRoomActionMenu} from '@/pages/chat/components/ChatRoomActionMenu';
import {PhotoRevealEvent} from '@/pages/chat/components/PhotoRevealEvent';
import {ChatMessageListSection} from '@/pages/chat/section/ChatMessageListSection';
import {useChatRoomQuery} from '@/pages/chat/hooks/useChatRoomQuery';
import {useChatRoomActions} from '@/pages/chat/hooks/useChatRoomActions';
import {ChatRoomState} from '@/pages/chat/components/ChatRoomState';
import {ChatRoomConfirmSheet} from '@/pages/chat/components/ChatRoomConfirmSheet';
import {ToastMessage} from '@/pages/my/components/ToastMessage';
import {Header} from '@/shared/components/Header';
import {IcSvgEtc, IcSvgLeft} from '@/shared/icons';

const MOCK_CHAT_ROOM = {
  photos: [
    {objectKey: '/profileLogo.png', displayOrder: 1, blurLevel: 0},
    {objectKey: '/complete.png', displayOrder: 2, blurLevel: 0},
    {objectKey: '/noPeople.png', displayOrder: 3, blurLevel: 50},
    {objectKey: '/completeOnboarding.png', displayOrder: 4, blurLevel: 50},
    {objectKey: '/report.png', displayOrder: 5, blurLevel: 50},
  ],
};

export const ChatRoom = () => {
  const {roomId: roomIdParam} = useParams();
  const roomId = Number(roomIdParam);

  if (!Number.isSafeInteger(roomId) || roomId <= 0) {
    return <ChatRoomState title='올바르지 않은 채팅방이에요.' />;
  }

  return <ChatRoomContent key={roomId} roomId={roomId} />;
};

const ChatRoomContent = ({roomId}: {roomId: number}) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [isRevealPreviewOpen, setIsRevealPreviewOpen] = useState(false);
  const chat = useChatRoomQuery(roomId);
  const {
    actionMenuRef,
    isActionMenuOpen,
    activeAction,
    isBlocked,
    toast,
    toggleMenu,
    openAction,
    closeAction,
    confirmAction,
  } = useChatRoomActions(() => setMessage(''));
  const {
    memberId,
    partnerNickname,
    publicPhotoCount,
    room,
    messages,
    messagesQuery,
  } = chat;
  const {
    isVisible: isToastVisible,
    isLeaving: isToastLeaving,
    fadeDuration,
  } = toast;
  const isInputDisabled = isBlocked || room?.roomStatus !== 'ACTIVE';
  const previewPhoto = MOCK_CHAT_ROOM.photos.find(
    (photo) => photo.displayOrder === publicPhotoCount
  );

  if (chat.isLoading || memberId === null) {
    return (
      <section
        role='status'
        className='text-body1-15r flex min-h-dvh items-center justify-center text-gray-600'>
        대화를 불러오고 있어요.
      </section>
    );
  }

  if (chat.error) {
    return (
      <ChatRoomState
        title={
          chat.isUnavailable
            ? '이 채팅방에 접근할 수 없어요.'
            : '대화를 불러오지 못했어요.'
        }
        isRetrying={chat.isRetrying}
        onRetry={chat.isUnavailable ? undefined : chat.retry}
      />
    );
  }

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
                {partnerNickname}
              </h1>
              <span className='bg-primary text-button2-10r text-white-800 rounded-full px-[0.6rem] py-[0.1rem]'>
                {publicPhotoCount}/5
              </span>
            </div>
          }
          rightItem={<IcSvgEtc className='size-[3.2rem] text-gray-800' />}
          onClickRight={toggleMenu}
        />
        <ChatImageList photos={MOCK_CHAT_ROOM.photos} />
        <div className='flex justify-end px-[2rem] pt-[0.8rem]'>
          <button
            type='button'
            disabled={!previewPhoto || isInputDisabled}
            onClick={() => setIsRevealPreviewOpen(true)}
            className='border-primary text-caption2-12sb text-primary rounded-full border px-[1.2rem] py-[0.5rem] disabled:opacity-50'>
            이벤트 미리보기
          </button>
        </div>
        {isActionMenuOpen && (
          <ChatRoomActionMenu
            onReport={() => openAction('report')}
            onBlock={() => openAction('block')}
            onLeave={() => openAction('leave')}
          />
        )}
      </div>

      <main className='flex min-h-0 flex-1 flex-col'>
        <ChatMessageListSection
          messages={messages}
          memberId={memberId}
          partnerLastReadMessageId={room?.partnerLastReadMessageId}
          hasNextPage={messagesQuery.hasNextPage}
          isFetchingNextPage={messagesQuery.isFetchingNextPage}
          isFetchNextPageError={messagesQuery.isFetchNextPageError}
          onLoadPreviousMessages={messagesQuery.fetchNextPage}
        />

        {isInputDisabled && (
          <p className='text-body1-15r px-[2rem] py-[0.8rem] text-center text-gray-600'>
            메시지를 보낼 수 없는 대화예요.
          </p>
        )}

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
            inputProps={{disabled: isInputDisabled}}
            submitDisabled
            placeholder={
              isInputDisabled
                ? '메시지를 보낼 수 없어요'
                : '메시지를 입력하세요'
            }
            onSubmit={(event) => {
              event.preventDefault();
            }}
          />
        </div>
      </main>

      <ChatReportSheet open={activeAction === 'report'} onClose={closeAction} />
      {isRevealPreviewOpen && previewPhoto && (
        <PhotoRevealEvent
          photoUrl={previewPhoto.objectKey}
          displayOrder={previewPhoto.displayOrder}
          totalCount={MOCK_CHAT_ROOM.photos.length}
          partnerNickname={partnerNickname}
          onClose={() => setIsRevealPreviewOpen(false)}
        />
      )}
      <ChatRoomConfirmSheet
        action={
          activeAction === 'block' || activeAction === 'leave'
            ? activeAction
            : null
        }
        partnerNickname={partnerNickname}
        onClose={closeAction}
        onConfirm={confirmAction}
      />
    </section>
  );
};
