import {useEffect, useRef, useState} from 'react';
import {Button} from '@/shared/components/Button';

interface PhotoRevealEventProps {
  imageUrl: string;
  displayOrder: number;
  totalCount: number;
  partnerNickname: string;
  onClose: (viewed: boolean) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onImageError: () => void;
}

const KOREAN_ORDINALS = ['첫', '두', '세', '네', '다섯'];

const getOrdinal = (displayOrder: number) =>
  KOREAN_ORDINALS[displayOrder - 1] ?? `${displayOrder}`;

export const PhotoRevealEvent = ({
  imageUrl,
  displayOrder,
  totalCount,
  partnerNickname,
  onClose,
  onRefresh,
  isRefreshing,
  onImageError,
}: PhotoRevealEventProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const ordinal = getOrdinal(displayOrder);
  const [imageStatus, setImageStatus] = useState<
    'loading' | 'loaded' | 'error'
  >('loading');
  const close = () => onClose(imageStatus === 'loaded');

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby='photo-reveal-title'
      className='bg-primary-200 fixed inset-0 m-auto h-dvh max-h-none w-full max-w-[430px] p-0 backdrop:bg-black/60'
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClose={close}>
      <div className='relative flex size-full flex-col items-center overflow-hidden px-[2.4rem] pt-[6rem] pb-[2.4rem] text-center'>
        <header className='relative z-10 flex shrink-0 flex-col items-center'>
          <span className='bg-primary text-body4-16m text-white-800 rounded-full px-[1.6rem] py-[0.8rem]'>
            REVEAL EVENT
          </span>
          <h1
            id='photo-reveal-title'
            className='mt-[2.4rem] text-[2.8rem] leading-[1.35] font-bold text-gray-800'>
            <span className='text-primary'>{ordinal} 번째 사진</span>이
            <br />
            공개되었어요!
          </h1>
        </header>

        <div className='relative z-10 mt-[2rem] h-[clamp(28rem,46dvh,40rem)] w-full max-w-[26.0rem] shrink rounded-[30px] shadow-[0_0_12px_2px_rgba(255,146,183,0.55)]'>
          {imageStatus === 'error' ? (
            <div className='flex size-full flex-col items-center justify-center gap-[1.6rem] px-[1.6rem]'>
              <p role='alert' className='text-body1-15r text-gray-600'>
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
              src={imageUrl}
              alt={`${partnerNickname}님의 ${displayOrder}번째 공개 사진`}
              className='size-full rounded-[30px] object-cover'
              onLoad={() => setImageStatus('loaded')}
              onError={() => {
                setImageStatus('error');
                onImageError();
              }}
            />
          )}
          {imageStatus === 'loading' && (
            <p
              role='status'
              className='text-caption2-12sb absolute inset-0 flex items-center justify-center text-gray-600'>
              사진을 불러오고 있어요.
            </p>
          )}
          <span className='bg-primary text-caption1-12r text-white-800 absolute top-[2rem] left-[2rem] rounded-full px-[0.8rem] py-[0.4rem]'>
            {displayOrder}/{totalCount}
          </span>
        </div>

        <p className='text-body1-15r relative z-10 mt-[1rem] shrink-0 text-gray-600'>
          서로의 {ordinal} 번째 사진이 공개됐어요
          <br />
          {partnerNickname}님의 사진을 확인해 보세요
        </p>

        <button
          type='button'
          autoFocus
          onClick={close}
          className='bg-primary text-button1-14b text-white-800 relative z-10 mt-auto h-[5.6rem] w-full shrink-0 rounded-full shadow-[0_8px_10px_0_rgba(194,30,86,0.25)]'>
          대화로 돌아가기
        </button>
      </div>
    </dialog>
  );
};
