import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {Chip} from '@/pages/onboarding/components/Chip';
import {ProfileImageCarousel} from '@/pages/profile/components/ProfileImageCarousel';
import {BottomSheet} from '@/shared/components/BottomSheet';
import {Button} from '@/shared/components/Button';
import {Header} from '@/shared/components/Header';
import {IcSvgEtc, IcSvgLeft} from '@/shared/icons';

const MOCK_PROFILE = {
  name: '행복한코딩러',
  birthYear: '00',
  department: '컴퓨터공학과',
  mbti: 'INFP',
  images: ['', '', '', '', ''],
  interests: [
    {
      category: '취미/여가',
      items: ['러닝', '헬스', '등산'],
    },
    {
      category: '음식/카페',
      items: ['러닝', '헬스', '등산'],
    },
    {
      category: '라이프스타일',
      items: ['러닝', '헬스', '등산'],
    },
    {
      category: '성격/분위기',
      items: ['러닝', '헬스', '등산'],
    },
    {
      category: '연애/데이트',
      items: ['러닝', '헬스', '등산'],
    },
    {
      category: '반려/동물',
      items: ['러닝', '헬스', '등산'],
    },
    {
      category: '가치관/관심사',
      items: ['러닝', '헬스', '등산'],
    },
  ],
};

export const ProfilePage = () => {
  const navigate = useNavigate();
  const onboardingCompleted = false;
  const [isOnboardingSheetOpen, setIsOnboardingSheetOpen] = useState(false);

  const handleCloseOnboardingSheet = () => {
    setIsOnboardingSheetOpen(false);
  };

  const handleStartChat = () => {
    if (onboardingCompleted) {
      return;
    }

    setIsOnboardingSheetOpen(true);
  };

  return (
    <section className='min-h-dvh pb-[2rem]'>
      <Header
        title={<span className='text-title-22b text-gray-800'>PROFILE</span>}
        leftItem={<IcSvgLeft className='size-[2.4rem] text-gray-800' />}
        onClickLeft={() => navigate(-1)}
        rightItem={<IcSvgEtc className='size-[3.2rem] text-gray-800' />}
      />

      <div className='mt-[1.6rem]'>
        <h1 className='text-h1-22sb text-gray-800'>{MOCK_PROFILE.name}</h1>
        <p className='text-body1-15r mt-[0.2rem] text-gray-600'>
          {MOCK_PROFILE.birthYear}년생·{MOCK_PROFILE.department}·
          {MOCK_PROFILE.mbti}
        </p>
      </div>

      <div className='mt-[1.6rem]'>
        <ProfileImageCarousel images={MOCK_PROFILE.images} />
      </div>

      <div className='mt-[1.6rem] flex flex-col gap-[1.2rem]'>
        {MOCK_PROFILE.interests.map(({category, items}) => (
          <section key={category} className='flex flex-col gap-[0.8rem]'>
            <h2 className='text-caption2-12sb text-primary'>{category}</h2>

            <div className='flex flex-wrap gap-[0.8rem]'>
              {items.map((item) => (
                <Chip
                  key={`${category}-${item}`}
                  value={item}
                  isStatic
                  className='border-primary text-primary'
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className='mt-[2.8rem]'>
        <Button
          text='채팅 시작하기'
          description='대화가 진전되면 사진이 한 장씩 공개돼요'
          onClick={handleStartChat}
        />
      </div>

      {!onboardingCompleted && (
        <BottomSheet
          open={isOnboardingSheetOpen}
          ariaLabel='온보딩 완료 안내'
          onClose={handleCloseOnboardingSheet}>
          <div className='flex flex-col items-center px-[1.2rem] pb-[3.6rem] text-center'>
            <img src='lock.png' alt='' className='size-[9.2rem]' />
            <h2 className='text-title-18b mb-[0.8rem] whitespace-pre-line text-gray-800'>
              {'온보딩을 완료해야\n'}
              <span className='text-primary'>채팅을 시작할 수 있어요</span>
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
                  onClick={handleCloseOnboardingSheet}
                />
              </div>
              <div className='flex-[1.8]'>
                <Button
                  text='지금 프로필 만들기'
                  className='bg-primary text-button1-14b text-white-800 h-[5.6rem] rounded-[28px] shadow-[0_8px_10px_0_rgba(194,30,86,0.25)]'
                  onClick={() => navigate('/onboarding')}
                />
              </div>
            </div>
          </div>
        </BottomSheet>
      )}
    </section>
  );
};
