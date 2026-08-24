import {Header} from '@/shared/components/Header';
import {IcSvgLeft} from '@/shared/icons';

interface PoliciesSheetProps {
  onClose: () => void;
}

export const PoliciesSheet = ({onClose}: PoliciesSheetProps) => {
  return (
    <section>
      <Header
        title={<h2 className='text-title-18b text-gray-800'>이용약관·정책</h2>}
        leftItem={
          <IcSvgLeft width={24} height={24} className='text-gray-800' />
        }
        onClickLeft={onClose}
      />
    </section>
  );
};
