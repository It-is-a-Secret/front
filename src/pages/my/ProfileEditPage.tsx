import {useNavigate} from 'react-router-dom';

import {NoticeMessage} from '@/pages/my/components/NoticeMessage';
import {ProfileSettingItem} from '@/pages/my/components/ProfileSettingItem';
import {ToastMessage} from '@/pages/my/components/ToastMessage';
import {ProfileEditSheet} from '@/pages/my/features/profile-edit-sheet/ProfileEditSheet';
import {useProfileEdit} from '@/pages/my/hooks/useProfileEdit';
import {BottomNavBar} from '@/shared/components/BottomNavBar';
import {Button} from '@/shared/components/Button';
import {Header} from '@/shared/components/Header';
import {IcSvgLeft} from '@/shared/icons';

export const ProfileEditPage = () => {
  const navigate = useNavigate();
  const edit = useProfileEdit();

  return (
    <main className='min-h-dvh pb-[12rem]'>
      <Header
        title={<h1 className='text-title-18b text-gray-800'>프로필 수정</h1>}
        leftItem={
          <IcSvgLeft width={24} height={24} className='text-gray-800' />
        }
        onClickLeft={() => navigate('/my')}
      />

      {edit.profileQuery.isPending ? (
        <p role='status' className='text-body1-15r mt-[2.8rem] text-gray-600'>
          프로필을 불러오는 중...
        </p>
      ) : edit.profileQuery.isError || !edit.profile ? (
        <div className='mt-[2.8rem] flex flex-col gap-[1.6rem]'>
          <p role='alert' className='text-body1-15r text-gray-800'>
            프로필을 불러오지 못했어요.
          </p>
          <Button
            text='다시 시도'
            onClick={() => void edit.profileQuery.refetch()}
          />
        </div>
      ) : (
        <section className='mt-[1.6rem]'>
          <NoticeMessage message='모든 정보는 30일에 한 번만 변경할 수 있어요' />

          <div className='mt-[2.8rem] flex flex-col gap-[0.8rem]'>
            <h2 className='text-body1-15r'>기본 정보</h2>
            <div className='bg-white-800 overflow-hidden rounded-[16px] border border-gray-200'>
              <ProfileSettingItem
                label='닉네임'
                value={edit.profile.nickName ?? ''}
                onClick={() => edit.openSheet('nickname')}
              />
            </div>
          </div>

          <div className='mt-[2.4rem] flex flex-col gap-[0.8rem]'>
            <h2 className='text-body1-15r'>프로필 정보</h2>
            <div className='bg-white-800 divide-y divide-gray-200 overflow-hidden rounded-[16px] border border-gray-200'>
              <ProfileSettingItem
                label='MBTI'
                value={edit.profile.mbti ?? '모름'}
                onClick={() => edit.openSheet('mbti')}
              />
              <ProfileSettingItem
                label='관심 카테고리'
                onClick={() => edit.openSheet('interests')}
              />
            </div>
          </div>

          <div className='mt-[2.4rem] flex flex-col gap-[0.8rem]'>
            <h2 className='text-body1-15r'>사진 관리</h2>
            <div className='bg-white-800 divide-y divide-gray-200 overflow-hidden rounded-[16px] border border-gray-200'>
              <ProfileSettingItem
                label='사진 업로드 관리'
                onClick={() => edit.openSheet('photoUpload')}
              />
              <ProfileSettingItem
                label='사진 블러 강도'
                value={edit.blurLabel}
                onClick={() => edit.openSheet('blurStrength')}
              />
            </div>
          </div>
        </section>
      )}

      <BottomNavBar />
      {edit.profile && (
        <ProfileEditSheet
          type={edit.selectedSheet}
          nickname={edit.profile.nickName ?? ''}
          mbti={edit.profile.mbti}
          categories={edit.categories}
          selectedTagIds={edit.selectedTagIds}
          photos={edit.photos}
          editStatus={edit.profile.profileEdit}
          isSaving={edit.isSaving}
          onSave={edit.saveProfile}
          onSavePhotos={edit.savePhotos}
          onSaveBlur={edit.saveBlur}
          onNotify={edit.notify}
          isKeywordsPending={edit.keywordsQuery.isPending}
          isKeywordsError={
            edit.keywordsQuery.isError || !edit.keywordsQuery.data?.data
          }
          isImagesPending={edit.imagesQuery.isPending}
          isImagesError={
            edit.imagesQuery.isError || !edit.imagesQuery.data?.data
          }
          onRetryKeywords={() => void edit.keywordsQuery.refetch()}
          onRetryImages={() => void edit.imagesQuery.refetch()}
          onClose={edit.closeSheet}
        />
      )}
      {edit.toast.isVisible && (
        <div
          className={`fixed right-[2rem] bottom-[8.2rem] left-[2rem] z-[80] mx-auto max-w-[39rem] transition-opacity ${edit.toast.isLeaving ? 'opacity-0' : 'opacity-100'}`}
          style={{transitionDuration: `${edit.toast.fadeDuration}ms`}}>
          <ToastMessage message={edit.message} />
        </div>
      )}
    </main>
  );
};
