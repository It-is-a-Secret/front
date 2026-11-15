import assert from 'node:assert/strict';
import {test} from 'node:test';

import {
  detectPwaPlatform,
  isRunningStandalone,
  PWA_PROMPT_COOLDOWN_MS,
  PWA_PROMPT_DISMISSED_AT_KEY,
  savePwaPromptDismissedAt,
  shouldShowPwaPrompt,
} from '../src/pages/home/model/pwa-install-prompt';

const now = 1_800_000_000_000;
const shouldShow = (savedValue: string | null) =>
  shouldShowPwaPrompt({
    standalone: false,
    readDismissedAt: () => savedValue,
    now,
  });

test('shows the prompt without a prior dismissal and treats invalid history as absent', () => {
  for (const savedValue of [
    null,
    '',
    'invalid',
    'NaN',
    'Infinity',
    '0',
    '-1',
  ]) {
    assert.equal(shouldShow(savedValue), true, `saved value: ${savedValue}`);
  }
});

test('suppresses return visits for 24 hours after dismissal and allows the exact boundary', () => {
  assert.equal(shouldShow(String(now)), false);
  assert.equal(shouldShow(String(now - PWA_PROMPT_COOLDOWN_MS + 1)), false);
  assert.equal(shouldShow(String(now - PWA_PROMPT_COOLDOWN_MS)), true);
  assert.equal(shouldShow(String(now - PWA_PROMPT_COOLDOWN_MS - 1)), true);
});

test('preserves suppression if the device clock moves behind the saved dismissal', () => {
  assert.equal(shouldShow(String(now + 60_000)), false);
});

test('never prompts in a standalone app even when storage is unavailable', () => {
  let readCount = 0;
  assert.equal(
    shouldShowPwaPrompt({
      standalone: true,
      readDismissedAt: () => {
        readCount += 1;
        throw new Error('Storage blocked');
      },
      now,
    }),
    false
  );
  assert.equal(readCount, 0);
});

test('allows the prompt when a browser blocks reading storage', () => {
  assert.equal(
    shouldShowPwaPrompt({
      standalone: false,
      readDismissedAt: () => {
        throw new Error('Storage blocked');
      },
      now,
    }),
    true
  );
});

test('stores a browser-wide dismissal timestamp without an account-specific key', () => {
  const savedValues = new Map<string, string>();
  savePwaPromptDismissedAt((key, value) => savedValues.set(key, value), now);
  assert.equal(savedValues.size, 1);
  assert.equal(savedValues.get(PWA_PROMPT_DISMISSED_AT_KEY), String(now));
});

test('storage write failures do not stop dismissal', () => {
  assert.doesNotThrow(() =>
    savePwaPromptDismissedAt(() => {
      throw new Error('Storage full');
    }, now)
  );
});

test('recognizes standard standalone display mode and the iOS standalone flag', () => {
  assert.equal(isRunningStandalone(false), false);
  assert.equal(isRunningStandalone(false, false), false);
  assert.equal(isRunningStandalone(true, false), true);
  assert.equal(isRunningStandalone(false, true), true);
});

test('detects Android before Linux and desktop-mode iPadOS before Macintosh', () => {
  assert.equal(detectPwaPlatform('Mozilla/5.0 (Linux; Android 14)'), 'android');
  assert.equal(
    detectPwaPlatform('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)', 5),
    'ios'
  );
  assert.equal(
    detectPwaPlatform('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)', 0),
    'desktop'
  );
});

test('detects iOS devices and supported desktop agents while leaving unknown agents unsupported', () => {
  for (const userAgent of ['iPhone', 'iPad', 'iPod']) {
    assert.equal(detectPwaPlatform(userAgent), 'ios');
  }
  for (const userAgent of ['Windows NT 10.0', 'X11', 'Linux x86_64']) {
    assert.equal(detectPwaPlatform(userAgent), 'desktop');
  }
  assert.equal(detectPwaPlatform(''), 'unknown');
  assert.equal(detectPwaPlatform('UnrecognizedBrowser'), 'unknown');
});
