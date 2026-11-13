import {useMemo, useState} from 'react';

import {useQuery} from '@tanstack/react-query';
import {useNavigate} from 'react-router-dom';

import {MyMenuItem} from '@/pages/my/components/MyMenuItem';
import {OnboardingUnfinishedCard} from '@/pages/my/components/OnboardingUnfinishedCard';
import {Profile} from '@/pages/my/components/Profile';
import {MY_QUERY_OPTIONS} from '@/pages/my/api/query';
import {useLogout} from '@/pages/my/hooks/useLogout';
import {
  MyMenuSheet,
  type MyMenuSheetType,
} from '@/pages/my/features/menu-sheet/MyMenuSheet';
import {
  ONBOARDING_STEP_LABELS,
  ONBOARDING_STEPS,
} from '@/pages/onboarding/constants/constants';
import {getOnboardingDraftStep} from '@/pages/onboarding/model/onboarding-draft-storage';
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
  const {open: openLogoutSheet, logoutSheet} = useLogout();
  const profileQuery = useQuery({
    ...MY_QUERY_OPTIONS.PROFILE(),
    refetchOnMount: 'always',
  });
  const profile = profileQuery.data?.data;
  const memberId =
    profileQuery.isFetchedAfterMount && !profileQuery.isError
      ? profile?.id
      : undefined;
  const onboardingCompleted = profile?.registrationStatus === 'COMPLETED';
  const savedStep = useMemo(
    () => (memberId === undefined ? null : getOnboardingDraftStep(memberId)),
    [memberId]
  );
  const nextStep = savedStep ?? 'nickname';
  const completedCount = ONBOARDING_STEPS.indexOf(nextStep);
  const [isChatNotificationOn, setIsChatNotificationOn] = useState(true);
  const [selectedMenuSheet, setSelectedMenuSheet] =
    useState<MyMenuSheetType | null>(null);

  return (
    <main className='flex h-dvh flex-col overflow-y-auto overscroll-y-none pb-[12rem]'>
      <Header
        className='shrink-0'
        title={
          <h1 className='text-bold-24 text-gray-800'>
            Blur<span className='text-primary'>Some</span>
          </h1>
        }
      />
      {memberId !== undefined && !onboardingCompleted && (
        <div className='mt-[1.6rem]'>
          <OnboardingUnfinishedCard
            completedCount={completedCount}
            totalCount={ONBOARDING_STEPS.length - 1}
            nextStepLabel={ONBOARDING_STEP_LABELS[nextStep]}
            onContinue={() => navigate('/onboarding')}
          />
        </div>
      )}
      <section className='mt-[1.6rem] shrink-0'>
        {profileQuery.isPending ? (
          <p role='status' className='text-body1-15r text-gray-600'>
            프로필을 불러오는 중...
          </p>
        ) : profileQuery.isError || !profile ? (
          <div className='flex flex-col gap-[1.6rem]'>
            <p role='alert' className='text-body1-15r text-gray-800'>
              프로필을 불러오지 못했어요.
            </p>
            <Button
              text={profileQuery.isFetching ? '불러오는 중...' : '다시 시도'}
              disabled={profileQuery.isFetching}
              onClick={() => void profileQuery.refetch()}
            />
          </div>
        ) : (
          <>
            <Profile profile={profile} />
            <button
              type='button'
              onClick={() => navigate('/my/profile-edit')}
              className='bg-primary-600 text-body2-15sb text-white-800 mt-[1.6rem] w-full rounded-[16px] py-[1.35rem]'>
              프로필 수정
            </button>
          </>
        )}
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
            onClick={openLogoutSheet}
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
      {logoutSheet}
    </main>
  );
};
