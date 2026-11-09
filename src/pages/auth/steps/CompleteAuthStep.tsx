import {useState} from 'react';

import {BottomSheet} from '@/shared/components/BottomSheet';
import {Button} from '@/shared/components/Button';
import {EmptyState} from '@/shared/components/EmptyState';

interface CompleteAuthStepProps {
  onNext: () => void;
  onLater: () => void;
}

export const CompleteAuthStep = ({onNext, onLater}: CompleteAuthStepProps) => {
  const [isLaterSheetOpen, setIsLaterSheetOpen] = useState(false);

  const handleCloseLaterSheet = () => {
    setIsLaterSheetOpen(false);
  };

  return (
    <section className='flex min-h-dvh flex-col'>
      <div className='flex flex-1 flex-col items-center justify-center'>
        <EmptyState
          image={<img src='complete.png' alt='' />}
          title='인증 완료!'
          highlightTitle='이제 시작해 볼까요?'
          description={
            '프로필을 작성해야 다른 학생과\n채팅을 주고받을 수 있어요'
          }
        />
      </div>

      <div className='mt-auto flex flex-col gap-[0.8rem] pb-[3.8rem]'>
        <button
          type='button'
          className='text-button1-14b border-primary text-primary w-full rounded-[20px] border bg-transparent p-[1.55rem]'
          onClick={() => setIsLaterSheetOpen(true)}>
          나중에 하기(둘러보기)
        </button>
        <Button text='지금 프로필 만들기' onClick={onNext} />
      </div>

      <BottomSheet
        open={isLaterSheetOpen}
        ariaLabel='프로필 생성 미루기 확인'
        onClose={handleCloseLaterSheet}>
        <div className='flex flex-col items-center px-[1.2rem] pb-[3.6rem] text-center'>
          <img src='lock.png' className='size-[9.2rem]' />
          <h2 className='text-title-18b mb-[0.8rem] whitespace-pre-line text-gray-800'>
            {'나중에 하시겠어요?\n'}
            <span className='text-primary'>채팅이 제한될 수 있어요</span>
          </h2>
          <p className='text-body1-15r mb-[2.8rem] whitespace-pre-line text-gray-600'>
            {
              '프로필을 만들어야 다른 사람과 채팅할 수 있어요\n지금은 탐색 기능만 이용 가능해요'
            }
          </p>
          <div className='flex w-full gap-[0.8rem]'>
            <div className='flex-[1]'>
              <Button
                text='나중에 하기'
                className='border-primary text-button1-14b text-primary h-[5.6rem] rounded-[28px] border'
                onClick={onLater}
              />
            </div>
            <div className='flex-[1.8]'>
              <Button
                text='지금 프로필 만들기'
                className='bg-primary text-button1-14b text-white-800 h-[5.6rem] rounded-[28px] shadow-[0_8px_10px_0_rgba(194,30,86,0.25)]'
                onClick={onNext}
              />
            </div>
          </div>
        </div>
      </BottomSheet>
    </section>
  );
};
