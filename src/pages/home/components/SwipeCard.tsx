import {Link} from 'react-router-dom';

interface SwipeCardProps {
  userId: string;
  name: string;
  birthYear: string;
  department: string;
  mbti: string;
  imageUrl?: string;
}

export const SwipeCard = ({
  userId,
  name,
  birthYear,
  department,
  mbti,
  imageUrl,
}: SwipeCardProps) => {
  return (
    <Link
      to={`/profile/${userId}`}
      aria-label={`${name} 프로필 보기`}
      className='bg-white-800 flex h-full w-full max-w-[31.2rem] flex-col overflow-hidden rounded-[3.2rem]'>
      <div className='min-h-0 flex-1 bg-gray-100'>
        {imageUrl && (
          <img
            src={imageUrl}
            alt={`${name} 프로필`}
            className='size-full object-cover'
          />
        )}
      </div>

      <div className='flex min-h-[12.3rem] flex-col justify-center px-[2.4rem]'>
        <h2 className='text-title-22b text-gray-800'>{name}</h2>
        <p className='text-body1-15r mt-[0.4rem] text-gray-600'>
          {birthYear}년생 · {department} · {mbti}
        </p>
      </div>
    </Link>
  );
};
