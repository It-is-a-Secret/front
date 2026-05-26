import {Link, useLocation} from 'react-router-dom';

import {
  IcSvgChat,
  IcSvgChat2,
  IcSvgHome,
  IcSvgHome2,
  IcSvgMy,
  IcSvgMy2,
} from '@/shared/icons';

const NAV_ITEMS = [
  {
    label: '채팅',
    path: '/chat',
    activeIcon: IcSvgChat,
    inactiveIcon: IcSvgChat2,
  },
  {
    label: '홈',
    path: '/home',
    activeIcon: IcSvgHome,
    inactiveIcon: IcSvgHome2,
  },
  {
    label: '마이',
    path: '/my',
    activeIcon: IcSvgMy,
    inactiveIcon: IcSvgMy2,
  },
] as const;

export const BottomNavBar = () => {
  const {pathname} = useLocation();

  return (
    <nav
      aria-label='하단 내비게이션'
      className='border-white-800/60 bg-white-800/45 fixed bottom-[3.8rem] left-1/2 z-50 flex h-[7.2rem] w-[calc(100%-4rem)] max-w-[39rem] -translate-x-1/2 items-center justify-around rounded-[32px] border shadow-[0_4px_20px_0_rgba(255,146,183,0.20)] backdrop-blur-[15px]'>
      {NAV_ITEMS.map(
        ({label, path, activeIcon: ActiveIcon, inactiveIcon: InactiveIcon}) => {
          const isActive = pathname === path || pathname.startsWith(`${path}/`);
          const Icon = isActive ? ActiveIcon : InactiveIcon;

          return (
            <Link
              key={path}
              to={path}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
              className={`flex size-[3.2rem] items-center justify-center ${
                isActive ? 'text-primary' : 'text-[#FFD2D2]'
              }`}>
              <Icon className='size-[3.2rem]' />
            </Link>
          );
        }
      )}
    </nav>
  );
};
