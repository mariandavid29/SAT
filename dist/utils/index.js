"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkMemoryLimit = checkMemoryLimit;
exports.getMemoryUsage = getMemoryUsage;
exports.checkTimeLimit = checkTimeLimit;
exports.getTime = getTime;
exports.calculateMemoryLimit = calculateMemoryLimit;
exports.getPreciseTimestamp = getPreciseTimestamp;
exports.getEnvValue = getEnvValue;
exports.getRandomIntInclusive = getRandomIntInclusive;
const process_1 = require("process");
function checkMemoryLimit(memoryLimit) {
    const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024;
    if (memoryUsage > memoryLimit) {
        throw new Error(`Memory limit of ${memoryLimit} exceeded.`);
    }
}
function getMemoryUsage() {
    return process.memoryUsage().heapUsed / 1024 / 1024;
}
function checkTimeLimit(time, timeLimit) {
    if (time > timeLimit) {
        throw new Error(`Time limit of ${timeLimit} miliseconds exceeded.`);
    }
}
function getTime(startTime, nowTime) {
    return Number(nowTime - startTime) / 1000000;
}
function calculateMemoryLimit() {
    var _a;
    let oldSpaceSize = Number((_a = process.env.MAX_OLD_SPACE_SIZE) !== null && _a !== void 0 ? _a : 100);
    return oldSpaceSize * 0.8;
}
function getPreciseTimestamp() {
    return process_1.hrtime.bigint();
}
function getEnvValue(envName) {
    var _a;
    return (_a = process.env[envName]) !== null && _a !== void 0 ? _a : '';
}
function getRandomIntInclusive(min, max) {
    if (min > max) {
        throw new Error(`Problem: ${min} > ${max}`);
    }
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}
