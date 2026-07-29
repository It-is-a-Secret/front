import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {ChatInputBox} from '@/pages/chat/components/ChatInputBox';
import {ChatMessageListSection} from '@/pages/chat/section/ChatMessageListSection';
import {Header} from '@/shared/components/Header';
import {IcSvgEtc, IcSvgLeft} from '@/shared/icons';

const MOCK_CHAT_ROOM = {
  nickname: '행복한코딩러',
  publicPhotoCount: 2,
};

export const ChatRoom = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  return (
    <section className='flex h-dvh flex-col'>
      <Header
        className='px-[2rem]'
        leftItem={<IcSvgLeft className='size-[2.4rem] text-gray-800' />}
        onClickLeft={() => navigate(-1)}
        title={
          <div className='flex items-center gap-[0.8rem]'>
            <h1 className='text-title-18b text-gray-800'>
              {MOCK_CHAT_ROOM.nickname}
            </h1>
            <span className='bg-primary text-button2-10r text-white-800 rounded-full px-[0.6rem] py-[0.1rem]'>
              {MOCK_CHAT_ROOM.publicPhotoCount}/5
            </span>
          </div>
        }
        rightItem={<IcSvgEtc className='size-[3.2rem] text-gray-800' />}
      />

      <main className='flex min-h-0 flex-1 flex-col'>
        <ChatMessageListSection />

        <ChatInputBox
          value={message}
          onValueChange={setMessage}
          submitDisabled={!message.trim()}
          onSubmit={(event) => {
            event.preventDefault();
            setMessage('');
          }}
        />
      </main>
    </section>
  );
};
