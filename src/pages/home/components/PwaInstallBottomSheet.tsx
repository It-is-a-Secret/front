import type {PwaPlatform} from '@/pages/home/model/pwa-install-prompt';
import {BottomSheet} from '@/shared/components/BottomSheet';
import {Button} from '@/shared/components/Button';

interface PwaInstallBottomSheetProps {
  open: boolean;
  platform: PwaPlatform;
  onClose: () => void;
  onOpenAutoFocus?: (event: Event) => void;
}

export const PwaInstallBottomSheet = ({
  open,
  platform,
  onClose,
  onOpenAutoFocus,
}: PwaInstallBottomSheetProps) => {
  if (platform === 'unknown') return null;

  return (
    <BottomSheet
      open={open}
      autoFocus
      onClose={onClose}
      onOpenAutoFocus={onOpenAutoFocus}
      ariaLabelledBy='pwa-install-title'>
      <div className='flex flex-col items-center px-[2rem] pt-[0.4rem] pb-[calc(1.6rem+env(safe-area-inset-bottom))]'>
        <img
          src='/pwa-install-icon-white.png'
          alt=''
          width={64}
          height={64}
          className='size-[6.4rem] rounded-[1.6rem] bg-[#fff]'
        />
        <h2
          id='pwa-install-title'
          className='text-bold-18 mt-[1.6rem] text-center text-gray-800'>
          {platform === 'desktop' ? '모바일로' : '홈 화면에'} BlurSome을
          추가하고
          <br />
          편리하게 사용해 보세요
        </h2>
        <div className='mt-[2rem] w-full'>
          <Button text='설치하기' />
        </div>
        <button
          type='button'
          onClick={onClose}
          className='text-body1-15r mt-[0.8rem] min-h-[4.4rem] px-[1.6rem] text-gray-600'>
          나중에 할게요
        </button>
      </div>
    </BottomSheet>
  );
};
