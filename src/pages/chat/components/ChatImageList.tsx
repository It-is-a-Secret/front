import {useEffect, useRef, useState} from 'react';

import type {RevealedImage} from '@/pages/chat/api/type';
import {Button} from '@/shared/components/Button';
import {IcSvgLeft} from '@/shared/icons';

interface ChatImageListProps {
  photos: RevealedImage[];
  refreshKey: number;
  onImageError: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const ChatPhotoThumbnail = ({
  photo,
  onImageError,
}: {
  photo: RevealedImage;
  onImageError: () => void;
}) => {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <span className='text-button2-10r flex size-full items-center justify-center bg-gray-100 text-gray-600'>
      사진 없음
    </span>
  ) : (
    <img
      src={photo.imageUrl}
      alt={
        photo.revealed
          ? `공개된 프로필 사진 ${photo.displayOrder}`
          : `아직 공개되지 않은 프로필 사진 ${photo.displayOrder}`
      }
      className='size-full object-cover'
      onError={() => {
        setFailed(true);
        onImageError();
      }}
    />
  );
};

const ChatPhotoViewer = ({
  photo,
  onClose,
  onImageError,
  onRefresh,
  isRefreshing,
}: {
  photo: RevealedImage;
  onClose: () => void;
  onImageError: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-label={`프로필 사진 ${photo.displayOrder} 크게 보기`}
      className='fixed inset-0 m-auto h-dvh max-h-none w-full max-w-[430px] bg-gray-800 p-0 backdrop:bg-black/60'
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={onClose}>
      <button
        type='button'
        autoFocus
        aria-label='사진 닫기'
        onClick={onClose}
        className='text-white-800 absolute top-[1.4rem] left-[2rem] z-10 flex size-[4rem] items-center justify-center'>
        <IcSvgLeft className='size-[2.4rem]' />
      </button>
      <div className='flex size-full items-center justify-center'>
        {failed ? (
          <div className='flex w-full max-w-[28rem] flex-col items-center gap-[1.6rem] px-[2rem]'>
            <p role='alert' className='text-body1-15r text-white-800'>
              사진을 불러오지 못했어요.
            </p>
            <div className='w-full [&>div]:h-[5.2rem]'>
              <Button
                text={isRefreshing ? '확인 중...' : '다시 시도'}
                disabled={isRefreshing}
                onClick={onRefresh}
              />
            </div>
          </div>
        ) : (
          <img
            src={photo.imageUrl}
            alt={`공개된 프로필 사진 ${photo.displayOrder}`}
            className='max-h-full w-full object-contain'
            onError={() => {
              setFailed(true);
              onImageError();
            }}
          />
        )}
      </div>
    </dialog>
  );
};

export const ChatImageList = ({
  photos,
  refreshKey,
  onImageError,
  onRefresh,
  isRefreshing,
}: ChatImageListProps) => {
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
  const sortedPhotos = [...photos].sort(
    (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
  );
  const revealedCount = photos.filter(
    (photo) => photo.revealed === true
  ).length;
  const selectedPhoto = photos.find(
    (photo) => photo.displayOrder === selectedOrder && photo.revealed === true
  );

  return (
    <>
      <section
        className='px-[2rem] pt-[1.2rem]'
        aria-label={`프로필 사진 ${photos.length}장 중 ${revealedCount}장 공개됨`}>
        <ul className='grid grid-cols-5 gap-[0.4rem]'>
          {sortedPhotos.map((photo) => (
            <li
              key={photo.displayOrder}
              className={`aspect-square min-w-0 overflow-hidden rounded-[8px] ${photo.revealed ? 'shadow-[0_0_10px_2px_rgba(255,146,183,0.65)]' : ''}`}>
              <button
                type='button'
                disabled={!photo.revealed}
                aria-haspopup={photo.revealed ? 'dialog' : undefined}
                aria-label={
                  photo.revealed
                    ? `프로필 사진 ${photo.displayOrder} 크게 보기`
                    : `프로필 사진 ${photo.displayOrder} 미공개`
                }
                onClick={() => setSelectedOrder(photo.displayOrder ?? null)}
                className='size-full disabled:cursor-default'>
                <ChatPhotoThumbnail
                  key={`${photo.imageUrl}-${refreshKey}`}
                  photo={photo}
                  onImageError={onImageError}
                />
              </button>
            </li>
          ))}
        </ul>
      </section>
      {selectedPhoto && (
        <ChatPhotoViewer
          key={`${selectedPhoto.displayOrder}-${selectedPhoto.imageUrl}-${refreshKey}`}
          photo={selectedPhoto}
          onClose={() => setSelectedOrder(null)}
          onImageError={onImageError}
          onRefresh={onRefresh}
          isRefreshing={isRefreshing}
        />
      )}
    </>
  );
};
