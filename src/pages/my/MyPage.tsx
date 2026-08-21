import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {MyMenuItem} from '@/pages/my/components/MyMenuItem';
import {
  IcSvgBell,
  IcSvgBlock,
  IcSvgCheck,
  IcSvgExit,
  IcSvgSecession,
} from '@/shared/icons';

export const MyPage = () => {
  const navigate = useNavigate();
  const [isChatNotificationOn, setIsChatNotificationOn] = useState(true);

  return (
    <main>
      <section>
        <h2>개인 설정</h2>
        <div>
          <MyMenuItem
            type='toggle'
            Icon={IcSvgBell}
            label='채팅 알림 설정'
            checked={isChatNotificationOn}
            onCheckedChange={setIsChatNotificationOn}
          />
          <MyMenuItem
            type='click'
            Icon={IcSvgBlock}
            label='차단 목록'
            onClick={() => navigate('/my/blocked')}
          />
          <MyMenuItem
            type='click'
            Icon={IcSvgCheck}
            label='이용약관·정책'
            onClick={() => navigate('/my/policies')}
          />
        </div>
      </section>

      <section>
        <h2>계정 관리</h2>
        <div>
          <MyMenuItem
            type='click'
            Icon={IcSvgExit}
            label='로그아웃'
            onClick={() => undefined}
          />
          <MyMenuItem
            type='click'
            Icon={IcSvgSecession}
            label='회원 탈퇴'
            onClick={() => navigate('/my/secession')}
          />
        </div>
      </section>
    </main>
  );
};
