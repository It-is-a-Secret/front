import {Navigate, Outlet, useLocation} from 'react-router-dom';

import {SessionRestoreError} from '@/shared/auth/components/SessionRestoreError';
import {
  getChatLoginPath,
  getChatReturnPath,
} from '@/shared/auth/model/chat-return-path';
import {hasVerifiedSchoolEmail} from '@/shared/auth/model/registration-status';
import {isAuthenticationError} from '@/shared/auth/model/session-error';
import {useAuthSession} from '@/shared/auth/useAuthSession';
import {ChatRealtimeProvider} from '@/pages/chat/components/ChatRealtimeProvider';
import {useSyncChatPush} from '@/shared/pwa/chat-push';

export const PrivateRoute = () => {
  const {pathname} = useLocation();
  const session = useAuthSession();
  const isEmailVerified = hasVerifiedSchoolEmail(
    session.data?.profile.data?.registrationStatus
  );
  useSyncChatPush(isEmailVerified ? session.memberId : null);

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

  if (!isEmailVerified) {
    const returnPath = getChatReturnPath(pathname);
    const search = new URLSearchParams({step: 'email'});
    if (returnPath) search.set('returnTo', returnPath);
    return <Navigate to={`/auth?${search}`} replace />;
  }

  return (
    <ChatRealtimeProvider key={session.memberId}>
      <Outlet />
    </ChatRealtimeProvider>
  );
};
