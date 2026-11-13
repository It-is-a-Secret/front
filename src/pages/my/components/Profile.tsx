import type {MemberProfile} from '@/pages/my/api/type';
import {getMyProfileDescription} from '@/pages/my/model/my-profile';

interface ProfileProps {
  profile: MemberProfile;
}

export const Profile = ({profile}: ProfileProps) => {
  const description = getMyProfileDescription(profile);

  return (
    <div className='flex gap-[0.8rem]'>
      <div className='border-primary-400 bg-white-800 flex size-[6.4rem] items-center justify-center rounded-full border'>
        <img
          src='/profileLogo.png'
          alt=''
          className='size-[4.8rem] object-cover'
        />
      </div>
      <div className='flex flex-col justify-center'>
        <span className='text-title-18b'>
          {profile.nickName?.trim() || '닉네임 미설정'}
        </span>
        {description && (
          <span className='text-body1-15r text-gray-600'>{description}</span>
        )}
      </div>
    </div>
  );
};
