import {useState} from 'react';

import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useNavigate} from 'react-router-dom';

import {AUTH_MUTATION_OPTIONS} from '@/pages/auth/api/query';
import {clearAccessToken} from '@/shared/api/config/auth-token';
import {BottomSheet} from '@/shared/components/BottomSheet';
import {Button} from '@/shared/components/Button';

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const logoutMutation = useMutation({
    ...AUTH_MUTATION_OPTIONS.LOGOUT(),
    onSuccess: async () => {
      await queryClient.cancelQueries();
      clearAccessToken();
      queryClient.clear();
      navigate('/auth', {replace: true});
    },
  });

  const open = () => {
    logoutMutation.reset();
    setIsOpen(true);
  };

  const close = () => {
    if (logoutMutation.isPending) {
      return;
    }

    setIsOpen(false);
    logoutMutation.reset();
  };

  const submit = () => {
    if (!logoutMutation.isPending) {
      logoutMutation.mutate();
    }
  };

  return {
    open,
    logoutSheet: (
      <BottomSheet open={isOpen} ariaLabel='로그아웃 확인' onClose={close}>
        <div className='flex flex-col items-center px-[1.2rem] pb-[3.6rem] text-center'>
          <img src='logout.png' alt='' className='size-[9.2rem]' />
          <h2 className='text-title-22b text-primary mb-[0.8rem]'>
            로그아웃할까요?
          </h2>
          <p className='text-body1-15r mb-[2.8rem] text-gray-600'>
            언제든 다시 로그인할 수 있어요
          </p>
          {logoutMutation.isError && (
            <p role='alert' className='text-body1-15r text-primary mb-[1.6rem]'>
              로그아웃에 실패했어요. 다시 시도해 주세요.
            </p>
          )}
          <div className='flex w-full gap-[0.8rem]'>
            <div className='flex-[1]'>
              <Button
                text='취소'
                className='border-primary text-button1-14b text-primary h-[5.6rem] rounded-[28px] border'
                onClick={close}
                disabled={logoutMutation.isPending}
              />
            </div>
            <div className='flex-[1.8]'>
              <Button
                text={logoutMutation.isPending ? '로그아웃 중...' : '로그아웃'}
                className='bg-primary text-button1-14b text-white-800 h-[5.6rem] rounded-[28px] shadow-[0_8px_10px_0_rgba(194,30,86,0.25)]'
                onClick={submit}
                disabled={logoutMutation.isPending}
              />
            </div>
          </div>
        </div>
      </BottomSheet>
    ),
  };
};
