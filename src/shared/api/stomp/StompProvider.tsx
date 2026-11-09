import {Client} from '@stomp/stompjs';
import {isHTTPError} from 'ky';
import {useCallback, useEffect, useRef, useState, type ReactNode} from 'react';

import {clearAccessToken, getAccessToken} from '@/shared/api/config/auth-token';
import {refreshAccessToken} from '@/shared/api/config/interceptor';

import {StompContext, type StompContextValue} from './context';

const getBrokerUrl = () => {
  const url = new URL(
    import.meta.env.VITE_WEBSOCKET_URL || '/ws',
    new URL(import.meta.env.VITE_BASE_URL || '/', window.location.origin)
  );
  if (url.protocol === 'https:') url.protocol = 'wss:';
  if (url.protocol === 'http:') url.protocol = 'ws:';
  return url.toString();
};

export const StompProvider = ({
  children,
  onAuthenticationError,
}: {
  children: ReactNode;
  onAuthenticationError: () => void;
}) => {
  const clientRef = useRef<Client | null>(null);
  const [status, setStatus] =
    useState<StompContextValue['status']>('connecting');
  const [connectionId, setConnectionId] = useState(0);

  useEffect(() => {
    let disposed = false;
    let attempts = 0;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    const client = new Client({
      brokerURL: getBrokerUrl(),
      reconnectDelay: 5000,
      connectionTimeout: 10000,
      debug: () => {},
    });
    clientRef.current = client;

    // 재연결 전에 HTTP 인증 경로로 토큰을 갱신합니다.
    client.beforeConnect = async () => {
      try {
        const token =
          attempts++ === 0 && getAccessToken()
            ? getAccessToken()
            : await refreshAccessToken();
        if (disposed) return;
        if (!token) throw new Error('인증 정보가 없습니다.');
        client.connectHeaders = {Authorization: `Bearer ${token}`};
        setStatus('connecting');
      } catch (error) {
        if (disposed) return;
        setStatus('error');
        void client.deactivate();
        if (isHTTPError(error) && [401, 403].includes(error.response.status)) {
          clearAccessToken();
          onAuthenticationError();
        } else {
          retryTimer = setTimeout(() => {
            if (!disposed) client.activate();
          }, 5000);
        }
      }
    };
    client.onConnect = () => {
      if (disposed) return;
      setConnectionId((id) => id + 1);
      setStatus('connected');
    };
    client.onStompError = () => {
      if (!disposed) setStatus('error');
    };
    client.onWebSocketError = () => {
      if (!disposed) setStatus('error');
    };
    client.onWebSocketClose = () => {
      if (!disposed) setStatus('error');
    };
    client.activate();

    return () => {
      disposed = true;
      clearTimeout(retryTimer);
      clientRef.current = null;
      void client.deactivate();
    };
  }, [onAuthenticationError]);

  const subscribe = useCallback(
    (destination: string, onMessage: (body: string) => void) => {
      const client = clientRef.current;
      if (!client?.connected) return () => {};
      const subscription = client.subscribe(destination, (frame) =>
        onMessage(frame.body)
      );
      return () => {
        if (client.connected) subscription.unsubscribe();
      };
    },
    []
  );

  const publish = useCallback((destination: string, body: unknown) => {
    const client = clientRef.current;
    if (!client?.connected) return false;
    try {
      client.publish({
        destination,
        body: JSON.stringify(body),
        headers: {'content-type': 'application/json'},
      });
      return true;
    } catch {
      return false;
    }
  }, []);

  return (
    <StompContext.Provider value={{status, connectionId, subscribe, publish}}>
      {children}
    </StompContext.Provider>
  );
};
