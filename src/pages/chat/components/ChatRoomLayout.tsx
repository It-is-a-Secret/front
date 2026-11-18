import {useCallback, useState} from 'react';
import {Outlet} from 'react-router-dom';

import {ChatInputBox} from '@/pages/chat/components/ChatInputBox';
import {
  ChatRoomInputContext,
  type ChatRoomInputConfig,
} from '@/pages/chat/model/chat-room-input';

interface InputRegistration {
  owner: object;
  config: ChatRoomInputConfig | null;
  value: string;
}

export const ChatRoomLayout = () => {
  const [registration, setRegistration] = useState<InputRegistration | null>(
    null
  );
  const register = useCallback((config: ChatRoomInputConfig | null) => {
    const owner = {};
    setRegistration((current) => ({
      owner,
      config,
      value: config?.value ?? current?.value ?? '',
    }));
    return () => {
      setRegistration((current) =>
        current?.owner === owner ? {...current, config: null} : current
      );
    };
  }, []);
  const config = registration?.config;

  return (
    <ChatRoomInputContext.Provider value={register}>
      <section className='relative flex h-dvh flex-col overflow-hidden'>
        <div
          className='flex min-h-0 flex-1 flex-col'
          onClick={(event) => {
            const activeElement =
              event.currentTarget.ownerDocument.activeElement;
            if (activeElement instanceof HTMLInputElement) activeElement.blur();
          }}>
          <Outlet />
        </div>
        {/* 방 생성 후 이동하거나 대화를 불러올 때도 같은 입력 DOM을 유지합니다. */}
        <ChatInputBox
          value={config?.value ?? registration?.value ?? ''}
          onValueChange={(value) => {
            if (config) config.onValueChange(value);
            else {
              setRegistration((current) =>
                current ? {...current, value} : current
              );
            }
          }}
          inputProps={{
            disabled: config?.disabled ?? false,
            onKeyDown: (event) => {
              if (event.key === 'Enter' && event.nativeEvent.isComposing)
                event.preventDefault();
            },
          }}
          placeholder={config?.placeholder}
          submitDisabled={!config || config.submitDisabled}
          onSubmit={(event) => {
            event.preventDefault();
            if (config && !config.disabled && !config.submitDisabled)
              config.onSubmit();
          }}
        />
      </section>
    </ChatRoomInputContext.Provider>
  );
};
