import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {MyMenuItem} from '@/pages/my/components/MyMenuItem';
import {Profile} from '@/pages/my/components/Profile';
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
  const [isChatNotificationOn, setIsChatNotificationOn] = useState(true);

  return (
    <main className='flex min-h-dvh flex-col'>
      <Header
        title={
          <h1 className='text-bold-24 text-gray-800'>
            Blur<span className='text-primary'>Some</span>
          </h1>
        }
      />
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
            onClick={() => {}}
          />
          <MyMenuItem
            type='click'
            Icon={IcSvgCheck}
            label='이용약관·정책'
            onClick={() => {}}
          />
        </div>
        <div className='text-body1-15r mt-[1.6rem] mb-[0.8rem]'>계정관리</div>
        <div className='flex flex-col gap-[0.8rem]'>
          <MyMenuItem
            type='click'
            Icon={IcSvgExit}
            label='로그아웃'
            onClick={() => {}}
          />
          <MyMenuItem
            type='click'
            Icon={IcSvgSecession}
            label='회원 탈퇴'
            onClick={() => {}}
          />
        </div>
      </section>
    </main>
  );
};
