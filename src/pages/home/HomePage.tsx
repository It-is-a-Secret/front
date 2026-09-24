import {useQuery} from '@tanstack/react-query';

import {HOME_QUERY_OPTIONS} from '@/pages/home/api/query';
import {Swipe} from '@/pages/home/components/Swipe';
import {EmptyState} from '@/shared/components/EmptyState';
import {Header} from '@/shared/components/Header';

export const HomePage = () => {
  const discoveryQuery = useQuery(HOME_QUERY_OPTIONS.DISCOVERY());
  const users = (discoveryQuery.data?.data ?? []).flatMap((card) => {
    if (card.feedId === undefined) {
      return [];
    }

    return [
      {
        userId: String(card.feedId),
        name: card.nickName ?? '',
        birthYear: String(card.birthYear ?? '').slice(-2),
        department: card.departmentLabel ?? card.department ?? '',
        mbti: card.mbti ?? '',
      },
    ];
  });
  const hasUsers = users.length > 0;

  return (
    <main className='flex min-h-dvh flex-col'>
      <Header
        title={
          <h1 className='text-bold-24 text-gray-800'>
            Blur<span className='text-primary'>Some</span>
          </h1>
        }
      />

      {discoveryQuery.isPending ? (
        <div className='text-body1-15r flex flex-1 items-center justify-center pb-[12rem] text-gray-600'>
          프로필을 불러오는 중...
        </div>
      ) : discoveryQuery.isError ? (
        <div className='flex flex-1 items-center justify-center pb-[12rem]'>
          <EmptyState
            image={<img src='noPeople.png' alt='' />}
            imageClassName='size-[20.7rem]'
            highlightTitle='프로필을 불러오지 못했어요'
            description='잠시 후 다시 확인해 주세요'
          />
        </div>
      ) : hasUsers ? (
        <div className='mt-[2.5rem] h-[calc(100dvh-5.4rem-2.5rem-12rem)]'>
          <Swipe users={users} />
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
