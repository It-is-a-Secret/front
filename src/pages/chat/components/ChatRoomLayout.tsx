import {useCallback, useLayoutEffect, useRef, useState} from 'react';
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
  const layoutRef = useRef<HTMLElement>(null);
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

  useLayoutEffect(() => {
    const layout = layoutRef.current;
    const viewport = window.visualViewport;
    if (!layout || !viewport) return;

    const syncViewport = () => {
      // 확대했을 때는 브라우저의 기본 스크롤과 확대 동작을 유지합니다.
      const useVisualViewport = viewport.scale === 1 && viewport.height > 0;
      layout.style.height = useVisualViewport ? `${viewport.height}px` : '';
      layout.style.top = useVisualViewport ? `${viewport.offsetTop}px` : '';
    };
    syncViewport();
    viewport.addEventListener('resize', syncViewport);
    viewport.addEventListener('scroll', syncViewport);
    return () => {
      viewport.removeEventListener('resize', syncViewport);
      viewport.removeEventListener('scroll', syncViewport);
    };
  }, []);

  return (
    <ChatRoomInputContext.Provider value={register}>
      <section
        ref={layoutRef}
        data-chat-room-layout
        className='fixed inset-x-0 top-0 mx-auto flex h-dvh max-w-[430px] flex-col overflow-hidden'>
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
