import * as fs from 'fs';
import path from 'path';
// import { createObjectCsvWriter } from 'csv-writer';

const resolutionResuts = JSON.parse(
  fs.readFileSync(path.join(__dirname, `resolution.results.json`), 'utf-8')
);

const dpResuts = JSON.parse(
  fs.readFileSync(path.join(__dirname, `dp.results.json`), 'utf-8')
);

const dpllResults = JSON.parse(
  fs.readFileSync(path.join(__dirname, `dpll.results.json`), 'utf-8')
);

function computeSummary(data: any): any {
  return data.map((category: any) => {
    const entries = category.data;

    const validEntries = entries.filter((d: any) => {
      const time = d.time;
      const memory = d.maxMemory;
      return time && memory;
    });

    const skippedEntries = entries.length - validEntries.length;

    const times = validEntries.map((result: any) => result.time);
    const memory = validEntries.map((result: any) => result.maxMemory);

    const avg = (arr: any[]) => {
      return arr.length === 0
        ? 0
        : arr.reduce((sum, val) => sum + Number(val), 0) / arr.length;
    };

    return {
      id: category.id,
      averageTime: avg(times).toFixed(3),
      maxTime: times.length ? Math.max(...times) : null,
      minTime: times.length ? Math.min(...times) : null,
      averageMemory: avg(memory).toFixed(3),
      maxMemory: memory.length ? Math.max(...memory) : null,
      minMemory: memory.length ? Math.min(...memory) : null,
      totalEntries: entries.length,
      validEntries: validEntries.length,
      skippedEntries: skippedEntries,
      numSAT: validEntries.filter((d: any) => d.sat === true).length,
      numUNSAT: validEntries.filter((d: any) => d.sat === false).length,
    };
  });
}

const resolutionSummary = {
  algo: 'Resolution',
  results: computeSummary(resolutionResuts),
};
const dpSummary = { algo: 'Davis-Putnam', results: computeSummary(dpResuts) };
const dpllSummary = {
  algo: 'Davis-Putnam-Logemann-Loveland',
  results: computeSummary(dpllResults),
};

function saveCSV(fileName: string, summary: any[]) {
  const header = [
    'id',
    'averageTime',
    'maxTime',
    'minTime',
    'averageMemory',
    'maxMemory',
    'minMemory',
    'totalEntries',
    'validEntries',
    'skippedEntries',
    'numSAT',
    'numUNSAT',
  ];

  const rows = summary.map((row) =>
    header.map((key) => (row[key] !== null ? row[key] : '')).join(',')
  );

  const csv = [header.join(','), ...rows].join('\n');
  fs.writeFileSync(path.join(__dirname, fileName), csv, 'utf-8');
}

saveCSV('resolution.summary.csv', resolutionSummary.results);
saveCSV('dp.summary.csv', dpSummary.results);
saveCSV('dpll.summary.csv', dpllSummary.results);

console.log('CSV summaries saved for Resolution, DP, and DPLL.');
