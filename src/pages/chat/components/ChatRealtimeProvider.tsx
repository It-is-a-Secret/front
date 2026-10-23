import {useCallback, useRef, type ReactNode} from 'react';
import {useQueryClient} from '@tanstack/react-query';

import {ChatRealtimeContext} from '@/pages/chat/api/stomp/realtime-context';
import type {ChatServerError} from '@/pages/chat/api/stomp/event';
import {useChatNotifications} from '@/pages/chat/hooks/useChatNotifications';
import {StompProvider} from '@/shared/api/stomp/StompProvider';
import {authSessionQueryOptions} from '@/shared/auth/session-query';

const ChatRealtimeSession = ({children}: {children: ReactNode}) => {
  const errorListeners = useRef(new Set<(error: ChatServerError) => void>());
  const onError = useCallback((error: ChatServerError) => {
    errorListeners.current.forEach((listener) => listener(error));
  }, []);
  const subscribeErrors = useCallback(
    (listener: (error: ChatServerError) => void) => {
      errorListeners.current.add(listener);
      return () => {
        errorListeners.current.delete(listener);
      };
    },
    []
  );
  useChatNotifications(onError);
  return (
    <ChatRealtimeContext.Provider value={{subscribeErrors}}>
      {children}
    </ChatRealtimeContext.Provider>
  );
};

export const ChatRealtimeProvider = ({children}: {children: ReactNode}) => {
  const queryClient = useQueryClient();
  const handleAuthenticationError = useCallback(() => {
    void queryClient.invalidateQueries({
      queryKey: authSessionQueryOptions().queryKey,
    });
  }, [queryClient]);

  return (
    <StompProvider onAuthenticationError={handleAuthenticationError}>
      <ChatRealtimeSession>{children}</ChatRealtimeSession>
    </StompProvider>
  );
};
