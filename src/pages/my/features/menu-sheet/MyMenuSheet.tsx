import {BlockedUsersSheet} from '@/pages/my/features/menu-sheet/BlockedUsersSheet';
import {PoliciesSheet} from '@/pages/my/features/menu-sheet/PoliciesSheet';
import {SecessionSheet} from '@/pages/my/features/menu-sheet/SecessionSheet';

type MyMenuSheetType = 'blocked' | 'policies' | 'secession';

interface MyMenuSheetProps {
  type: MyMenuSheetType | null;
  onClose: () => void;
}

export const MyMenuSheet = ({type, onClose}: MyMenuSheetProps) => {
  if (!type) {
    return null;
  }

  const renderContent = () => {
    if (type === 'blocked') {
      return <BlockedUsersSheet onClose={onClose} />;
    }

    if (type === 'policies') {
      return <PoliciesSheet onClose={onClose} />;
    }

    return <SecessionSheet onClose={onClose} />;
  };

  return (
    <section className='bg-background fixed inset-0 z-[60] mx-auto min-h-dvh w-full min-w-[375px] max-w-[430px] px-[2rem]'>
      {renderContent()}
    </section>
  );
};

export type {MyMenuSheetType};
