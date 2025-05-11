"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
// import { createObjectCsvWriter } from 'csv-writer';
const resolutionResuts = JSON.parse(fs.readFileSync(path_1.default.join(__dirname, `resolution.results.json`), 'utf-8'));
const dpResuts = JSON.parse(fs.readFileSync(path_1.default.join(__dirname, `dp.results.json`), 'utf-8'));
const dpllResults = JSON.parse(fs.readFileSync(path_1.default.join(__dirname, `dpll.results.json`), 'utf-8'));
function computeSummary(data) {
    return data.map((category) => {
        const entries = category.data;
        const validEntries = entries.filter((d) => {
            const time = d.time;
            const memory = d.maxMemory;
            return time && memory;
        });
        const skippedEntries = entries.length - validEntries.length;
        const times = validEntries.map((result) => result.time);
        const memory = validEntries.map((result) => result.maxMemory);
        const avg = (arr) => {
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
            numSAT: validEntries.filter((d) => d.sat === true).length,
            numUNSAT: validEntries.filter((d) => d.sat === false).length,
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
function saveCSV(fileName, summary) {
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
    const rows = summary.map((row) => header.map((key) => (row[key] !== null ? row[key] : '')).join(','));
    const csv = [header.join(','), ...rows].join('\n');
    fs.writeFileSync(path_1.default.join(__dirname, fileName), csv, 'utf-8');
}
saveCSV('resolution.summary.csv', resolutionSummary.results);
saveCSV('dp.summary.csv', dpSummary.results);
saveCSV('dpll.summary.csv', dpllSummary.results);
console.log('CSV summaries saved for Resolution, DP, and DPLL.');
