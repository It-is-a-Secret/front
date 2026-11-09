import type {SVGProps} from 'react';

const IcSvgBlock = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 16 16'
    {...props}>
    <g fill='currentColor' clipPath='url(#Property_1=ic_block_svg__a)'>
      <path d='M12 8.8H4V7.2h8z' />
      <path d='M8 .8a7.2 7.2 0 1 1 0 14.4A7.2 7.2 0 0 1 8 .8m0 1.6a5.6 5.6 0 1 0 0 11.2A5.6 5.6 0 0 0 8 2.4' />
    </g>
    <defs>
      <clipPath id='Property_1=ic_block_svg__a'>
        <path fill='currentColor' d='M0 0h16v16H0z' />
      </clipPath>
    </defs>
  </svg>
);
export default IcSvgBlock;
