import {useCallback} from 'react';
import type {ChatRoomSummary} from '@/pages/chat/api/type';
import {ChatMessage} from '@/pages/chat/components/ChatMessage';
import {SystemMessage} from '@/pages/chat/components/SystemMessage';
import {
  useChatMessageScroll,
  type UseChatMessageScrollParams,
} from '@/pages/chat/hooks/useChatMessageScroll';

interface ChatMessageListSectionProps extends UseChatMessageScrollParams {
  memberId: number;
  partnerLastReadMessageId: ChatRoomSummary['partnerLastReadMessageId'];
  onReadLatest?: (messageId: number) => void;
}

export const ChatMessageListSection = ({
  messages,
  memberId,
  partnerLastReadMessageId,
  hasNextPage,
  isFetchingNextPage,
  isFetchNextPageError,
  onLoadPreviousMessages,
  onReadLatest,
}: ChatMessageListSectionProps) => {
  const latestMessageId = messages.at(-1)?.messageId;
  const handleReachBottom = useCallback(() => {
    if (latestMessageId != null) onReadLatest?.(latestMessageId);
  }, [latestMessageId, onReadLatest]);
  const {
    containerRef,
    loadPreviousRef,
    handleScroll,
    handleLoadPreviousMessages,
  } = useChatMessageScroll({
    messages,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    onLoadPreviousMessages,
    onReachBottom: handleReachBottom,
    scrollToMessageId:
      messages.at(-1)?.senderId === memberId ? latestMessageId : undefined,
  });

  return (
    <section
      ref={containerRef}
      aria-label='대화 내역'
      className='min-h-0 flex-1 overflow-y-auto px-[2rem] py-[2.4rem]'
      onScroll={handleScroll}>
      <div ref={loadPreviousRef} className='h-px' aria-hidden='true' />
      {hasNextPage && (
        <button
          type='button'
          disabled={isFetchingNextPage}
          onClick={() => void handleLoadPreviousMessages()}
          className='text-caption2-12sb text-primary mb-[1.6rem] w-full py-[0.8rem] disabled:text-gray-400'>
          {isFetchingNextPage
            ? '이전 메시지를 불러오고 있어요'
            : isFetchNextPageError
              ? '이전 메시지 다시 불러오기'
              : '이전 메시지 보기'}
        </button>
      )}
      {messages.length === 0 ? (
        <p className='text-body1-15r py-[2.4rem] text-center text-gray-600'>
          아직 메시지가 없어요.
        </p>
      ) : (
        <ul className='flex flex-col gap-[1.6rem]'>
          {messages.map((message) => {
            if (message.type === 'SYSTEM') {
              return (
                <SystemMessage
                  key={message.messageId}
                  message={message.content}
                />
              );
            }
            return (
              <ChatMessage
                key={message.messageId}
                {...message}
                isMine={message.senderId === memberId}
                isRead={
                  message.messageId != null &&
                  message.messageId <= (partnerLastReadMessageId ?? 0)
                }
              />
            );
          })}
        </ul>
      )}
    </section>
  );
};
