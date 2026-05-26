import {IcSvgPlus} from '@/shared/icons';

const PHOTO_SLOT_COUNT = 5;
const UPLOADED_PHOTO_COUNT = 0;

export const PhotoUploadStep = () => {
  const photoSlots = Array.from(
    {length: PHOTO_SLOT_COUNT},
    (_, index) => index
  );

  return (
    <div className='mt-[3rem] flex flex-col gap-[2.4rem]'>
      <div className='flex flex-col gap-[1.6rem]'>
        <h1 className='text-h1-22sb whitespace-pre-line'>
          {'사진 5장을\n업로드해 주세요'}
        </h1>

        <p className='text-caption1-12r whitespace-pre-line text-gray-600'>
          {
            '업로드된 사진은 블러 처리되어 저장되며,\n채팅 진행에 따라 업로드 순서대로 한 장씩 공개됩니다'
          }
        </p>
      </div>

      <div className='flex flex-col items-center gap-[1rem]'>
        <div className='grid w-full grid-cols-3 gap-[1rem]'>
          {photoSlots.slice(0, 3).map((slot) => (
            <button
              key={slot}
              type='button'
              className='text-medium-20 bg-white-800 flex aspect-square items-center justify-center rounded-[1.6rem] border border-gray-200 text-gray-400'>
              <IcSvgPlus className='size-[2.4rem]' />
            </button>
          ))}
        </div>

        <div className='grid w-[66%] grid-cols-2 gap-[1rem]'>
          {photoSlots.slice(3).map((slot) => (
            <button
              key={slot}
              type='button'
              className='text-medium-20 bg-white-800 flex aspect-square items-center justify-center rounded-[1.6rem] border border-gray-200 text-gray-400'>
              <IcSvgPlus className='size-[2.4rem]' />
            </button>
          ))}
        </div>
      </div>

      <p className='text-button2-10r mt-[-0.8rem] whitespace-pre-line text-gray-600'>
        {'JPG · PNG · HEIC 지원\n한 장당 최대 3MB까지 업로드할 수 있어요'}
      </p>

      <span className='sr-only'>
        업로드된 사진 {UPLOADED_PHOTO_COUNT}/{PHOTO_SLOT_COUNT}
      </span>
    </div>
  );
};
