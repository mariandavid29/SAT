"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
(0, child_process_1.spawn)('node', ['--max-old-space-size=4096', path_1.default.join(__dirname, 'resolution.js')], {
    env: Object.assign({}, process.env),
    stdio: 'inherit',
});
(0, child_process_1.spawn)('node', ['--max-old-space-size=4096', path_1.default.join(__dirname, 'dpll.js')], {
    env: Object.assign({}, process.env),
    stdio: 'inherit',
});
(0, child_process_1.spawn)('node', ['--max-old-space-size=4096', path_1.default.join(__dirname, 'dp.js')], {
    env: Object.assign({}, process.env),
    stdio: 'inherit',
});
