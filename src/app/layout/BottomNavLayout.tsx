import {Outlet} from 'react-router-dom';

import {BottomNavBar} from '@/shared/components/BottomNavBar';

export const BottomNavLayout = () => {
  return (
    <section className='min-h-dvh pb-[10.4rem]'>
      <Outlet />
      <BottomNavBar />
    </section>
  );
};
