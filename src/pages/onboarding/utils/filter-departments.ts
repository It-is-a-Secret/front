const HANGUL_START_CODE = '가'.charCodeAt(0);
const HANGUL_END_CODE = '힣'.charCodeAt(0);
const HANGUL_UNIT = 588;
const INITIAL_CONSONANTS = [
  'ㄱ',
  'ㄲ',
  'ㄴ',
  'ㄷ',
  'ㄸ',
  'ㄹ',
  'ㅁ',
  'ㅂ',
  'ㅃ',
  'ㅅ',
  'ㅆ',
  'ㅇ',
  'ㅈ',
  'ㅉ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
];

const getInitialConsonants = (value: string) => {
  return Array.from(value)
    .map((letter) => {
      const code = letter.charCodeAt(0);

      if (code < HANGUL_START_CODE || code > HANGUL_END_CODE) {
        return letter;
      }

      return INITIAL_CONSONANTS[
        Math.floor((code - HANGUL_START_CODE) / HANGUL_UNIT)
      ];
    })
    .join('');
};

export const filterDepartments = (
  departments: readonly string[],
  searchKeyword: string
) => {
  const trimmedKeyword = searchKeyword.trim();

  if (!trimmedKeyword) {
    return departments;
  }

  return departments.filter((department) => {
    const initialConsonants = getInitialConsonants(department);

    return (
      department.includes(trimmedKeyword) ||
      initialConsonants.startsWith(trimmedKeyword)
    );
  });
};
