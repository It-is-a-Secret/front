import type {SVGProps} from 'react';

const IcSvgImage = (props: SVGProps<SVGSVGElement>) => (
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
      d='M13 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1'
    />
    <path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.333}
      d='M7.178 7.178a1.667 1.667 0 1 1-2.357-2.357 1.667 1.667 0 0 1 2.357 2.357M9.504 8.54a.7.7 0 0 0-.24.2L5.333 14h7.389a.667.667 0 0 0 .546-1.048l-2.925-4.194a.67.67 0 0 0-.84-.218'
    />
  </svg>
);
export default IcSvgImage;
