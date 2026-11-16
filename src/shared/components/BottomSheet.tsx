import type {ReactNode} from 'react';
import {Drawer} from 'vaul';

interface BottomSheetProps {
  open: boolean;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  autoFocus?: boolean;
  onOpenAutoFocus?: (event: Event) => void;
  onClose: () => void;
}

export const BottomSheet = ({
  open,
  children,
  className = '',
  contentClassName = '',
  ariaLabel,
  ariaLabelledBy,
  autoFocus = false,
  onOpenAutoFocus,
  onClose,
}: BottomSheetProps) => {
  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      onClose();
    }
  };

  return (
    <Drawer.Root
      open={open}
      autoFocus={autoFocus}
      onOpenChange={handleOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className='bg-white-800/50 fixed inset-0 z-[70]' />
        <Drawer.Content
          onOpenAutoFocus={onOpenAutoFocus}
          aria-describedby={undefined}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          className={`border-primary-400 bg-background fixed right-0 bottom-0 left-0 z-[70] mx-auto max-h-[calc(100dvh-2.4rem)] w-full max-w-[35.9rem] overflow-hidden rounded-t-[30px] border-t border-r border-l shadow-[0_0_4px_0_#C21E56] outline-none ${className}`}>
          <div className='flex shrink-0 justify-center pt-[1.3rem] pb-[2.8rem]'>
            <Drawer.Handle
              className='rounded-full'
              style={{
                width: '4.5rem',
                height: '0.4rem',
                background: 'var(--color-gray-400)',
                opacity: 1,
              }}
            />
          </div>
          <div className={contentClassName}>{children}</div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
