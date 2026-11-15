import assert from 'node:assert/strict';
import {test} from 'node:test';
import {QueryClient} from '@tanstack/react-query';

import {QUERY_KEYS} from '../src/shared/api/config/query-key';
import type {GetChatRoomsResponse} from '../src/pages/chat/api/type';
import {
  preserveChatRoomPreviews,
  updateChatRoomPreview,
} from '../src/pages/chat/utils/chat-room-preview';
import {appendChatMessage} from '../src/pages/chat/utils/chat-message-cache';

const firstMessage = {
  messageId: 300,
  roomId: 20,
  type: 'TEXT' as const,
  content: '안녕하세요',
  createdAt: '2026-11-09T14:00:00+09:00',
};

test('first-message response creates the preview and moves the new room to the top', () => {
  const client = new QueryClient();
  client.setQueryData(QUERY_KEYS.chat.rooms(), {
    data: [
      {
        roomId: 10,
        lastMessageId: 100,
        lastMessage: {
          ...firstMessage,
          roomId: 10,
          messageId: 100,
          createdAt: '2026-11-01T14:00:00+09:00',
        },
      },
    ],
  });
  updateChatRoomPreview(client, 20, firstMessage, {
    partnerNickname: '상대방',
    roomStatus: 'ACTIVE',
    unreadCount: 0,
  });
  const rooms = client.getQueryData<GetChatRoomsResponse>(
    QUERY_KEYS.chat.rooms()
  )!.data!;
  assert.deepEqual(
    rooms.map((room) => room.roomId),
    [20, 10]
  );
  assert.equal(rooms[0].lastMessage?.content, '안녕하세요');
  assert.equal(rooms[0].unreadCount, 0);
  client.clear();
});

test('a delayed REST summary cannot erase the confirmed preview and still updates unread count', () => {
  const old = {
    data: [
      {
        roomId: 20,
        lastMessageId: 300,
        lastMessage: firstMessage,
        unreadCount: 5,
      },
    ],
  };
  const merged = preserveChatRoomPreviews(old, {
    data: [{roomId: 20, lastMessage: null, unreadCount: 0}],
  });
  assert.equal(merged.data![0].lastMessage?.content, '안녕하세요');
  assert.equal(merged.data![0].unreadCount, 0);
  // Authoritative removals (leave/block) must not be resurrected by preview caching.
  assert.deepEqual(preserveChatRoomPreviews(old, {data: []}).data, []);
});

test('room messages update list preview even when message history has no cached query', () => {
  const client = new QueryClient();
  client.setQueryData(QUERY_KEYS.chat.rooms(), {
    data: [{roomId: 20, unreadCount: 2}],
  });
  appendChatMessage(client, 20, firstMessage);
  appendChatMessage(client, 20, {
    ...firstMessage,
    messageId: 200,
    content: '과거 메시지',
  });
  const room = client.getQueryData<GetChatRoomsResponse>(
    QUERY_KEYS.chat.rooms()
  )!.data![0];
  assert.equal(room.lastMessage?.content, '안녕하세요');
  assert.equal(room.unreadCount, 2);
  client.clear();
});

test('newer server previews replace cached previews and sort by actual sent time', () => {
  const result = preserveChatRoomPreviews(
    {data: [{roomId: 20, lastMessageId: 300, lastMessage: firstMessage}]},
    {
      data: [
        {
          roomId: 10,
          lastMessageId: 400,
          lastMessage: {
            ...firstMessage,
            messageId: 400,
            createdAt: '2026-11-09T05:30:00Z',
          },
        },
        {
          roomId: 20,
          lastMessageId: 500,
          lastMessage: {
            ...firstMessage,
            messageId: 500,
            content: '새 답장',
            createdAt: '2026-11-09T15:00:00+09:00',
          },
        },
      ],
    }
  );
  assert.deepEqual(
    result.data!.map((room) => room.roomId),
    [20, 10]
  );
  assert.equal(result.data![0].lastMessage?.content, '새 답장');
});
