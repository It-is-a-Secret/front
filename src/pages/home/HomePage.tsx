import {Swipe, type SwipeUser} from '@/pages/home/components/Swipe';
import {Header} from '@/shared/components/Header';
import {IcSvgHumbleiconsHeart} from '@/shared/icons';

const MOCK_USERS: SwipeUser[] = [
  {
    userId: '1',
    name: '행복한코딩러',
    birthYear: '00',
    department: '컴퓨터공학과',
    mbti: 'INFP',
  },
  {
    userId: '2',
    name: '낭만개발자',
    birthYear: '01',
    department: '소프트웨어학과',
    mbti: 'ENFP',
  },
  {
    userId: '3',
    name: '디자인장인',
    birthYear: '99',
    department: '디지털미디어디자인학과',
    mbti: 'ISFJ',
  },
];

export const HomePage = () => {
  return (
    <main className='flex min-h-dvh flex-col'>
      <Header
        title={
          <h1 className='text-bold-24 text-gray-800'>
            Blur<span className='text-primary'>Some</span>
          </h1>
        }
        rightItem={
          <IcSvgHumbleiconsHeart className='size-[3.2rem] text-gray-800' />
        }
      />

      <div className='mt-[2.5rem] h-[calc(100dvh-5.4rem-2.5rem-12rem)]'>
        <Swipe users={MOCK_USERS} />
      </div>
    </main>
  );
};
