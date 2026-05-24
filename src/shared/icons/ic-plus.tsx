import type {SVGProps} from 'react';

const IcSvgPlus = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    {...props}>
    <path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M5 12h7m0 0h7m-7 0V5m0 7v7'
    />
  </svg>
);
export default IcSvgPlus;
