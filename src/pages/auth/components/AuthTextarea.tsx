import {AUTH_TEXTAREA_CONTENT} from '@/pages/auth/constants/constants';

type AuthTextareaProps =
  | {
      type: 'email';
    }
  | {
      type: 'code';
      email: string;
    };

export const AuthTextarea = (props: AuthTextareaProps) => {
  if (props.type === 'email') {
    const content = AUTH_TEXTAREA_CONTENT.email;

    return (
      <div className='flex flex-col gap-[28px]'>
        <p className='text-h1-22sb whitespace-pre-line text-gray-800'>
          {content.title}
        </p>
        <p className='text-body1-15r text-gray-800'>
          {content.descriptionPrefix}
          <br />
          <strong className='text-body2-15sb'>{content.domain}</strong>
          {content.descriptionSuffix}
        </p>
      </div>
    );
  }

  const content = AUTH_TEXTAREA_CONTENT.code;

  return (
    <div className='flex flex-col gap-[28px]'>
      <p className='text-h1-22sb whitespace-pre-line text-gray-800'>
        {content.title}
      </p>
      <p className='text-body1-15r text-gray-800'>
        {props.email}
        <br />
        {content.descriptionSuffix}
      </p>
    </div>
  );
};
