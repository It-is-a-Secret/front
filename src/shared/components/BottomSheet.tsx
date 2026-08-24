import type {ReactNode} from 'react';
import {Drawer} from 'vaul';

interface BottomSheetProps {
  open: boolean;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  onClose: () => void;
}

export const BottomSheet = ({
  open,
  children,
  className = '',
  contentClassName = '',
  ariaLabel,
  ariaLabelledBy,
  onClose,
}: BottomSheetProps) => {
  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      onClose();
    }
  };

  return (
    <Drawer.Root open={open} onOpenChange={handleOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className='bg-white-800/50 fixed inset-0 z-[70]' />
        <Drawer.Content
          aria-describedby={undefined}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          className={`border-primary-400 bg-background fixed right-0 bottom-0 left-0 z-[70] mx-auto max-h-[calc(100dvh-2.4rem)] w-full max-w-[35.9rem] overflow-hidden rounded-t-[30px] border-t border-r border-l shadow-[0_-4px_12px_0_rgba(194,30,86,0.12)] outline-none ${className}`}>
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
