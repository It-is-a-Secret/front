import {BlurStrengthResetSheet} from '@/pages/my/features/profile-edit-sheet/BlurStrengthResetSheet';
import {InterestCategoryResetSheet} from '@/pages/my/features/profile-edit-sheet/InterestCategoryResetSheet';
import {MbtiResetSheet} from '@/pages/my/features/profile-edit-sheet/MbtiResetSheet';
import {NicknameResetSheet} from '@/pages/my/features/profile-edit-sheet/NicknameResetSheet';
import {PhotoUploadResetSheet} from '@/pages/my/features/profile-edit-sheet/PhotoUploadResetSheet';
import type {
  ProfileChanges,
  ProfileInterestCategory,
  ProfilePhoto,
} from '@/pages/my/model/profile-edit';
import {getProfileChangeNote} from '@/pages/my/model/profile-edit';
import type {components} from '@/shared/types/schema';
import type {
  MbtiType,
  BlurStrength,
} from '@/pages/onboarding/constants/constants';
import type {PhotoSlot} from '@/pages/onboarding/hooks/usePhotoUploadSlots';
import {Button} from '@/shared/components/Button';
import {Header} from '@/shared/components/Header';
import {IcSvgLeft} from '@/shared/icons';

type ProfileEditSheetType =
  | 'nickname'
  | 'mbti'
  | 'interests'
  | 'photoUpload'
  | 'blurStrength';

interface ProfileEditSheetProps {
  type: ProfileEditSheetType | null;
  nickname: string;
  mbti?: MbtiType;
  categories: ProfileInterestCategory[];
  selectedTagIds: number[];
  photos: ProfilePhoto[];
  editStatus?: components['schemas']['ProfileEditStatusResponse'];
  isSaving: boolean;
  onSave: (changes: ProfileChanges) => Promise<void>;
  onSavePhotos: (slots: PhotoSlot[]) => Promise<void>;
  onSaveBlur: (strength: BlurStrength) => Promise<void>;
  onNotify: (message: string) => void;
  isKeywordsPending: boolean;
  isKeywordsError: boolean;
  isImagesPending: boolean;
  isImagesError: boolean;
  onRetryKeywords: () => void;
  onRetryImages: () => void;
  onClose: () => void;
}

export const ProfileEditSheet = ({
  type,
  nickname,
  mbti,
  categories,
  selectedTagIds,
  photos,
  editStatus,
  isSaving,
  onSave,
  onSavePhotos,
  onSaveBlur,
  onNotify,
  isKeywordsPending,
  isKeywordsError,
  isImagesPending,
  isImagesError,
  onRetryKeywords,
  onRetryImages,
  onClose,
}: ProfileEditSheetProps) => {
  if (!type) {
    return null;
  }

  const status =
    type === 'nickname'
      ? editStatus?.nickName
      : type === 'mbti'
        ? editStatus?.mbti
        : editStatus?.keywords;
  const saveProps = {
    isSaving,
    canSave: status?.changeable === true,
    changeNote: getProfileChangeNote(status),
  };

  const renderContent = () => {
    const needsImages = type === 'photoUpload' || type === 'blurStrength';
    const isPending =
      type === 'interests' ? isKeywordsPending : needsImages && isImagesPending;
    const isError =
      type === 'interests' ? isKeywordsError : needsImages && isImagesError;

    if (isPending || isError) {
      return (
        <section className='flex h-dvh flex-col'>
          <Header
            title={
              <h1 className='text-title-18b text-gray-800'>프로필 수정</h1>
            }
            leftItem={
              <IcSvgLeft width={24} height={24} className='text-gray-800' />
            }
            onClickLeft={onClose}
          />
          <div className='flex flex-1 flex-col items-center justify-center gap-[1.6rem]'>
            {isPending ? (
              <p role='status' className='text-body1-15r text-gray-600'>
                정보를 불러오는 중...
              </p>
            ) : (
              <>
                <p role='alert' className='text-body1-15r text-gray-800'>
                  정보를 불러오지 못했어요.
                </p>
                <Button
                  text='다시 시도'
                  onClick={
                    type === 'interests' ? onRetryKeywords : onRetryImages
                  }
                />
              </>
            )}
          </div>
        </section>
      );
    }

    if (type === 'nickname') {
      return (
        <NicknameResetSheet
          nickname={nickname}
          onClose={onClose}
          {...saveProps}
          onSave={(nickName) => onSave({nickName})}
          onNotify={onNotify}
        />
      );
    }

    if (type === 'mbti') {
      return (
        <MbtiResetSheet
          mbti={mbti}
          onClose={onClose}
          {...saveProps}
          onSave={(mbti) => onSave({mbti})}
        />
      );
    }

    if (type === 'interests') {
      return (
        <InterestCategoryResetSheet
          categories={categories}
          selectedTagIds={selectedTagIds}
          {...saveProps}
          onSave={(keywordTagIds) => onSave({keywordTagIds})}
          onClose={onClose}
        />
      );
    }

    if (type === 'photoUpload') {
      return (
        <PhotoUploadResetSheet
          photos={photos}
          onClose={onClose}
          isSaving={isSaving}
          onSave={onSavePhotos}
        />
      );
    }

    return (
      <BlurStrengthResetSheet
        photos={photos}
        onClose={onClose}
        isSaving={isSaving}
        onSave={onSaveBlur}
      />
    );
  };

  return (
    <section className='bg-background fixed inset-0 z-[60] mx-auto h-dvh w-full max-w-[430px] min-w-[375px] overflow-hidden px-[2rem]'>
      {renderContent()}
    </section>
  );
};

export type {ProfileEditSheetType};
