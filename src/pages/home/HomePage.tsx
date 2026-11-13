import {useInfiniteQuery} from '@tanstack/react-query';

import {HOME_QUERY_OPTIONS} from '@/pages/home/api/query';
import {Swipe} from '@/pages/home/components/Swipe';
import {EmptyState} from '@/shared/components/EmptyState';
import {Header} from '@/shared/components/Header';

export const HomePage = () => {
  const discoveryQuery = useInfiniteQuery(HOME_QUERY_OPTIONS.DISCOVERY());
  const seenFeedIds = new Set<number>();
  const users = (discoveryQuery.data?.pages ?? [])
    .flatMap((page) => page.data ?? [])
    .flatMap((card) => {
      if (card.feedId === undefined || seenFeedIds.has(card.feedId)) {
        return [];
      }
      seenFeedIds.add(card.feedId);

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
    <main className='flex h-dvh flex-col pb-[12rem]'>
      <Header
        className='shrink-0'
        title={
          <h1 className='text-bold-24 text-gray-800'>
            Blur<span className='text-primary'>Some</span>
          </h1>
        }
      />

      {discoveryQuery.isPending ? (
        <div className='text-body1-15r flex min-h-0 flex-1 items-center justify-center text-gray-600'>
          프로필을 불러오는 중...
        </div>
      ) : discoveryQuery.isError && !hasUsers ? (
        <div className='flex min-h-0 flex-1 items-center justify-center'>
          <EmptyState
            image={<img src='noPeople.png' alt='' />}
            imageClassName='size-[20.7rem]'
            highlightTitle='프로필을 불러오지 못했어요'
            description='잠시 후 다시 확인해 주세요'
          />
        </div>
      ) : hasUsers ? (
        <div className='mt-[2.5rem] min-h-0 flex-1'>
          <Swipe
            users={users}
            hasMore={discoveryQuery.hasNextPage}
            isLoadingMore={discoveryQuery.isFetchingNextPage}
            isLoadMoreError={discoveryQuery.isFetchNextPageError}
            onLoadMore={() => {
              if (!discoveryQuery.isFetching && discoveryQuery.hasNextPage) {
                void discoveryQuery.fetchNextPage();
              }
            }}
          />
          {discoveryQuery.isFetchNextPageError && (
            <p
              role='alert'
              className='text-body1-15r text-center text-gray-600'>
              다음 프로필을 불러오지 못했어요. 다음 버튼으로 다시 시도해 주세요.
            </p>
          )}
        </div>
      ) : (
        <div className='flex min-h-0 flex-1 items-center justify-center'>
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
