import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {NoticeMessage} from '@/pages/my/components/NoticeMessage';
import {ProfileSettingItem} from '@/pages/my/components/ProfileSettingItem';
import {
  ProfileEditSheet,
  type ProfileEditSheetType,
} from '@/pages/my/features/profile-edit-sheet/ProfileEditSheet';
import type {
  BlurStrength,
  MbtiType,
  SelectedInterests,
} from '@/pages/onboarding/constants/constants';
import {BottomNavBar} from '@/shared/components/BottomNavBar';
import {Header} from '@/shared/components/Header';
import {IcSvgLeft} from '@/shared/icons';

export const ProfileEditPage = () => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('행복한코딩러');
  const [mbti, setMbti] = useState<MbtiType>('ESTP');
  const [blurStrength, setBlurStrength] = useState<BlurStrength>(70);
  const [selectedInterests, setSelectedInterests] = useState<SelectedInterests>(
    {
      hobby: ['운동'],
      foodStyle: ['디저트러버'],
      lifeStyle: ['집순이/집돌이', '즉흥'],
      personalityConversation: ['다정함', '센스있음'],
      dateStyle: ['카페데이트', '즉흥데이트'],
      contactRelationship: ['연락자주', '천천히친해짐'],
      pet: ['강아지좋아함', '동물좋아함'],
      valueInterest: ['자기계발', '도전적인'],
    }
  );
  const [photoUrls, setPhotoUrls] = useState<string[]>([
    'profileLogo.png',
    'noPeople.png',
    'complete.png',
    'completeOnboarding.png',
    'blockedUser.png',
  ]);
  const [selectedProfileEditSheet, setSelectedProfileEditSheet] =
    useState<ProfileEditSheetType | null>(null);

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
              value={nickname}
              onClick={() => setSelectedProfileEditSheet('nickname')}
            />
          </div>
        </div>

        <div className='mt-[2.4rem] flex flex-col gap-[0.8rem]'>
          <h2 className='text-body1-15r'>프로필 정보</h2>
          <div className='bg-white-800 divide-y divide-gray-200 overflow-hidden rounded-[16px] border border-gray-200'>
            <ProfileSettingItem
              label='MBTI'
              value={mbti}
              onClick={() => setSelectedProfileEditSheet('mbti')}
            />
            <ProfileSettingItem
              label='관심 카테고리'
              onClick={() => setSelectedProfileEditSheet('interests')}
            />
          </div>
        </div>

        <div className='mt-[2.4rem] flex flex-col gap-[0.8rem]'>
          <h2 className='text-body1-15'>사진 관리</h2>
          <div className='bg-white-800 divide-y divide-gray-200 overflow-hidden rounded-[16px] border border-gray-200'>
            <ProfileSettingItem
              label='사진 업로드 관리'
              onClick={() => setSelectedProfileEditSheet('photoUpload')}
            />
            <ProfileSettingItem
              label='사진 블러 강도'
              value={`${blurStrength}%`}
              onClick={() => setSelectedProfileEditSheet('blurStrength')}
            />
          </div>
        </div>
      </section>

      <BottomNavBar />
      <ProfileEditSheet
        type={selectedProfileEditSheet}
        nickname={nickname}
        mbti={mbti}
        selectedInterests={selectedInterests}
        photoUrls={photoUrls}
        blurStrength={blurStrength}
        onClose={() => setSelectedProfileEditSheet(null)}
        onNicknameChange={setNickname}
        onMbtiChange={setMbti}
        onSelectedInterestsChange={setSelectedInterests}
        onPhotoUrlsChange={setPhotoUrls}
        onBlurStrengthChange={setBlurStrength}
      />
    </main>
  );
};
