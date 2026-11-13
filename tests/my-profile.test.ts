import assert from 'node:assert/strict';
import {test} from 'node:test';

import {getMyProfileDescription} from '../src/pages/my/model/my-profile';

test('formats my profile using the API birth year, gender, and department', () => {
  assert.equal(
    getMyProfileDescription({
      birthYear: 2000,
      gender: 'MALE',
      department: 'SOFTWARE',
    }),
    '00년생(남)·소프트웨어학과'
  );
  assert.equal(
    getMyProfileDescription({
      birthYear: 1999,
      gender: 'FEMALE',
      department: 'COMPUTER_ENGINEERING',
    }),
    '99년생(여)·컴퓨터공학과'
  );
});

test('shows only provided onboarding fields without fabricated profile data', () => {
  assert.equal(getMyProfileDescription({}), '');
  assert.equal(getMyProfileDescription({birthYear: 2003}), '03년생');
  assert.equal(getMyProfileDescription({gender: 'FEMALE'}), '여');
  assert.equal(getMyProfileDescription({department: 'THEOLOGY'}), '신학과');
  assert.equal(
    getMyProfileDescription({birthYear: 2001, department: 'AI_CONVERGENCE'}),
    '01년생·AI융합학과'
  );
  assert.equal(
    getMyProfileDescription({gender: 'MALE', department: 'MUSIC'}),
    '남·음악학과'
  );
});

test('omits nullable API fields without empty separators or null text', () => {
  assert.equal(
    getMyProfileDescription(
      JSON.parse('{"birthYear":null,"gender":null,"department":null}')
    ),
    ''
  );
  assert.equal(
    getMyProfileDescription(
      JSON.parse('{"birthYear":null,"gender":"FEMALE","department":"SOFTWARE"}')
    ),
    '여·소프트웨어학과'
  );
});

test('labels API departments that are not offered by the onboarding picker', () => {
  assert.equal(
    getMyProfileDescription({department: 'GAME_CONTENT'}),
    '게임콘텐츠학과'
  );
  assert.equal(
    getMyProfileDescription({department: 'PUBLIC_GOVERNANCE'}),
    '공공행정학과'
  );
  assert.equal(
    getMyProfileDescription({department: 'MARINE_BIO_ENGINEERING'}),
    '해양바이오공학과'
  );
  assert.equal(
    getMyProfileDescription({department: 'CONVERGENCE_SOFTWARE'}),
    '융합소프트웨어학과'
  );
});
