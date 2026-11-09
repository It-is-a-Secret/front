import type {SVGProps} from 'react';

const IcSvgDeclaration = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 16 16'
    {...props}>
    <path
      fill='currentColor'
      d='m12.357 12.271-9.523-6.73L3.924 4l9.522 6.73z'
    />
    <path
      fill='currentColor'
      d='M8.2 1a7.2 7.2 0 1 1 0 14.4A7.2 7.2 0 0 1 8.2 1m0 1.6a5.6 5.6 0 1 0 0 11.2 5.6 5.6 0 0 0 0-11.2'
    />
  </svg>
);
export default IcSvgDeclaration;
