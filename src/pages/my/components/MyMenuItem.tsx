import type {ComponentType, SVGProps} from 'react';
import * as Switch from '@radix-ui/react-switch';

import {IcSvgRight} from '@/shared/icons';

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

type MyMenuItemProps =
  | {
      type: 'click';
      Icon: IconComponent;
      label: string;
      onClick: () => void;
    }
  | {
      type: 'toggle';
      Icon: IconComponent;
      label: string;
      checked: boolean;
      onCheckedChange: (checked: boolean) => void;
    };

export const MyMenuItem = (props: MyMenuItemProps) => {
  const content = (
    <>
      <div className='flex items-center gap-[0.8rem] rounded-[16px]'>
        <props.Icon className='text-primary size-[2.4rem]' />
        <span className='text-body4-16m'>{props.label}</span>
      </div>

      {props.type === 'toggle' ? (
        <Switch.Root
          checked={props.checked}
          onCheckedChange={props.onCheckedChange}
          className='bg-primary-400 data-[state=checked]:bg-primary-400 border-primary-600 relative h-[2.8rem] w-[5.2rem] rounded-full border transition-colors'>
          <Switch.Thumb className='bg-primary block size-[2.4rem] translate-x-[0.3rem] rounded-full transition-transform data-[state=checked]:translate-x-[2.9rem]' />
        </Switch.Root>
      ) : (
        <IcSvgRight className='size-[2.4rem]' />
      )}
    </>
  );

  if (props.type === 'click') {
    return (
      <button
        type='button'
        onClick={props.onClick}
        className='border-primary-400 bg-white-800 flex h-[6rem] w-full items-center justify-between rounded-[16px] border px-[1.2rem]'>
        {content}
      </button>
    );
  }

  return (
    <div className='border-primary-400 bg-white-800 flex h-[6rem] items-center justify-between rounded-[16px] border px-[1.2rem]'>
      {content}
    </div>
  );
};
