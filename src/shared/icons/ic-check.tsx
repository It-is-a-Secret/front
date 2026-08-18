import type {SVGProps} from 'react';

const IcSvgCheck = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 16 16'
    {...props}>
    <g fill='currentColor' clipPath='url(#Property_1=ic_check_svg__a)'>
      <path d='M6.829 10.876 4 8.046l.943-.942 1.886 1.885 3.77-3.771.944.943z' />
      <path
        fillRule='evenodd'
        d='M.667 8a7.333 7.333 0 1 1 14.667 0A7.333 7.333 0 0 1 .667 8M8 14A6 6 0 1 1 8 2a6 6 0 0 1 0 12'
        clipRule='evenodd'
      />
    </g>
    <defs>
      <clipPath id='Property_1=ic_check_svg__a'>
        <path fill='currentColor' d='M0 0h16v16H0z' />
      </clipPath>
    </defs>
  </svg>
);
export default IcSvgCheck;
