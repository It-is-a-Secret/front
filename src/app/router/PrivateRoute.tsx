import {isHTTPError} from 'ky';
import {Navigate, Outlet} from 'react-router-dom';

import {useAuthSession} from '@/shared/auth/useAuthSession';
import {Button} from '@/shared/components/Button';

export const PrivateRoute = () => {
  const session = useAuthSession();

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
    if (
      isHTTPError(session.error) &&
      [401, 403].includes(session.error.response.status)
    ) {
      return <Navigate to='/auth' replace />;
    }

    return (
      <section className='flex min-h-dvh flex-col items-center justify-center gap-[2.4rem] px-[2rem] text-center'>
        <p role='alert' className='text-body1-15r text-gray-600'>
          로그인 정보를 불러오지 못했어요.
        </p>
        <div className='w-full max-w-[28rem] [&>div]:h-[5.2rem]'>
          <Button
            text={session.isFetching ? '확인 중...' : '다시 시도'}
            disabled={session.isFetching}
            onClick={() => void session.refetch()}
          />
        </div>
      </section>
    );
  }

  return <Outlet />;
};
