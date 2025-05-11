import * as fs from 'fs';
import {
  MAX_CLAUSES_PER_TEST,
  MAX_LITERALS_PER_CLAUSE,
  MAX_POSSIBLE_VARIABLES,
  MIN_CLAUSES_PER_TEST,
  MIN_LITERALS_PER_CLAUSE,
  NUM_TESTS,
  TEST_DIFFICULTY,
  VARIABLES,
} from '../config';
import { getRandomIntInclusive } from '../utils';
import path from 'path';

function getRandomVariable(): string {
  const randomIndex = getRandomIntInclusive(0, MAX_POSSIBLE_VARIABLES - 1);
  const varName = VARIABLES[randomIndex];
  const isNegated = !!getRandomIntInclusive(0, 1);
  return isNegated ? `~${varName}` : varName;
}

function generateClause(): string[] {
  const clauseLength = getRandomIntInclusive(
    MIN_LITERALS_PER_CLAUSE,
    MAX_LITERALS_PER_CLAUSE
  );
  const usedVars = new Set<string>();
  const clause: string[] = [];

  while (clause.length < clauseLength) {
    const lit = getRandomVariable();

    if (!usedVars.has(lit)) {
      clause.push(lit);
    }
  }

  return clause;
}

function generateSATTest(): string[][] {
  const numClauses = getRandomIntInclusive(
    MIN_CLAUSES_PER_TEST,
    MAX_CLAUSES_PER_TEST
  );
  const test: string[][] = [];

  for (let i = 0; i < numClauses; i++) {
    test.push(generateClause());
  }

  return test;
}

function generateTestSet(): any[] {
  const tests: any[] = [];
  for (let i = 0; i < NUM_TESTS; i++) {
    tests.push(generateSATTest());
  }
  return tests;
}

function writeTestsToFile(tests: any[], fileName: string) {
  fs.writeFileSync(fileName, JSON.stringify(tests, null, 2), 'utf-8');
}

const tests = generateTestSet();
const filePath = path.join(__dirname, `${TEST_DIFFICULTY}.tests.json`);
writeTestsToFile(tests, filePath);

console.log(
  `Generated ${tests.length} SAT tests and saved to ${TEST_DIFFICULTY}.tests.json.`
);
