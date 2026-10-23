import type {ChatRoomSummary} from '@/pages/chat/api/type';
import {ChatImageList} from '@/pages/chat/components/ChatImageList';
import {PhotoRevealEvent} from '@/pages/chat/components/PhotoRevealEvent';
import {useChatPhotos} from '@/pages/chat/hooks/useChatPhotos';
import {Button} from '@/shared/components/Button';

interface ChatPhotoSectionProps {
  roomId: number;
  memberId: number;
  roomStatus: ChatRoomSummary['roomStatus'];
  progressStatus: ChatRoomSummary['progressStatus'];
  partnerNickname: string;
}

export const ChatPhotoSection = (props: ChatPhotoSectionProps) => {
  const {
    photos,
    currentReveal,
    imagesQuery,
    unavailable,
    hasImageError,
    reportImageError,
    closeReveal,
  } = useChatPhotos(props);
  const refresh = () => {
    void imagesQuery.refetch();
  };

  if (props.roomStatus !== 'ACTIVE' || unavailable) {
    return (
      <p className='text-caption2-12sb px-[2rem] py-[1.6rem] text-center text-gray-600'>
        현재 이 대화에서는 사진을 볼 수 없어요.
      </p>
    );
  }
  if (imagesQuery.isPending) {
    return (
      <p
        role='status'
        className='text-caption2-12sb px-[2rem] py-[1.6rem] text-center text-gray-600'>
        사진을 불러오고 있어요.
      </p>
    );
  }

  return (
    <>
      {photos.length > 0 && (
        <ChatImageList
          photos={photos}
          onImageError={reportImageError}
          refreshKey={imagesQuery.dataUpdatedAt}
          onRefresh={refresh}
          isRefreshing={imagesQuery.isFetching}
        />
      )}
      {imagesQuery.isError || hasImageError ? (
        <div className='flex flex-col items-center gap-[1.2rem] px-[2rem] py-[1.6rem]'>
          <p role='alert' className='text-caption2-12sb text-gray-600'>
            사진을 불러오지 못했어요.
          </p>
          <div className='w-full max-w-[28rem] [&>div]:h-[5.2rem]'>
            <Button
              text={imagesQuery.isFetching ? '확인 중...' : '다시 시도'}
              disabled={imagesQuery.isFetching}
              onClick={refresh}
            />
          </div>
        </div>
      ) : photos.length === 0 ? (
        <p className='text-caption2-12sb px-[2rem] py-[1.6rem] text-center text-gray-600'>
          아직 표시할 상대방 사진이 없어요.
        </p>
      ) : null}
      {currentReveal && (
        <PhotoRevealEvent
          key={`${currentReveal.displayOrder}-${currentReveal.imageUrl}-${imagesQuery.dataUpdatedAt}`}
          imageUrl={currentReveal.imageUrl}
          displayOrder={currentReveal.displayOrder}
          totalCount={5}
          partnerNickname={props.partnerNickname}
          onClose={closeReveal}
          onRefresh={refresh}
          isRefreshing={imagesQuery.isFetching}
          onImageError={reportImageError}
        />
      )}
    </>
  );
};
