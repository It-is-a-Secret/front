import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {MyMenuItem} from '@/pages/my/components/MyMenuItem';
import {OnboardingUnfinishedCard} from '@/pages/my/components/OnboardingUnfinishedCard';
import {Profile} from '@/pages/my/components/Profile';
import {
  MyMenuSheet,
  type MyMenuSheetType,
} from '@/pages/my/features/menu-sheet/MyMenuSheet';
import {BottomSheet} from '@/shared/components/BottomSheet';
import {Button} from '@/shared/components/Button';
import {Header} from '@/shared/components/Header';
import {
  IcSvgBell,
  IcSvgBlock,
  IcSvgCheck,
  IcSvgExit,
  IcSvgSecession,
} from '@/shared/icons';

export const MyPage = () => {
  const navigate = useNavigate();
  const onboardingCompleted = false;
  const [isChatNotificationOn, setIsChatNotificationOn] = useState(true);
  const [selectedMenuSheet, setSelectedMenuSheet] =
    useState<MyMenuSheetType | null>(null);
  const [isLogoutSheetOpen, setIsLogoutSheetOpen] = useState(false);

  const handleCloseLogoutSheet = () => {
    setIsLogoutSheetOpen(false);
  };

  return (
    <main className='flex min-h-dvh flex-col'>
      <Header
        title={
          <h1 className='text-bold-24 text-gray-800'>
            Blur<span className='text-primary'>Some</span>
          </h1>
        }
      />
      {!onboardingCompleted && (
        <div className='mt-[1.6rem]'>
          <OnboardingUnfinishedCard
            completedCount={4}
            totalCount={8}
            nextStepLabel='MBTI 선택'
            onContinue={() => navigate('/onboarding')}
          />
        </div>
      )}
      <section className='mt-[1.6rem]'>
        <Profile
          nickname='행복한코딩러'
          birthYear='00'
          gender='남'
          department='소프트웨어학과'
        />
        <button
          type='button'
          onClick={() => navigate('/my/profile-edit')}
          className='bg-primary-600 text-body2-15sb text-white-800 mt-[1.6rem] w-full rounded-[16px] py-[1.35rem]'>
          프로필 수정
        </button>
        <div className='text-body1-15r mt-[2.8rem] mb-[0.8rem]'>개인설정</div>
        <div className='flex flex-col gap-[0.8rem]'>
          <MyMenuItem
            type='toggle'
            Icon={IcSvgBell}
            label='채팅 알림 설정'
            checked={isChatNotificationOn}
            onCheckedChange={setIsChatNotificationOn}
          />
          <MyMenuItem
            type='click'
            Icon={IcSvgBlock}
            label='차단 목록'
            onClick={() => setSelectedMenuSheet('blocked')}
          />
          <MyMenuItem
            type='click'
            Icon={IcSvgCheck}
            label='이용약관·정책'
            onClick={() => setSelectedMenuSheet('policies')}
          />
        </div>
        <div className='text-body1-15r mt-[1.6rem] mb-[0.8rem]'>계정관리</div>
        <div className='flex flex-col gap-[0.8rem]'>
          <MyMenuItem
            type='click'
            Icon={IcSvgExit}
            label='로그아웃'
            onClick={() => setIsLogoutSheetOpen(true)}
          />
          <MyMenuItem
            type='click'
            Icon={IcSvgSecession}
            label='회원 탈퇴'
            onClick={() => setSelectedMenuSheet('secession')}
          />
        </div>
      </section>
      <MyMenuSheet
        type={selectedMenuSheet}
        onClose={() => setSelectedMenuSheet(null)}
      />
      <BottomSheet
        open={isLogoutSheetOpen}
        ariaLabel='로그아웃 확인'
        onClose={handleCloseLogoutSheet}>
        <div className='flex flex-col items-center px-[1.2rem] pb-[3.6rem] text-center'>
          <img src='logout.png' className='size-[9.2rem]' />
          <h2 className='text-title-22b text-primary mb-[0.8rem]'>
            로그아웃할까요?
          </h2>
          <p className='text-body1-15r mb-[2.8rem] text-gray-600'>
            언제든 다시 로그인할 수 있어요
          </p>
          <div className='flex w-full gap-[0.8rem]'>
            <div className='flex-[1]'>
              <Button
                text='취소'
                className='border-primary text-button1-14b text-primary h-[5.6rem] rounded-[28px] border'
                onClick={handleCloseLogoutSheet}
              />
            </div>
            <div className='flex-[1.8]'>
              <Button
                text='로그아웃'
                className='bg-primary text-button1-14b text-white-800 h-[5.6rem] rounded-[28px] shadow-[0_8px_10px_0_rgba(194,30,86,0.25)]'
                onClick={handleCloseLogoutSheet}
              />
            </div>
          </div>
        </div>
      </BottomSheet>
    </main>
  );
};
