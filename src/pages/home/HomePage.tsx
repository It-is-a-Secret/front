import {Swipe, type SwipeUser} from '@/pages/home/components/Swipe';
import {EmptyState} from '@/shared/components/EmptyState';
import {Header} from '@/shared/components/Header';

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
  {
    userId: '4',
    name: '새벽별',
    birthYear: '03',
    department: '정보전기전자공학과',
    mbti: 'ENTP',
  },
  {
    userId: '5',
    name: '커피좋아',
    birthYear: '02',
    department: '글로벌경영학과',
    mbti: 'ISTJ',
  },
];

export const HomePage = () => {
  const hasUsers = MOCK_USERS.length > 0;

  return (
    <main className='flex min-h-dvh flex-col'>
      <Header
        title={
          <h1 className='text-bold-24 text-gray-800'>
            Blur<span className='text-primary'>Some</span>
          </h1>
        }
      />

      {hasUsers ? (
        <div className='mt-[2.5rem] h-[calc(100dvh-5.4rem-2.5rem-12rem)]'>
          <Swipe users={MOCK_USERS} />
        </div>
      ) : (
        <div className='flex flex-1 items-center justify-center pb-[12rem]'>
          <EmptyState
            image={<img src='noPeople.png' alt='' />}
            imageClassName='size-[20.7rem]'
            highlightTitle='아직 사용중인 사용자가 없어요'
            description='잠시 후 다시 확인해 주세요'
          />
        </div>
      )}
    </main>
  );
};
