import type {ChatRoomSummary} from '@/pages/chat/api/type';
import {ChatImageList} from '@/pages/chat/components/ChatImageList';
import {PhotoRevealEvent} from '@/pages/chat/components/PhotoRevealEvent';
import {useChatPhotos} from '@/pages/chat/hooks/useChatPhotos';

interface ChatPhotoSectionProps {
  roomId: number;
  memberId: number;
  roomStatus: ChatRoomSummary['roomStatus'];
  progressStatus: ChatRoomSummary['progressStatus'];
  partnerNickname: string;
}

export const ChatPhotoSection = (props: ChatPhotoSectionProps) => {
  const {photos, currentReveal, imagesQuery, unavailable, closeReveal} =
    useChatPhotos(props);
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
          refreshKey={imagesQuery.dataUpdatedAt}
          onRefresh={refresh}
          isRefreshing={imagesQuery.isFetching}
        />
      )}
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
        />
      )}
    </>
  );
};
