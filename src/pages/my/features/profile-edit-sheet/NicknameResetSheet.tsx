import {useState} from 'react';
import {useMutation} from '@tanstack/react-query';

import {MY_MUTATION_OPTIONS} from '@/pages/my/api/query';
import {
  getProfileErrorMessage,
  isValidNickname,
} from '@/pages/my/model/profile-edit';
import {Button} from '@/shared/components/Button';
import {FieldErrorMessage} from '@/shared/components/FieldErrorMessage';
import {Header} from '@/shared/components/Header';
import {Input} from '@/shared/components/Input';
import {IcSvgLeft} from '@/shared/icons';

const NICKNAME_MAX_LENGTH = 12;

interface NicknameResetSheetProps {
  nickname: string;
  onClose: () => void;
  isSaving: boolean;
  canSave: boolean;
  changeNote: string;
  onSave: (nickname: string) => Promise<void>;
  onNotify: (message: string) => void;
}

export const NicknameResetSheet = ({
  nickname,
  onClose,
  isSaving,
  canSave,
  changeNote,
  onSave,
  onNotify,
}: NicknameResetSheetProps) => {
  const [nextNickname, setNextNickname] = useState(nickname);
  const check = useMutation(MY_MUTATION_OPTIONS.CHECK_NICKNAME());
  const value = nextNickname.trim();
  const valid = isValidNickname(value);
  const checked = check.variables === value && check.isSuccess;
  const isAvailable = checked && check.data.data?.available === true;
  const isDuplicated = checked && check.data.data?.available === false;

  const checkDuplicate = async () => {
    if (!valid || check.isPending || !canSave || isSaving) return;
    try {
      const result = await check.mutateAsync(value);
      if (typeof result.data?.available !== 'boolean') {
        throw new Error(
          '닉네임 확인 결과를 받지 못했어요. 다시 시도해 주세요.'
        );
      }
    } catch (error) {
      onNotify(getProfileErrorMessage(error, '닉네임 중복 확인에 실패했어요.'));
    }
  };

  return (
    <section className='flex min-h-dvh flex-col'>
      <Header
        title={<h1 className='text-title-18b text-gray-800'>프로필 수정</h1>}
        leftItem={
          <IcSvgLeft width={24} height={24} className='text-gray-800' />
        }
        onClickLeft={onClose}
      />

      <div className='mt-[1.6rem] flex flex-1 flex-col'>
        <div className='flex flex-col gap-[0.4rem]'>
          <h2 className='text-body4-16m'>닉네임 재설정</h2>

          <div className='flex flex-col gap-[0.8rem]'>
            <div className='text-body1-15r flex items-end justify-between text-gray-400'>
              <span className='text-caption1-12r'>
                2~12자 (한글/영문/숫자 가능)
              </span>
              <span className='text-caption1-12r'>
                {nextNickname.length}/{NICKNAME_MAX_LENGTH}
              </span>
            </div>

            <Input
              value={nextNickname}
              onChange={(event) => {
                setNextNickname(event.target.value);
                check.reset();
              }}
              disabled={isSaving || !canSave}
              isError={isDuplicated}
              aria-label='닉네임'
              maxLength={NICKNAME_MAX_LENGTH}
              placeholder='ex) abcde'
              rightItem={
                <button
                  type='button'
                  disabled={!valid || check.isPending || isSaving || !canSave}
                  onClick={() => void checkDuplicate()}
                  className='text-regular-10 bg-primary text-white-800 disabled:text-white-800 rounded-full px-[0.8rem] py-[0.6rem] disabled:bg-gray-200'>
                  {check.isPending ? '확인 중...' : '중복확인'}
                </button>
              }
            />
            {isDuplicated && (
              <FieldErrorMessage message='이미 사용 중인 닉네임이에요' />
            )}
            {isAvailable && (
              <FieldErrorMessage
                message='사용 가능한 닉네임이에요'
                variant='default'
              />
            )}
          </div>
        </div>

        <div className='relative mt-auto pb-[2rem]'>
          <Button
            text={isSaving ? '저장 중...' : '저장하기'}
            description={changeNote}
            disabled={
              isSaving ||
              !canSave ||
              !valid ||
              !isAvailable ||
              value === nickname
            }
            onClick={async () => {
              await onSave(value);
              check.reset();
            }}
          />
        </div>
      </div>
    </section>
  );
};
