import {useNavigate} from 'react-router-dom';

import {Chip} from '@/pages/onboarding/components/Chip';
import {ProfileImageCarousel} from '@/pages/profile/components/ProfileImageCarousel';
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
        />
      </div>
    </section>
  );
};
