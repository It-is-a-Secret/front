import {BlurStrengthResetSheet} from '@/pages/my/features/profile-edit-sheet/BlurStrengthResetSheet';
import {InterestCategoryResetSheet} from '@/pages/my/features/profile-edit-sheet/InterestCategoryResetSheet';
import {MbtiResetSheet} from '@/pages/my/features/profile-edit-sheet/MbtiResetSheet';
import {NicknameResetSheet} from '@/pages/my/features/profile-edit-sheet/NicknameResetSheet';
import {PhotoUploadResetSheet} from '@/pages/my/features/profile-edit-sheet/PhotoUploadResetSheet';
import type {
  BlurStrength,
  MbtiType,
  SelectedInterests,
} from '@/pages/onboarding/constants/constants';

type ProfileEditSheetType =
  | 'nickname'
  | 'mbti'
  | 'interests'
  | 'photoUpload'
  | 'blurStrength';

interface ProfileEditSheetProps {
  type: ProfileEditSheetType | null;
  nickname: string;
  mbti: MbtiType;
  selectedInterests: SelectedInterests;
  photoUrls: string[];
  blurStrength: BlurStrength;
  onClose: () => void;
  onNicknameChange: (nickname: string) => void;
  onMbtiChange: (mbti: MbtiType) => void;
  onSelectedInterestsChange: (selectedInterests: SelectedInterests) => void;
  onPhotoUrlsChange: (photoUrls: string[]) => void;
  onBlurStrengthChange: (blurStrength: BlurStrength) => void;
}

export const ProfileEditSheet = ({
  type,
  nickname,
  mbti,
  selectedInterests,
  photoUrls,
  blurStrength,
  onClose,
  onNicknameChange,
  onMbtiChange,
  onSelectedInterestsChange,
  onPhotoUrlsChange,
  onBlurStrengthChange,
}: ProfileEditSheetProps) => {
  if (!type) {
    return null;
  }

  const renderContent = () => {
    if (type === 'nickname') {
      return (
        <NicknameResetSheet
          nickname={nickname}
          onClose={onClose}
          onSubmit={onNicknameChange}
        />
      );
    }

    if (type === 'mbti') {
      return (
        <MbtiResetSheet
          mbti={mbti}
          onClose={onClose}
          onSubmit={onMbtiChange}
        />
      );
    }

    if (type === 'interests') {
      return (
        <InterestCategoryResetSheet
          selectedInterests={selectedInterests}
          onClose={onClose}
          onSubmit={onSelectedInterestsChange}
        />
      );
    }

    if (type === 'photoUpload') {
      return (
        <PhotoUploadResetSheet
          photoUrls={photoUrls}
          onClose={onClose}
          onSubmit={onPhotoUrlsChange}
        />
      );
    }

    return (
      <BlurStrengthResetSheet
        blurStrength={blurStrength}
        onClose={onClose}
        onSubmit={onBlurStrengthChange}
      />
    );
  };

  return (
    <section className='bg-background fixed inset-0 z-[60] mx-auto h-dvh w-full min-w-[375px] max-w-[430px] overflow-hidden px-[2rem]'>
      {renderContent()}
    </section>
  );
};

export type {ProfileEditSheetType};
