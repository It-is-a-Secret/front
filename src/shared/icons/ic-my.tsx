import type {SVGProps} from 'react';

const IcSvgMy = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 32 32'
    {...props}>
    <g
      clipPath='url(#Property_1=ic_my_svg__a)'
      filter='url(#Property_1=ic_my_svg__b)'>
      <path
        fill='currentColor'
        fillRule='evenodd'
        d='M10.667 9.333a5.333 5.333 0 1 1 10.666 0 5.333 5.333 0 0 1-10.666 0m0 8A6.667 6.667 0 0 0 4 24a4 4 0 0 0 4 4h16a4 4 0 0 0 4-4 6.667 6.667 0 0 0-6.667-6.667z'
        clipRule='evenodd'
      />
    </g>
    <defs>
      <clipPath id='Property_1=ic_my_svg__a'>
        <path fill='currentColor' d='M0 0h32v32H0z' />
      </clipPath>
      <filter
        id='Property_1=ic_my_svg__b'
        width={32}
        height={32}
        x={0}
        y={4}
        colorInterpolationFilters='sRGB'
        filterUnits='userSpaceOnUse'>
        <feFlood floodOpacity={0} result='BackgroundImageFix' />
        <feColorMatrix
          in='SourceAlpha'
          result='hardAlpha'
          values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
        />
        <feOffset dy={4} />
        <feGaussianBlur stdDeviation={2} />
        <feComposite in2='hardAlpha' operator='out' />
        <feColorMatrix values='0 0 0 0 0.760784 0 0 0 0 0.117647 0 0 0 0 0.337255 0 0 0 0.5 0' />
        <feBlend in2='BackgroundImageFix' result='effect1_dropShadow_189_309' />
        <feBlend
          in='SourceGraphic'
          in2='effect1_dropShadow_189_309'
          result='shape'
        />
      </filter>
    </defs>
  </svg>
);
export default IcSvgMy;
