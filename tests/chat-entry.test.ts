import assert from 'node:assert/strict';
import {test} from 'node:test';

import {
  getChatEntryPath,
  getStartChatDraft,
  readChatDraft,
} from '../src/pages/chat/model/chat-entry';

test('uses the server room ID rather than the feed ID for an existing conversation', () => {
  assert.equal(
    getChatEntryPath(20, {roomId: 31, roomStatus: 'ACTIVE'}),
    '/chat/31'
  );
});

test('opens a feed-addressed draft when no room exists, including older responses without chatRoom', () => {
  assert.equal(getChatEntryPath(20, null), '/chat/new/20');
  assert.equal(getChatEntryPath(20, undefined), '/chat/new/20');
});

test('restores an unsent first message when the server finds a room created concurrently', () => {
  const message = '안녕하세요!';
  assert.equal(
    readChatDraft({draftMessage: getStartChatDraft(false, message)}),
    message
  );
  assert.equal(
    readChatDraft({draftMessage: getStartChatDraft(true, message)}),
    ''
  );
});

test('does not use malformed navigation state as chat input', () => {
  for (const state of [null, undefined, {}, {draftMessage: 123}]) {
    assert.equal(readChatDraft(state), '');
  }
});
