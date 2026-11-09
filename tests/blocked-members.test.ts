import assert from 'node:assert/strict';
import {test} from 'node:test';

import {getBlockedMemberDescription} from '../src/pages/my/model/blocked-members';

test('formats the blocked member birth year, department label, and MBTI', () => {
  assert.equal(
    getBlockedMemberDescription({
      birthYear: 2001,
      department: 'COMPUTER_ENGINEERING',
      departmentLabel: '컴퓨터공학과',
      mbti: 'INFP',
    }),
    '01년생 · 컴퓨터공학과 · INFP'
  );
});

test('omits nullable onboarding fields without empty separators or invented data', () => {
  assert.equal(
    getBlockedMemberDescription(
      JSON.parse(
        '{"birthYear":null,"department":null,"departmentLabel":null,"mbti":null}'
      )
    ),
    ''
  );
  assert.equal(
    getBlockedMemberDescription({departmentLabel: '컴퓨터공학과'}),
    '컴퓨터공학과'
  );
  assert.equal(
    getBlockedMemberDescription({birthYear: 1999, mbti: 'INTJ'}),
    '99년생 · INTJ'
  );
});
