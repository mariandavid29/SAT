import { calculateMemoryLimit, getEnvValue } from './utils';

export const MEMORY_LIMIT = calculateMemoryLimit();
export const TIME_LIMIT = 10000;

export const VARIABLES = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];
export const NUM_TESTS = 100;

export const MIN_CLAUSES_PER_TEST = Number(getEnvValue('MIN_CLAUSES_PER_TEST'));
export const MAX_CLAUSES_PER_TEST = Number(getEnvValue('MAX_CLAUSES_PER_TEST'));

export const MIN_LITERALS_PER_CLAUSE = Number(
  getEnvValue('MIN_LITERALS_PER_CLAUSE')
);
export const MAX_LITERALS_PER_CLAUSE = Number(
  getEnvValue('MAX_LITERALS_PER_CLAUSE')
);

export const MAX_POSSIBLE_VARIABLES = Number(
  getEnvValue('MAX_POSSIBLE_VARIABLES')
);

export const TEST_DIFFICULTY = getEnvValue('TEST_DIFFICULTY');
