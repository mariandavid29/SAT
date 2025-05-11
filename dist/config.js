"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEST_DIFFICULTY = exports.MAX_POSSIBLE_VARIABLES = exports.MAX_LITERALS_PER_CLAUSE = exports.MIN_LITERALS_PER_CLAUSE = exports.MAX_CLAUSES_PER_TEST = exports.MIN_CLAUSES_PER_TEST = exports.NUM_TESTS = exports.VARIABLES = exports.TIME_LIMIT = exports.MEMORY_LIMIT = void 0;
const utils_1 = require("./utils");
exports.MEMORY_LIMIT = (0, utils_1.calculateMemoryLimit)();
exports.TIME_LIMIT = 10000;
exports.VARIABLES = [
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
exports.NUM_TESTS = 100;
exports.MIN_CLAUSES_PER_TEST = Number((0, utils_1.getEnvValue)('MIN_CLAUSES_PER_TEST'));
exports.MAX_CLAUSES_PER_TEST = Number((0, utils_1.getEnvValue)('MAX_CLAUSES_PER_TEST'));
exports.MIN_LITERALS_PER_CLAUSE = Number((0, utils_1.getEnvValue)('MIN_LITERALS_PER_CLAUSE'));
exports.MAX_LITERALS_PER_CLAUSE = Number((0, utils_1.getEnvValue)('MAX_LITERALS_PER_CLAUSE'));
exports.MAX_POSSIBLE_VARIABLES = Number((0, utils_1.getEnvValue)('MAX_POSSIBLE_VARIABLES'));
exports.TEST_DIFFICULTY = (0, utils_1.getEnvValue)('TEST_DIFFICULTY');
