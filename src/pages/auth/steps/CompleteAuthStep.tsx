import {Button} from '@/shared/components/Button';

interface CompleteAuthStepProps {
  onNext: () => void;
  onLater: () => void;
}

export const CompleteAuthStep = ({onNext, onLater}: CompleteAuthStepProps) => {
  return (
    <section className='flex min-h-dvh flex-col'>
      <div className='mt-auto flex flex-col pb-[3.8rem]'>
        <button
          type='button'
          className='text-button1-14b w-full rounded-[20px] border border-gray-200 bg-transparent p-[1.55rem] text-gray-600'
          onClick={onLater}>
          나중에 하기
        </button>
        <Button text='지금 프로필 만들기' onClick={onNext} />
      </div>
    </section>
  );
};
