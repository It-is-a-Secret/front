import assert from 'node:assert/strict';
import {test} from 'node:test';

import {
  clearPhotoBlurNoticeState,
  readPhotoBlurNoticeState,
} from '../src/pages/home/model/photo-blur-notice';

test('only the explicit successful onboarding marker opens the notice', () => {
  assert.equal(readPhotoBlurNoticeState({showPhotoBlurNotice: true}), true);

  for (const state of [
    undefined,
    null,
    true,
    'true',
    [],
    {},
    {showPhotoBlurNotice: false},
    {showPhotoBlurNotice: 'true'},
    {showPhotoBlurNotice: 1},
    Object.create({showPhotoBlurNotice: true}),
  ]) {
    assert.equal(readPhotoBlurNoticeState(state), false);
  }
});

test('acknowledgment clears the marker so restored navigation state does not reopen it', () => {
  const nextState = clearPhotoBlurNoticeState({showPhotoBlurNotice: true});

  assert.equal(nextState, null);
  assert.equal(readPhotoBlurNoticeState(nextState), false);
  assert.equal(clearPhotoBlurNoticeState(nextState), null);
});

test('clearing the notice preserves other home navigation state without mutating it', () => {
  const state = {
    showPhotoBlurNotice: true,
    toastMessage: '프로필이 저장됐어요.',
    filters: {department: '소프트웨어학과'},
  };
  const nextState = clearPhotoBlurNoticeState(state);

  assert.deepEqual(nextState, {
    toastMessage: state.toastMessage,
    filters: state.filters,
  });
  assert.equal(readPhotoBlurNoticeState(nextState), false);
  assert.equal(state.showPhotoBlurNotice, true);
  assert.notEqual(nextState, state);
});

test('ordinary visits and malformed navigation state can be cleared safely', () => {
  const ordinaryState = {toastMessage: '다시 돌아왔어요.'};

  assert.deepEqual(clearPhotoBlurNoticeState(ordinaryState), ordinaryState);
  for (const state of [undefined, null, [], 'login', false, 1]) {
    assert.equal(clearPhotoBlurNoticeState(state), null);
  }
});
