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
const config_1 = require("../config");
const utils_1 = require("../utils");
const path_1 = __importDefault(require("path"));
function getRandomVariable() {
    const randomIndex = (0, utils_1.getRandomIntInclusive)(0, config_1.MAX_POSSIBLE_VARIABLES - 1);
    const varName = config_1.VARIABLES[randomIndex];
    const isNegated = !!(0, utils_1.getRandomIntInclusive)(0, 1);
    return isNegated ? `~${varName}` : varName;
}
function generateClause() {
    const clauseLength = (0, utils_1.getRandomIntInclusive)(config_1.MIN_LITERALS_PER_CLAUSE, config_1.MAX_LITERALS_PER_CLAUSE);
    const usedVars = new Set();
    const clause = [];
    while (clause.length < clauseLength) {
        const lit = getRandomVariable();
        if (!usedVars.has(lit)) {
            clause.push(lit);
        }
    }
    return clause;
}
function generateSATTest() {
    const numClauses = (0, utils_1.getRandomIntInclusive)(config_1.MIN_CLAUSES_PER_TEST, config_1.MAX_CLAUSES_PER_TEST);
    const test = [];
    for (let i = 0; i < numClauses; i++) {
        test.push(generateClause());
    }
    return test;
}
function generateTestSet() {
    const tests = [];
    for (let i = 0; i < config_1.NUM_TESTS; i++) {
        tests.push(generateSATTest());
    }
    return tests;
}
function writeTestsToFile(tests, fileName) {
    fs.writeFileSync(fileName, JSON.stringify(tests, null, 2), 'utf-8');
}
const tests = generateTestSet();
const filePath = path_1.default.join(__dirname, `${config_1.TEST_DIFFICULTY}.tests.json`);
writeTestsToFile(tests, filePath);
console.log(`Generated ${tests.length} SAT tests and saved to ${config_1.TEST_DIFFICULTY}.tests.json.`);
