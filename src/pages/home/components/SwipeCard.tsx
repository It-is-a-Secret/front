import {Link} from 'react-router-dom';
import {useQuery} from '@tanstack/react-query';
import {PROFILE_QUERY_OPTIONS} from '@/pages/profile/api/query';

interface SwipeCardProps {
  userId: string;
  name: string;
  birthYear: string;
  department: string;
  mbti: string;
  imageUrl?: string;
  isActive?: boolean;
}

export const SwipeCard = ({
  userId,
  name,
  birthYear,
  department,
  mbti,
  imageUrl,
  isActive = true,
}: SwipeCardProps) => {
  const feedId = Number(userId);
  const imagesQuery = useQuery({
    ...PROFILE_QUERY_OPTIONS.IMAGES(feedId),
    enabled:
      isActive && !imageUrl && Number.isSafeInteger(feedId) && feedId > 0,
  });
  const previewUrl =
    imageUrl ??
    [...(imagesQuery.data?.data?.images ?? [])]
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
      .find((image) => image.variantUrl)?.variantUrl;
  return (
    <Link
      to={`/profile/${userId}`}
      aria-label={`${name} 프로필 보기`}
      className='bg-white-800 flex h-full w-full max-w-[31.2rem] flex-col overflow-hidden rounded-[3.2rem]'>
      <div className='min-h-0 flex-1 bg-gray-100'>
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={`${name} 프로필`}
            className='size-full object-cover'
          />
        ) : (
          <span className='text-body1-15r flex size-full items-center justify-center text-gray-600'>
            {imagesQuery.isError
              ? '사진을 불러오지 못했어요'
              : imagesQuery.isPending
                ? '사진을 불러오는 중...'
                : '사진이 없어요'}
          </span>
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
