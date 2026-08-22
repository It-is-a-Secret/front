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

  if (type === 'blocked') {
    return <BlockedUsersSheet onClose={onClose} />;
  }

  if (type === 'policies') {
    return <PoliciesSheet onClose={onClose} />;
  }

  return <SecessionSheet onClose={onClose} />;
};

export type {MyMenuSheetType};
