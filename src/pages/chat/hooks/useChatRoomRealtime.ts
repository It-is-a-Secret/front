import {useCallback, useContext, useEffect, useRef} from 'react';
import {useQueryClient} from '@tanstack/react-query';

import {CHAT_DESTINATION} from '@/pages/chat/api/stomp/destination';
import {
  parseRoomEvent,
  type ChatMessageEvent,
  type ChatServerError,
} from '@/pages/chat/api/stomp/event';
import {ChatRealtimeContext} from '@/pages/chat/api/stomp/realtime-context';
import type {ChatRoomSummary, GetChatRoomResponse} from '@/pages/chat/api/type';
import {appendChatMessage} from '@/pages/chat/utils/chat-message-cache';
import {getRevealedPhotoCount} from '@/pages/chat/utils/get-revealed-photo-count';
import {refreshChatRooms} from '@/pages/chat/utils/refresh-chat-rooms';
import {QUERY_KEYS} from '@/shared/api';
import {useStomp} from '@/shared/api/stomp/useStomp';

export const useChatRoomRealtime = ({
  roomId,
  memberId,
  roomStatus,
  onMessage,
  onError,
}: {
  roomId: number;
  memberId: number | null;
  roomStatus: ChatRoomSummary['roomStatus'];
  onMessage: (message: ChatMessageEvent) => void;
  onError: (error: ChatServerError) => void;
}) => {
  const queryClient = useQueryClient();
  const {status, connectionId, subscribe, publish} = useStomp();
  const events = useContext(ChatRealtimeContext);
  const lastReadRef = useRef({connectionId: 0, messageId: 0});
  const subscribedConnectionRef = useRef(0);
  const pendingReadRef = useRef(0);
  if (!events) throw new Error('ChatRealtimeProvider가 필요합니다.');
  const {subscribeErrors} = events;

  const markAsRead = useCallback(
    (messageId: number) => {
      if (
        status !== 'connected' ||
        roomStatus !== 'ACTIVE' ||
        document.visibilityState !== 'visible' ||
        !Number.isSafeInteger(messageId) ||
        messageId <= 0
      )
        return;
      if (subscribedConnectionRef.current !== connectionId) {
        pendingReadRef.current = Math.max(pendingReadRef.current, messageId);
        return;
      }
      const previous = lastReadRef.current;
      if (
        previous.connectionId === connectionId &&
        previous.messageId >= messageId
      )
        return;
      if (
        publish(CHAT_DESTINATION.READ(roomId), {lastReadMessageId: messageId})
      ) {
        lastReadRef.current = {connectionId, messageId};
      }
    },
    [connectionId, publish, roomId, roomStatus, status]
  );

  useEffect(() => subscribeErrors(onError), [onError, subscribeErrors]);

  useEffect(() => {
    if (status !== 'connected' || memberId === null) return;
    const unsubscribe = subscribe(CHAT_DESTINATION.ROOM(roomId), (body) => {
      try {
        const event = parseRoomEvent(body);
        if (!event || event.roomId !== roomId) return;
        if ('messageId' in event) {
          appendChatMessage(queryClient, roomId, event);
          queryClient.setQueryData<GetChatRoomResponse>(
            QUERY_KEYS.chat.room(roomId),
            (old) => {
              if (
                !old?.data ||
                (old.data.lastMessageId ?? 0) >= event.messageId
              )
                return old;
              return {
                ...old,
                data: {
                  ...old.data,
                  lastMessageId: event.messageId,
                  lastMessage: event,
                },
              };
            }
          );
          onMessage(event);
          void refreshChatRooms(queryClient);
        } else if (event.eventType === 'READ') {
          if (event.readerId !== memberId) {
            queryClient.setQueryData<GetChatRoomResponse>(
              QUERY_KEYS.chat.room(roomId),
              (old) =>
                old?.data
                  ? {
                      ...old,
                      data: {
                        ...old.data,
                        partnerLastReadMessageId: Math.max(
                          old.data.partnerLastReadMessageId ?? 0,
                          event.lastReadMessageId
                        ),
                      },
                    }
                  : old
            );
          }
          void refreshChatRooms(queryClient);
        } else {
          queryClient.setQueryData<GetChatRoomResponse>(
            QUERY_KEYS.chat.room(roomId),
            (old) =>
              old?.data &&
              getRevealedPhotoCount(old.data.progressStatus) <
                getRevealedPhotoCount(event.progressStatus)
                ? {
                    ...old,
                    data: {...old.data, progressStatus: event.progressStatus},
                  }
                : old
          );
          void queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.chat.revealedImages(roomId),
          });
        }
      } catch {
        console.warn('채팅방 이벤트를 읽을 수 없습니다.');
      }
    });
    subscribedConnectionRef.current = connectionId;
    if (pendingReadRef.current) {
      markAsRead(pendingReadRef.current);
      pendingReadRef.current = 0;
    }
    void queryClient.invalidateQueries(
      {queryKey: QUERY_KEYS.chat.room(roomId)},
      {cancelRefetch: false}
    );
    return () => {
      subscribedConnectionRef.current = 0;
      unsubscribe();
    };
  }, [
    connectionId,
    markAsRead,
    memberId,
    onMessage,
    queryClient,
    roomId,
    status,
    subscribe,
  ]);

  return {
    isConnected: status === 'connected',
    connectionStatus: status,
    markAsRead,
  };
};
