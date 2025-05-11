import * as fs from 'fs';
import * as path from 'path';
import { getPreciseTimestamp } from './utils';
import { DPBasedSolver } from './SAT-solvers/dp';

const baseFilePath = path.join(__dirname, 'tests');

const easyTests = JSON.parse(
  fs.readFileSync(path.join(baseFilePath, 'easy.tests.json'), 'utf-8')
) as any[];

const mediumTests = JSON.parse(
  fs.readFileSync(path.join(baseFilePath, 'medium.tests.json'), 'utf-8')
) as any[];

const hardTests = JSON.parse(
  fs.readFileSync(path.join(baseFilePath, 'hard.tests.json'), 'utf-8')
) as any[];

const dpSolver = new DPBasedSolver();
const output = [
  { id: 'Easy', data: [] as any[] },
  { id: 'Medium', data: [] as any[] },
  { id: 'Hard', data: [] as any[] },
];

console.log('Dp easy tests!');
for (const test of easyTests) {
  try {
    const start = getPreciseTimestamp();
    const res = dpSolver.solve(test);
    const end = getPreciseTimestamp();
    output[0].data.push({
      ...res,
      maxMemory: res.maxMemory.toFixed(3),
      time: (Number(end - start) / 1000000).toFixed(3),
    });
  } catch (error) {
    console.log('Test skipped', error);
    output[0].data.push({ sat: null, maxMemory: null, time: null });
  }
}

console.log('Dp medium tests!');
for (const test of mediumTests) {
  try {
    const start = getPreciseTimestamp();
    const res = dpSolver.solve(test);
    const end = getPreciseTimestamp();
    output[1].data.push({
      ...res,
      maxMemory: res.maxMemory.toFixed(3),
      time: (Number(end - start) / 1000000).toFixed(3),
    });
  } catch (error) {
    console.log('Test skipped', error);
    output[1].data.push({ sat: null, maxMemory: null, time: null });
  }
}

console.log('Dp hard tests!');
for (const test of hardTests) {
  try {
    const start = getPreciseTimestamp();
    const res = dpSolver.solve(test);
    const end = getPreciseTimestamp();
    output[2].data.push({
      ...res,
      maxMemory: res.maxMemory.toFixed(3),
      time: (Number(end - start) / 1000000).toFixed(3),
    });
  } catch (error) {
    console.log('Test skipped', error);
    output[2].data.push({ sat: null, maxMemory: null, time: null });
  }
}

const filePath = path.join(__dirname, 'dp.results.json');
fs.writeFileSync(filePath, JSON.stringify(output, null, 2), 'utf-8');
