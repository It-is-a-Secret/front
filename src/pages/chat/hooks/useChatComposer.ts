import {useCallback, useEffect, useRef, useState} from 'react';
import {useQueryClient} from '@tanstack/react-query';

import {CHAT_DESTINATION} from '@/pages/chat/api/stomp/destination';
import type {
  ChatMessageEvent,
  ChatServerError,
} from '@/pages/chat/api/stomp/event';
import {QUERY_KEYS} from '@/shared/api';
import {useStomp} from '@/shared/api/stomp/useStomp';

interface PendingMessage {
  content: string;
  draft: string;
  afterMessageId: number;
  timer: ReturnType<typeof setTimeout>;
}

export const useChatComposer = ({
  roomId,
  memberId,
  canSend,
  latestMessageId,
}: {
  roomId: number;
  memberId: number | null;
  canSend: boolean;
  latestMessageId: number;
}) => {
  const {status, publish} = useStomp();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pendingRef = useRef<PendingMessage | null>(null);

  useEffect(
    () => () => {
      clearTimeout(pendingRef.current?.timer);
    },
    []
  );

  const handleMessage = useCallback(
    (received: ChatMessageEvent) => {
      const pending = pendingRef.current;
      if (
        !pending ||
        received.senderId !== memberId ||
        received.type !== 'TEXT' ||
        received.messageId <= pending.afterMessageId ||
        received.content !== pending.content
      )
        return;
      clearTimeout(pending.timer);
      pendingRef.current = null;
      setIsSending(false);
      setError(null);
      setMessage((draft) => (draft === pending.draft ? '' : draft));
    },
    [memberId]
  );

  const handleError = useCallback((received: ChatServerError) => {
    // 오류 응답에는 요청 ID가 없어 읽음 오류와 송신 오류를 구분할 수 없습니다.
    // 방 접근이 막힌 경우만 즉시 중단하고, 나머지는 메시지 수신을 기다립니다.
    if ([403, 404, 409].includes(received.status)) {
      clearTimeout(pendingRef.current?.timer);
      pendingRef.current = null;
      setIsSending(false);
    }
    setError(received.message);
  }, []);

  const sendMessage = () => {
    const content = message.trim();
    if (!canSend || status !== 'connected' || !content || pendingRef.current)
      return;
    setError(null);
    setIsSending(true);
    const timer = setTimeout(() => {
      pendingRef.current = null;
      setIsSending(false);
      setError(
        '전송 결과를 확인하지 못했어요. 대화를 확인한 뒤 다시 시도해 주세요.'
      );
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.chat.room(roomId),
      });
    }, 10000);
    pendingRef.current = {
      content,
      draft: message,
      afterMessageId: latestMessageId,
      timer,
    };
    if (!publish(CHAT_DESTINATION.SEND(roomId), {type: 'TEXT', content})) {
      clearTimeout(timer);
      pendingRef.current = null;
      setIsSending(false);
      setError('연결을 확인한 뒤 다시 시도해 주세요.');
    }
  };

  return {
    message,
    setMessage,
    isSending,
    error,
    sendMessage,
    handleMessage,
    handleError,
  };
};
