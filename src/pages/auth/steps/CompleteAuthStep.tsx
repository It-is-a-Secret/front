import {Button} from '@/shared/components/Button';

interface CompleteAuthStepProps {
  onNext: () => void;
  onLater: () => void;
}

export const CompleteAuthStep = ({onNext, onLater}: CompleteAuthStepProps) => {
  return (
    <section className='flex min-h-dvh flex-col'>
      <div className='flex flex-1 flex-col items-center justify-center'>
        <img src='complete.png' alt='' className='mb-[2.4rem]' />
        <div className='flex flex-col items-center text-center'>
          <h1 className='text-title-22b mb-[1.6rem] whitespace-pre-line text-gray-800'>
            {'인증 완료!\n'}
            <span className='text-primary'>이제 시작해 볼까요?</span>
          </h1>

          <p className='text-caption1-12r whitespace-pre-line text-gray-600'>
            {'프로필을 작성해야 다른 학생과\n채팅을 주고받을 수 있어요'}
          </p>
        </div>
      </div>

      <div className='mt-auto flex flex-col pb-[3.8rem]'>
        <button
          type='button'
          className='text-button1-14b border-primary text-primary w-full rounded-[20px] border bg-transparent p-[1.55rem]'
          onClick={onLater}>
          나중에 하기
        </button>
        <Button text='지금 프로필 만들기' onClick={onNext} />
      </div>
    </section>
  );
};
