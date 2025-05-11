import { hrtime } from 'process';

export function checkMemoryLimit(memoryLimit: number): void {
  const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024;

  if (memoryUsage > memoryLimit) {
    throw new Error(`Memory limit of ${memoryLimit} exceeded.`);
  }
}

export function getMemoryUsage(): number {
  return process.memoryUsage().heapUsed / 1024 / 1024;
}

export function checkTimeLimit(time: number, timeLimit: number): void {
  if (time > timeLimit) {
    throw new Error(`Time limit of ${timeLimit} miliseconds exceeded.`);
  }
}

export function getTime(startTime: bigint, nowTime: bigint): number {
  return Number(nowTime - startTime) / 1000000;
}

export function calculateMemoryLimit(): number {
  let oldSpaceSize = Number(process.env.MAX_OLD_SPACE_SIZE ?? 100);

  return oldSpaceSize * 0.8;
}

export function getPreciseTimestamp(): bigint {
  return hrtime.bigint();
}

export function getEnvValue(envName: string): string {
  return process.env[envName] ?? '';
}

export function getRandomIntInclusive(min: number, max: number) {
  if (min > max) {
    throw new Error(`Problem: ${min} > ${max}`);
  }
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}
