import {useContext, useLayoutEffect} from 'react';

import {
  ChatRoomInputContext,
  type ChatRoomInputConfig,
} from '@/pages/chat/model/chat-room-input';

export const useChatRoomInput = (config: ChatRoomInputConfig | null) => {
  const register = useContext(ChatRoomInputContext);
  if (!register) throw new Error('채팅 입력 레이아웃이 없습니다.');

  useLayoutEffect(() => register(config), [register, config]);
};
