import type {SVGProps} from 'react';

const IcSvgBell = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 16 16'
    {...props}>
    <path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.333}
      d='M10 12.667a2 2 0 0 1-4 0m2.48-9.332-.977-.002c-2.229-.005-4.164 1.806-4.18 4V9.86c0 .527-.066 1.04-.354 1.479l-.19.292c-.292.442.021 1.036.544 1.036h9.354c.523 0 .836-.594.545-1.036l-.191-.292c-.287-.438-.354-.953-.354-1.48V7.334C12.65 5.139 10.71 3.34 8.48 3.335'
    />
    <path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.333}
      d='M8 1.333a1.333 1.333 0 0 1 1.333 1.334v.666H6.667v-.666A1.333 1.333 0 0 1 8 1.333'
    />
  </svg>
);
export default IcSvgBell;
