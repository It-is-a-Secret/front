import {Outlet} from 'react-router-dom';

import {Layout} from '@/app/layout/layout';
import {BottomNavBar} from '@/shared/components/BottomNavBar';

export const BottomNavLayout = () => {
  return (
    <section className='min-h-dvh pb-[10rem]'>
      <Layout>
        <Outlet />
      </Layout>
      <BottomNavBar />
    </section>
  );
};
