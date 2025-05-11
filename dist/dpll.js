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
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const utils_1 = require("./utils");
const dpll_1 = require("./SAT-solvers/dpll");
const baseFilePath = path.join(__dirname, 'tests');
const easyTests = JSON.parse(fs.readFileSync(path.join(baseFilePath, 'easy.tests.json'), 'utf-8'));
const mediumTests = JSON.parse(fs.readFileSync(path.join(baseFilePath, 'medium.tests.json'), 'utf-8'));
const hardTests = JSON.parse(fs.readFileSync(path.join(baseFilePath, 'hard.tests.json'), 'utf-8'));
const dpllSolver = new dpll_1.DPLLBasedSolver();
const output = [
    { id: 'Easy', data: [] },
    { id: 'Medium', data: [] },
    { id: 'Hard', data: [] },
];
console.log('Dpll easy tests!');
for (const test of easyTests) {
    try {
        const start = (0, utils_1.getPreciseTimestamp)();
        const res = dpllSolver.solve(test);
        const end = (0, utils_1.getPreciseTimestamp)();
        output[0].data.push(Object.assign(Object.assign({}, res), { maxMemory: res.maxMemory.toFixed(3), time: (Number(end - start) / 1000000).toFixed(3) }));
    }
    catch (error) {
        console.log('Test skipped', error);
        output[0].data.push({ sat: null, maxMemory: null, time: null });
    }
}
console.log('Dpll medium tests!');
for (const test of mediumTests) {
    try {
        const start = (0, utils_1.getPreciseTimestamp)();
        const res = dpllSolver.solve(test);
        const end = (0, utils_1.getPreciseTimestamp)();
        output[1].data.push(Object.assign(Object.assign({}, res), { maxMemory: res.maxMemory.toFixed(3), time: (Number(end - start) / 1000000).toFixed(3) }));
    }
    catch (error) {
        console.log('Test skipped', error);
        output[1].data.push({ sat: null, maxMemory: null, time: null });
    }
}
console.log('Dpll hard tests!');
for (const test of hardTests) {
    try {
        const start = (0, utils_1.getPreciseTimestamp)();
        const res = dpllSolver.solve(test);
        const end = (0, utils_1.getPreciseTimestamp)();
        output[2].data.push(Object.assign(Object.assign({}, res), { maxMemory: res.maxMemory.toFixed(3), time: (Number(end - start) / 1000000).toFixed(3) }));
    }
    catch (error) {
        console.log('Test skipped', error);
        output[2].data.push({ sat: null, maxMemory: null, time: null });
    }
}
const filePath = path.join(__dirname, 'dpll.results.json');
fs.writeFileSync(filePath, JSON.stringify(output, null, 2), 'utf-8');
