import type {ComponentType, SVGProps} from 'react';

import {IcSvgBlock, IcSvgDeclaration, IcSvgExit} from '@/shared/icons';

interface ChatRoomActionMenuProps {
  onReport: () => void;
  onBlock: () => void;
  onLeave: () => void;
}

interface ActionMenuItem {
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  onClick: () => void;
}

export const ChatRoomActionMenu = ({
  onReport,
  onBlock,
  onLeave,
}: ChatRoomActionMenuProps) => {
  const menuItems: ActionMenuItem[] = [
    {
      label: '신고하기',
      Icon: IcSvgDeclaration,
      onClick: onReport,
    },
    {
      label: '차단하기',
      Icon: IcSvgBlock,
      onClick: onBlock,
    },
    {
      label: '채팅방 나가기',
      Icon: IcSvgExit,
      onClick: onLeave,
    },
  ];

  return (
    <div className='border-primary-400 bg-white-800 absolute top-[4.7rem] right-[2rem] z-20 w-[14.7rem] rounded-[8px] border shadow-[0_0_4px_0_rgba(194,30,86,0.55)]'>
      <ul className='divide-y divide-gray-100'>
        {menuItems.map(({label, Icon, onClick}) => (
          <li key={label}>
            <button
              type='button'
              className='text-body1-15r flex h-[4.5rem] w-full items-center gap-[0.8rem] px-[1.6rem] text-gray-800'
              onClick={onClick}>
              <Icon className='size-[1.6rem] text-gray-800' />
              {label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
