import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {isHTTPError} from 'ky';
import {useRef, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';

import {Chip} from '@/pages/onboarding/components/Chip';
import {HOME_MUTATION_OPTIONS} from '@/pages/home/api/query';
import {refreshChatRooms} from '@/pages/chat/utils/refresh-chat-rooms';
import type {GetDiscoveryDetailResponse} from '@/pages/profile/api/type';
import {PROFILE_QUERY_OPTIONS} from '@/pages/profile/api/query';
import {ProfileImageCarousel} from '@/pages/profile/components/ProfileImageCarousel';
import {BottomSheet} from '@/shared/components/BottomSheet';
import {Button} from '@/shared/components/Button';
import {Header} from '@/shared/components/Header';
import {IcSvgEtc, IcSvgLeft} from '@/shared/icons';
import {QUERY_KEYS} from '@/shared/api';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isStartingChatRef = useRef(false);
  const {userId} = useParams<{userId: string}>();
  const feedId = Number(userId);
  const isValidFeedId = Number.isSafeInteger(feedId) && feedId > 0;
  const detailQuery = useQuery(PROFILE_QUERY_OPTIONS.DETAIL(feedId));
  const imagesQuery = useQuery(PROFILE_QUERY_OPTIONS.IMAGES(feedId));
  const profile = detailQuery.data?.data;
  const detailStatus = isHTTPError(detailQuery.error)
    ? detailQuery.error.response.status
    : undefined;
  const onboardingCompleted = detailStatus !== 403;
  const images = [...(imagesQuery.data?.data?.images ?? [])]
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
    .flatMap(({variantUrl}) => (variantUrl ? [variantUrl] : []));
  const interests = new Map<
    string,
    NonNullable<NonNullable<GetDiscoveryDetailResponse['data']>['keywords']>
  >();
  for (const keyword of profile?.keywords ?? []) {
    const category = keyword.categoryCode ?? keyword.categoryName ?? '';
    const items = interests.get(category) ?? [];
    items.push(keyword);
    interests.set(category, items);
  }
  const [isOnboardingSheetOpen, setIsOnboardingSheetOpen] = useState(false);
  const startChatMutation = useMutation({
    ...HOME_MUTATION_OPTIONS.START_CHAT(),
    onSuccess: (response) => {
      const roomId = response.data.roomId;
      void refreshChatRooms(queryClient);
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.chat.room(roomId),
      });
      navigate(`/chat/${roomId}`);
    },
    onError: (error) => {
      if (isHTTPError(error) && error.response.status === 403) {
        setIsOnboardingSheetOpen(true);
      }
    },
    onSettled: () => {
      isStartingChatRef.current = false;
    },
  });
  const startChatErrorStatus = isHTTPError(startChatMutation.error)
    ? startChatMutation.error.response.status
    : undefined;
  const startChatErrorMessage = !startChatMutation.isError
    ? null
    : startChatErrorStatus === 403
      ? '온보딩을 완료해야 채팅을 시작할 수 있어요.'
      : startChatErrorStatus === 404
        ? '상대방 프로필을 찾을 수 없어요.'
        : startChatErrorStatus === 409
          ? '현재 이 상대와 채팅을 시작할 수 없어요.'
          : startChatErrorStatus === 400
            ? '채팅 요청 정보를 확인해 주세요.'
            : '채팅을 시작하지 못했어요. 잠시 후 다시 시도해 주세요.';

  const handleCloseOnboardingSheet = () => {
    setIsOnboardingSheetOpen(false);
  };

  const handleStartChat = () => {
    if (!onboardingCompleted) {
      setIsOnboardingSheetOpen(true);
      return;
    }

    if (!isValidFeedId || !profile || isStartingChatRef.current) return;
    isStartingChatRef.current = true;
    startChatMutation.mutate({feedId, body: {}});
  };

  return (
    <section className='min-h-dvh pb-[2rem]'>
      <Header
        title={<span className='text-title-22b text-gray-800'>PROFILE</span>}
        leftItem={<IcSvgLeft className='size-[2.4rem] text-gray-800' />}
        onClickLeft={() => navigate(-1)}
        rightItem={<IcSvgEtc className='size-[3.2rem] text-gray-800' />}
      />

      {!isValidFeedId || detailQuery.isError ? (
        <div
          role='alert'
          className='mt-[4rem] flex flex-col gap-[2rem] text-center'>
          <p className='text-body1-15r text-gray-600'>
            {detailStatus === 403
              ? '온보딩을 완료해야 프로필을 볼 수 있어요'
              : !isValidFeedId || detailStatus === 404
                ? '프로필을 찾을 수 없어요'
                : '프로필을 불러오지 못했어요'}
          </p>
          {detailStatus === 403 ? (
            <Button text='프로필 만들기 안내' onClick={handleStartChat} />
          ) : isValidFeedId && detailStatus !== 404 ? (
            <Button
              text='다시 시도'
              onClick={() => void detailQuery.refetch()}
            />
          ) : null}
        </div>
      ) : detailQuery.isPending ? (
        <p
          role='status'
          className='text-body1-15r mt-[4rem] text-center text-gray-600'>
          프로필을 불러오는 중...
        </p>
      ) : profile ? (
        <>
          <div className='mt-[1.6rem]'>
            <h1 className='text-h1-22sb text-gray-800'>{profile.nickName}</h1>
            <p className='text-body1-15r mt-[0.2rem] text-gray-600'>
              {[
                profile.birthYear !== undefined
                  ? `${String(profile.birthYear).slice(-2)}년생`
                  : undefined,
                profile.departmentLabel ?? profile.department,
                profile.mbti,
              ]
                .filter(Boolean)
                .join('·')}
            </p>
          </div>

          <div className='mt-[1.6rem]'>
            {imagesQuery.isPending ? (
              <p
                role='status'
                className='text-body1-15r text-center text-gray-600'>
                사진을 불러오는 중...
              </p>
            ) : imagesQuery.isError ? (
              <div role='alert' className='flex flex-col gap-[1.2rem]'>
                <p className='text-body1-15r text-center text-gray-600'>
                  사진을 불러오지 못했어요
                </p>
                <Button
                  text='사진 다시 불러오기'
                  onClick={() => void imagesQuery.refetch()}
                />
              </div>
            ) : (
              <ProfileImageCarousel
                key={`${feedId}-${images.join('|')}`}
                images={images}
              />
            )}
          </div>

          <div className='mt-[1.6rem] flex flex-col gap-[1.2rem]'>
            {Array.from(interests, ([category, keywords]) => (
              <section key={category} className='flex flex-col gap-[0.8rem]'>
                <h2 className='text-body2-15sb text-primary'>
                  {keywords[0]?.categoryName ?? category}
                </h2>
                <div className='flex flex-wrap gap-[0.8rem]'>
                  {keywords.map((keyword) => (
                    <Chip
                      key={keyword.tagId ?? keyword.tagCode ?? keyword.tagName}
                      value={keyword.tagName ?? keyword.tagCode ?? ''}
                      variant='outline'
                      isStatic
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className='mt-[2.8rem]'>
            {startChatErrorMessage && (
              <p role='alert' className='text-body3-14m text-error mb-[1.2rem]'>
                {startChatErrorMessage}
              </p>
            )}
            <Button
              text={
                startChatMutation.isPending
                  ? '채팅 연결 중...'
                  : '채팅 시작하기'
              }
              description='대화가 진전되면 사진이 한 장씩 공개돼요'
              disabled={startChatMutation.isPending}
              onClick={handleStartChat}
            />
          </div>
        </>
      ) : null}

      <BottomSheet
        open={isOnboardingSheetOpen}
        ariaLabel='온보딩 완료 안내'
        onClose={handleCloseOnboardingSheet}>
        <div className='flex flex-col items-center px-[1.2rem] pb-[3.6rem] text-center'>
          <img src='/lock.png' alt='' className='size-[9.2rem]' />
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
    </section>
  );
};
