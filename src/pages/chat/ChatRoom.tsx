import {useNavigate, useParams} from 'react-router-dom';

import {ChatInputBox} from '@/pages/chat/components/ChatInputBox';
import {ChatReportSheet} from '@/pages/chat/components/ChatReportSheet';
import {ChatRoomActionMenu} from '@/pages/chat/components/ChatRoomActionMenu';
import {ChatMessageListSection} from '@/pages/chat/section/ChatMessageListSection';
import {ChatPhotoSection} from '@/pages/chat/section/ChatPhotoSection';
import {useChatRoomQuery} from '@/pages/chat/hooks/useChatRoomQuery';
import {useChatRoomActions} from '@/pages/chat/hooks/useChatRoomActions';
import {useChatComposer} from '@/pages/chat/hooks/useChatComposer';
import {useChatRoomRealtime} from '@/pages/chat/hooks/useChatRoomRealtime';
import {ChatRoomState} from '@/pages/chat/components/ChatRoomState';
import {ChatRoomConfirmSheet} from '@/pages/chat/components/ChatRoomConfirmSheet';
import {ToastMessage} from '@/pages/my/components/ToastMessage';
import {Header} from '@/shared/components/Header';
import {IcSvgEtc, IcSvgLeft} from '@/shared/icons';

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
  const chat = useChatRoomQuery(roomId);
  const composer = useChatComposer({
    roomId,
    memberId: chat.memberId,
    canSend: chat.room?.roomStatus === 'ACTIVE',
    latestMessageId: chat.messages.at(-1)?.messageId ?? 0,
  });
  const realtime = useChatRoomRealtime({
    roomId,
    memberId: chat.memberId,
    roomStatus: chat.room?.roomStatus,
    onMessage: composer.handleMessage,
    onError: composer.handleError,
  });
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
  } = useChatRoomActions(() => composer.setMessage(''));
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
        <ChatPhotoSection
          key={`${memberId}-${roomId}`}
          roomId={roomId}
          memberId={memberId}
          roomStatus={isBlocked ? 'BLOCKED' : room?.roomStatus}
          progressStatus={room?.progressStatus}
          partnerNickname={partnerNickname}
        />
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
          onReadLatest={realtime.markAsRead}
        />

        {isInputDisabled && (
          <p className='text-body1-15r px-[2rem] py-[0.8rem] text-center text-gray-600'>
            메시지를 보낼 수 없는 대화예요.
          </p>
        )}

        <div className='relative'>
          {!isInputDisabled && !realtime.isConnected && (
            <p
              role='status'
              className='text-body1-15r px-[2rem] py-[0.8rem] text-center text-gray-600'>
              대화 연결을 확인하고 있어요. 잠시만 기다려 주세요.
            </p>
          )}
          {composer.error && (
            <p
              role='alert'
              className='text-body1-15r px-[2rem] py-[0.8rem] text-center text-gray-600'>
              {composer.error}
            </p>
          )}
          {composer.isSending && (
            <p
              role='status'
              className='text-body1-15r px-[2rem] py-[0.8rem] text-center text-gray-600'>
              메시지를 보내고 있어요.
            </p>
          )}
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
            value={composer.message}
            onValueChange={composer.setMessage}
            inputProps={{
              disabled: isInputDisabled,
              onKeyDown: (event) => {
                if (event.key === 'Enter' && event.nativeEvent.isComposing)
                  event.preventDefault();
              },
            }}
            submitDisabled={
              isInputDisabled ||
              !realtime.isConnected ||
              composer.isSending ||
              !composer.message.trim()
            }
            placeholder={
              isInputDisabled
                ? '메시지를 보낼 수 없어요'
                : '메시지를 입력하세요'
            }
            onSubmit={(event) => {
              event.preventDefault();
              if (!isInputDisabled) composer.sendMessage();
            }}
          />
        </div>
      </main>

      <ChatReportSheet open={activeAction === 'report'} onClose={closeAction} />
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
