import {useLocation, useNavigate} from 'react-router-dom';

import {TermsDocument} from '@/pages/terms/TermsDocument';
import {Header} from '@/shared/components/Header';
import {IcSvgLeft} from '@/shared/icons';

export const TermsPage = () => {
  const {state} = useLocation();
  const navigate = useNavigate();

  const handleBack = () => {
    if (state?.fromLogin === true) {
      navigate(-1);
      return;
    }

    navigate('/auth', {replace: true});
  };

  return (
    <section>
      <Header
        title={<h1 className='text-title-18b text-gray-800'>이용약관</h1>}
        leftItem={<IcSvgLeft className='size-[2.4rem] text-gray-800' />}
        onClickLeft={handleBack}
      />
      <TermsDocument />
    </section>
  );
};
