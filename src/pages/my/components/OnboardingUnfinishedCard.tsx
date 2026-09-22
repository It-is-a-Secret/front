interface OnboardingUnfinishedCardProps {
  completedCount: number;
  totalCount: number;
  nextStepLabel: string;
  onContinue: () => void;
}

export const OnboardingUnfinishedCard = ({
  completedCount,
  totalCount,
  nextStepLabel,
  onContinue,
}: OnboardingUnfinishedCardProps) => {
  const progress = Math.round((completedCount / totalCount) * 100);

  return (
    <section className='border-primary flex flex-col gap-[1.6rem] rounded-[1.6rem] border border-dashed px-[1.6rem] py-[2.4rem]'>
      <div className='flex flex-col gap-[0.4rem]'>
        <span className='text-body2-15sb text-primary'>
          ONBOARDING UNFINISHED
        </span>

        <h2 className='text-h1-22sb whitespace-pre-line text-gray-800'>
          {'프로필을 완성해\n채팅을 시작해요'}
        </h2>
      </div>
      <div className='flex flex-col gap-[1.2rem]'>
        <p className='text-body1-15r mt-[2.4rem] text-gray-600'>
          {completedCount}/{totalCount} 완료 · {nextStepLabel}부터{' '}
          {completedCount === 0 ? '시작해 볼까요?' : '이어가 볼까요?'}
        </p>

        <div className='h-[0.3rem] overflow-hidden bg-gray-200'>
          <div className='bg-primary h-full' style={{width: `${progress}%`}} />
        </div>
      </div>

      <button
        type='button'
        className='bg-primary-600 text-body2-15sb text-white-800 h-[4.8rem] rounded-[16px]'
        onClick={onContinue}>
        {completedCount === 0 ? '온보딩 시작하기' : '온보딩 이어서 하기'}
      </button>
    </section>
  );
};
