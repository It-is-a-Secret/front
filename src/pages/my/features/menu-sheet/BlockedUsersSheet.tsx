import {Header} from '@/shared/components/Header';
import {IcSvgLeft} from '@/shared/icons';

interface BlockedUsersSheetProps {
  onClose: () => void;
}

export const BlockedUsersSheet = ({onClose}: BlockedUsersSheetProps) => {
  return (
    <section>
      <Header
        title={<h2 className='text-title-18b text-gray-800'>차단 목록</h2>}
        leftItem={
          <IcSvgLeft width={24} height={24} className='text-gray-800' />
        }
        onClickLeft={onClose}
      />
    </section>
  );
};
