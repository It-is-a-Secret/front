interface SystemMessageProps {
  message?: string;
  displayOrder?: number;
}

export const SystemMessage = ({message, displayOrder}: SystemMessageProps) => {
  const content = message ?? `${displayOrder}번째 사진이 공개되었습니다`;

  return (
    <li className='w-full px-[3.4rem]'>
      <span className='text-primary text-body3-14m flex items-center justify-center rounded-[8px] border border-dashed py-[0.8rem]'>
        {content}
      </span>
    </li>
  );
};
