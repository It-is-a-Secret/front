import {useNavigate} from 'react-router-dom';

import {NoticeMessage} from '@/pages/my/components/NoticeMessage';
import {ProfileSettingItem} from '@/pages/my/components/ProfileSettingItem';
import {BottomNavBar} from '@/shared/components/BottomNavBar';
import {Header} from '@/shared/components/Header';
import {IcSvgLeft} from '@/shared/icons';

export const ProfileEditPage = () => {
  const navigate = useNavigate();

  return (
    <main className='min-h-dvh pb-[12rem]'>
      <Header
        title={<h1 className='text-title-18b text-gray-800'>프로필 수정</h1>}
        leftItem={
          <IcSvgLeft width={24} height={24} className='text-gray-800' />
        }
        onClickLeft={() => navigate('/my')}
      />

      <section className='mt-[1.6rem]'>
        <NoticeMessage message='모든 정보는 30일에 한 번만 변경할 수 있어요' />

        <div className='mt-[2.8rem] flex flex-col gap-[0.8rem]'>
          <h2 className='text-body1-15r'>기본 정보</h2>
          <div className='bg-white-800 overflow-hidden rounded-[16px] border border-gray-200'>
            <ProfileSettingItem
              label='닉네임'
              value='행복한코딩러'
              onClick={() => {}}
            />
          </div>
        </div>

        <div className='mt-[2.4rem] flex flex-col gap-[0.8rem]'>
          <h2 className='text-body1-15r'>프로필 정보</h2>
          <div className='bg-white-800 divide-y divide-gray-200 overflow-hidden rounded-[16px] border border-gray-200'>
            <ProfileSettingItem label='MBTI' value='ESTP' onClick={() => {}} />
            <ProfileSettingItem label='관심 카테고리' onClick={() => {}} />
          </div>
        </div>

        <div className='mt-[2.4rem] flex flex-col gap-[0.8rem]'>
          <h2 className='text-body1-15'>사진 관리</h2>
          <div className='bg-white-800 divide-y divide-gray-200 overflow-hidden rounded-[16px] border border-gray-200'>
            <ProfileSettingItem label='사진 업로드 관리' onClick={() => {}} />
            <ProfileSettingItem label='사진 블러 강도' onClick={() => {}} />
          </div>
        </div>
      </section>

      <BottomNavBar />
    </main>
  );
};
