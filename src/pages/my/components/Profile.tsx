interface ProfileProps {
  nickname: string;
  birthYear: string;
  gender: string;
  department: string;
}

export const Profile = ({
  nickname,
  birthYear,
  gender,
  department,
}: ProfileProps) => {
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
        <span className='text-title-18b'>{nickname}</span>
        <span className='text-body1-15r text-gray-600'>{`${birthYear}년생(${gender})·${department}`}</span>
      </div>
    </div>
  );
};
