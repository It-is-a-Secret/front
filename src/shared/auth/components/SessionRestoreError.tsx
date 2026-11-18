import {Button} from '@/shared/components/Button';

export const SessionRestoreError = ({
  isFetching,
  onRetry,
}: {
  isFetching: boolean;
  onRetry: () => void;
}) => (
  <section className='flex min-h-dvh flex-col items-center justify-center gap-[2.4rem] px-[2rem] text-center'>
    <p role='alert' className='text-body1-15r text-gray-600'>
      로그인 정보를 불러오지 못했어요.
    </p>
    <div className='w-full max-w-[28rem] [&>div]:h-[5.2rem]'>
      <Button
        text={isFetching ? '확인 중...' : '다시 시도'}
        disabled={isFetching}
        onClick={onRetry}
      />
    </div>
  </section>
);
