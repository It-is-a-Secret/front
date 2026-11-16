import {useLocation, useNavigate} from 'react-router-dom';

import androidGuide from '@/assets/pwa-install-guide/android.png';
import iosGuide from '@/assets/pwa-install-guide/ios.png';
import {detectPwaPlatform} from '@/pages/home/model/pwa-install-prompt';
import {Header} from '@/shared/components/Header';
import {IcSvgLeft} from '@/shared/icons';

interface PwaInstallGuideProps {
  previewPlatform?: 'android' | 'ios';
}

export const PwaInstallGuide = ({previewPlatform}: PwaInstallGuideProps) => {
  const {state} = useLocation();
  const navigate = useNavigate();
  const platform =
    previewPlatform ??
    (state?.platform === 'android' || state?.platform === 'ios'
      ? state.platform
      : detectPwaPlatform(navigator.userAgent, navigator.maxTouchPoints));

  const handleBack = () => {
    if (state?.fromInstallPrompt === true) {
      navigate(-1);
      return;
    }

    navigate('/home', {replace: true});
  };

  return (
    <section className='min-h-dvh'>
      <Header
        className='bg-background sticky top-0 z-10 -mx-[2rem] px-[2rem]'
        title={
          <h1 className='text-bold-24 text-gray-800'>
            Blur<span className='text-primary'>Some</span>
          </h1>
        }
        leftItem={
          <>
            <IcSvgLeft
              className='size-[2.4rem] text-gray-800'
              aria-hidden='true'
            />
            <span className='sr-only'>뒤로 가기</span>
          </>
        }
        onClickLeft={handleBack}
      />
      <div className='-mx-[2rem]'>
        {platform !== 'ios' && (
          <img
            src={androidGuide}
            alt='Android 설치 안내. 브라우저 상단의 다운로드 버튼을 누른 뒤 홈 화면에서 BlurSome을 실행하세요.'
            width={852}
            height={1846}
            className='block h-auto w-full'
          />
        )}
        {platform !== 'android' && (
          <img
            src={iosGuide}
            alt='iOS 설치 안내. 브라우저의 공유 버튼을 누르고 홈 화면에 추가를 선택한 뒤 홈 화면에서 BlurSome을 실행하세요.'
            width={852}
            height={1845}
            loading={platform === 'ios' ? 'eager' : 'lazy'}
            className='block h-auto w-full'
          />
        )}
      </div>
    </section>
  );
};
