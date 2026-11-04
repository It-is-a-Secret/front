import {NoticeMessage} from '@/pages/my/components/NoticeMessage';
import {WithdrawalNoticeCard} from '@/pages/my/components/WithdrawalNoticeCard';
import {ToastMessage} from '@/pages/my/components/ToastMessage';
import {useWithdrawal} from '@/pages/my/hooks/useWithdrawal';
import {Button} from '@/shared/components/Button';
import {Header} from '@/shared/components/Header';
import {
  IcSvgError,
  IcSvgLeft,
  IcSvgWithdrawalCalendar,
  IcSvgWithdrawalChat,
  IcSvgWithdrawalProfile,
} from '@/shared/icons';

interface SecessionSheetProps {
  onClose: () => void;
}

export const SecessionSheet = ({onClose}: SecessionSheetProps) => {
  const withdrawal = useWithdrawal(onClose);
  return (
    <section className='pb-[11.6rem]'>
      <Header
        title={<h2 className='text-title-18b text-gray-800'>회원 탈퇴</h2>}
        leftItem={
          <IcSvgLeft width={24} height={24} className='text-gray-800' />
        }
        onClickLeft={withdrawal.close}
      />
      <div className='mt-[1.6rem]'>
        <NoticeMessage message='탈퇴 전 아래 내용을 꼭 확인해 주세요' />
      </div>
      <div className='mt-[2.4rem] flex flex-col gap-[1.2rem]'>
        <WithdrawalNoticeCard
          icon={<IcSvgWithdrawalProfile className='size-[5.2rem]' />}
          title='프로필이 더 이상 노출되지 않아요'
          description='계정과 프로필이 비활성화되며, 탐색 및 채팅에서 더 이상 보이지 않아요'
        />
        <WithdrawalNoticeCard
          icon={<IcSvgWithdrawalChat className='size-[5.2rem]' />}
          title='진행 중인 대화가 종료돼요'
          description='참여 중인 대화가 종료되며, 상대방은 지난 대화 이력만 확인할 수 있어요'
        />
        <WithdrawalNoticeCard
          icon={<IcSvgWithdrawalCalendar className='size-[5.2rem]' />}
          title='30일 동안 재가입할 수 없어요'
          description='30일 간 동일 카카오 계정 및 동일 학교 이메일로 재가입할 수 없어요'
        />
      </div>
      <div className='bg-background fixed right-0 bottom-[3.6rem] left-0 z-[61] mx-auto flex w-full max-w-[430px] min-w-[375px] flex-col gap-[1.2rem] px-[2rem]'>
        <div className='text-regular-12 text-error flex items-center justify-center gap-[0.4rem]'>
          <IcSvgError className='size-[1.2rem]' />
          탈퇴 후에는 되돌릴 수 없어요
        </div>
        <div className='flex w-full gap-[0.8rem]'>
          <div className='flex-[1]'>
            <Button
              text='취소'
              className='border-primary text-button1-14b text-primary h-[5.6rem] rounded-[28px] border'
              onClick={withdrawal.close}
              disabled={withdrawal.isSubmitting}
            />
          </div>
          <div className='flex-[1.8]'>
            <Button
              text={withdrawal.isSubmitting ? '탈퇴 중...' : '탈퇴 하기'}
              onClick={() => void withdrawal.submit()}
              disabled={withdrawal.isSubmitting}
              className='bg-primary text-button1-14b text-white-800 h-[5.6rem] rounded-[28px] shadow-[0_8px_10px_0_rgba(194,30,86,0.25)]'
            />
          </div>
        </div>
      </div>
      {withdrawal.toast.isVisible && (
        <div
          className={`fixed right-[2rem] bottom-[12rem] left-[2rem] z-[80] mx-auto max-w-[39rem] transition-opacity ${withdrawal.toast.isLeaving ? 'opacity-0' : 'opacity-100'}`}
          style={{transitionDuration: `${withdrawal.toast.fadeDuration}ms`}}>
          <ToastMessage message={withdrawal.errorMessage} />
        </div>
      )}
    </section>
  );
};
