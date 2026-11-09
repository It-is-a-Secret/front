import type {SVGProps} from 'react';

const IcSvgX = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 8 8'
    {...props}>
    <path
      fill='currentColor'
      fillRule='evenodd'
      d='M7.723.683a.4.4 0 0 0-.566-.566L3.92 3.354.683.117a.4.4 0 0 0-.566.566L3.354 3.92.117 7.157a.4.4 0 0 0 .566.566L3.92 4.486l3.237 3.237a.4.4 0 0 0 .566-.566L4.486 3.92z'
      clipRule='evenodd'
    />
  </svg>
);
export default IcSvgX;
