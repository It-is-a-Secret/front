import {Navigate, Outlet, useLocation} from 'react-router-dom';

import {SessionRestoreError} from '@/shared/auth/components/SessionRestoreError';
import {getChatLoginPath} from '@/shared/auth/model/chat-return-path';
import {isAuthenticationError} from '@/shared/auth/model/session-error';
import {useAuthSession} from '@/shared/auth/useAuthSession';
import {ChatRealtimeProvider} from '@/pages/chat/components/ChatRealtimeProvider';
import {useSyncChatPush} from '@/shared/pwa/chat-push';

export const PrivateRoute = () => {
  const {pathname} = useLocation();
  const session = useAuthSession();
  useSyncChatPush(session.memberId);

  if (session.isPending) {
    return (
      <section
        role='status'
        className='flex min-h-dvh items-center justify-center'>
        로그인 정보를 확인하고 있어요.
      </section>
    );
  }

  if (session.isError) {
    if (isAuthenticationError(session.error)) {
      return <Navigate to={getChatLoginPath(pathname)} replace />;
    }

    return (
      <SessionRestoreError
        isFetching={session.isFetching}
        onRetry={() => void session.refetch()}
      />
    );
  }

  return (
    <ChatRealtimeProvider key={session.memberId}>
      <Outlet />
    </ChatRealtimeProvider>
  );
};
