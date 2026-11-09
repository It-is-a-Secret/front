import {IcSvgRight} from '@/shared/icons';

interface ProfileSettingItemProps {
  label: string;
  value?: string;
  onClick: () => void;
}

export const ProfileSettingItem = ({
  label,
  value,
  onClick,
}: ProfileSettingItemProps) => {
  return (
    <button
      type='button'
      className='flex w-full items-center justify-between p-[1.6rem]'
      onClick={onClick}>
      <span className='text-body2-15sb'>{label}</span>
      <span className='flex items-center text-gray-600'>
        {value && <span className='text-body1-15r'>{value}</span>}
        <IcSvgRight className='size-[2.4rem]' />
      </span>
    </button>
  );
};
