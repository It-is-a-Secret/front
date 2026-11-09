import type {SVGProps} from 'react';

const IcSvgHome = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 32 32'
    {...props}>
    <g
      clipPath='url(#Property_1=ic_home_svg__a)'
      filter='url(#Property_1=ic_home_svg__b)'>
      <path
        fill='currentColor'
        d='M5 25.143V12.286q0-.679.306-1.286t.844-1l8.625-6.429A2.78 2.78 0 0 1 16.5 3q.97 0 1.725.571L26.85 10q.54.393.845 1 .306.607.305 1.286v12.857q0 1.179-.845 2.018-.845.84-2.03.839h-4.312q-.612 0-1.024-.411a1.39 1.39 0 0 1-.414-1.018V19.43q0-.607-.414-1.018A1.4 1.4 0 0 0 17.938 18h-2.875q-.612 0-1.024.411a1.39 1.39 0 0 0-.414 1.018v7.142q0 .608-.414 1.019a1.4 1.4 0 0 1-1.024.41H7.876q-1.185 0-2.03-.839A2.75 2.75 0 0 1 5 25.143'
      />
    </g>
    <defs>
      <clipPath id='Property_1=ic_home_svg__a'>
        <path fill='currentColor' d='M0 0h32v32H0z' />
      </clipPath>
      <filter
        id='Property_1=ic_home_svg__b'
        width={31}
        height={33}
        x={1}
        y={3}
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
        <feBlend in2='BackgroundImageFix' result='effect1_dropShadow_189_311' />
        <feBlend
          in='SourceGraphic'
          in2='effect1_dropShadow_189_311'
          result='shape'
        />
      </filter>
    </defs>
  </svg>
);
export default IcSvgHome;
