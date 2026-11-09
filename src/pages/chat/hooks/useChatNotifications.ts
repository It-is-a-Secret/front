import {useEffect} from 'react';
import {useQueryClient} from '@tanstack/react-query';

import {CHAT_DESTINATION} from '@/pages/chat/api/stomp/destination';
import {
  parseNotification,
  parseServerError,
  type ChatServerError,
} from '@/pages/chat/api/stomp/event';
import {refreshChatRooms} from '@/pages/chat/utils/refresh-chat-rooms';
import {QUERY_KEYS} from '@/shared/api';
import {useStomp} from '@/shared/api/stomp/useStomp';

export const useChatNotifications = (
  onError: (error: ChatServerError) => void
) => {
  const queryClient = useQueryClient();
  const {status, connectionId, subscribe} = useStomp();

  useEffect(() => {
    if (status !== 'connected') return;
    const unsubscribeErrors = subscribe(CHAT_DESTINATION.ERRORS, (body) => {
      try {
        const error = parseServerError(body);
        if (!error) return;
        onError(error);
        void queryClient.invalidateQueries(
          {queryKey: QUERY_KEYS.chat.all},
          {cancelRefetch: false}
        );
      } catch {
        console.warn('채팅 오류 응답을 읽을 수 없습니다.');
      }
    });
    const unsubscribeRooms = subscribe(
      CHAT_DESTINATION.NOTIFICATIONS,
      (body) => {
        try {
          if (!parseNotification(body)) return;
          // 알림은 unreadCount를 포함하지 않으므로 서버의 목록으로 다시 맞춥니다.
          void refreshChatRooms(queryClient);
        } catch {
          console.warn('채팅 알림 응답을 읽을 수 없습니다.');
        }
      }
    );
    void queryClient.invalidateQueries(
      {queryKey: QUERY_KEYS.chat.all},
      {cancelRefetch: false}
    );
    return () => {
      unsubscribeErrors();
      unsubscribeRooms();
    };
  }, [connectionId, onError, queryClient, status, subscribe]);
};
