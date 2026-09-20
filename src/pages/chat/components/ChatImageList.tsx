import {useEffect, useRef, useState} from 'react';

import {IcSvgLeft} from '@/shared/icons';

export interface ChatPhoto {
  objectKey: string;
  displayOrder: number;
  blurLevel: number;
}

interface ChatImageListProps {
  photos: ChatPhoto[];
}

interface ChatPhotoViewerProps {
  photo: ChatPhoto;
  onClose: () => void;
}

const ChatPhotoViewer = ({photo, onClose}: ChatPhotoViewerProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-label={`프로필 사진 ${photo.displayOrder} 크게 보기`}
      className='fixed inset-0 m-auto h-dvh w-full max-h-none max-w-[430px] bg-gray-800 p-0 backdrop:bg-black/60'
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
        className='absolute top-[1.4rem] left-[2rem] z-10 flex size-[4rem] items-center justify-center text-white-800'>
        <IcSvgLeft className='size-[2.4rem]' />
      </button>

      <div className='flex size-full items-center justify-center'>
        <img
          src={photo.objectKey}
          alt={`공개된 프로필 사진 ${photo.displayOrder}`}
          className='max-h-full w-full object-contain'
        />
      </div>
    </dialog>
  );
};

export const ChatImageList = ({photos}: ChatImageListProps) => {
  const [selectedPhoto, setSelectedPhoto] = useState<ChatPhoto | null>(null);
  const sortedPhotos = [...photos].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );
  const revealedCount = photos.filter((photo) => photo.blurLevel === 0).length;

  return (
    <>
      <section
        className='px-[2rem] pt-[1.2rem]'
        aria-label={`프로필 사진 ${photos.length}장 중 ${revealedCount}장 공개됨`}>
        <ul className='grid grid-cols-5 gap-[0.4rem]'>
          {sortedPhotos.map((photo) => {
            const isRevealed = photo.blurLevel === 0;

            return (
              <li
                key={`${photo.displayOrder}-${photo.objectKey}`}
                className={`aspect-square size-[64px] min-w-0 overflow-hidden rounded-[8px] ${
                  isRevealed
                    ? 'shadow-[0_0_10px_2px_rgba(255,146,183,0.65)]'
                    : ''
                }`}>
                <button
                  type='button'
                  disabled={!isRevealed}
                  aria-haspopup={isRevealed ? 'dialog' : undefined}
                  aria-label={
                    isRevealed
                      ? `프로필 사진 ${photo.displayOrder} 크게 보기`
                      : undefined
                  }
                  onClick={() => setSelectedPhoto(photo)}
                  className='size-full disabled:cursor-default'>
                  <img
                    src={photo.objectKey}
                    alt={
                      isRevealed
                        ? `공개된 프로필 사진 ${photo.displayOrder}`
                        : ''
                    }
                    aria-hidden={!isRevealed}
                    className='size-full object-cover'
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {selectedPhoto && (
        <ChatPhotoViewer
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}
    </>
  );
};
