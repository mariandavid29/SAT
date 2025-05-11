"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResolutionBasedSolver = void 0;
const config_1 = require("../config");
const utils_1 = require("../utils");
let start;
let maxMemory = (0, utils_1.getMemoryUsage)();
class ResolutionBasedSolver {
    solve(clauses) {
        start = (0, utils_1.getPreciseTimestamp)();
        if (clauses.length === 0) {
            return {
                sat: true,
                maxMemory: maxMemory,
            };
        }
        if (clauses.some((clause) => clause.length === 0)) {
            return {
                sat: false,
                maxMemory: maxMemory,
            };
        }
        let formula = new Set();
        for (const clause of clauses) {
            const clauseSet = new Set(clause);
            let isTautology = false;
            for (const literal of clauseSet) {
                if (clauseSet.has(this.negateLiteral(literal))) {
                    isTautology = true;
                    break;
                }
            }
            if (!isTautology) {
                formula.add(this.serializeClause([...clauseSet]));
            }
        }
        while (true) {
            const newClauses = new Set();
            const formulaArray = Array.from(formula);
            for (let i = 0; i < formulaArray.length; i++) {
                for (let j = i + 1; j < formulaArray.length; j++) {
                    maxMemory = (0, utils_1.getMemoryUsage)();
                    (0, utils_1.checkMemoryLimit)(config_1.MEMORY_LIMIT);
                    (0, utils_1.checkTimeLimit)((0, utils_1.getTime)(start, (0, utils_1.getPreciseTimestamp)()), config_1.TIME_LIMIT);
                    const clause1 = this.deserializeClause(formulaArray[i]);
                    const clause2 = this.deserializeClause(formulaArray[j]);
                    const resolvents = this.resolveClausePair(clause1, clause2);
                    for (const resolvent of resolvents) {
                        if (resolvent.length === 0) {
                            return {
                                sat: false,
                                maxMemory: maxMemory,
                            };
                        }
                        const serialized = this.serializeClause(resolvent);
                        if (!formula.has(serialized)) {
                            newClauses.add(serialized);
                        }
                    }
                }
            }
            if (newClauses.size === 0) {
                return {
                    sat: true,
                    maxMemory: maxMemory,
                };
            }
            for (const clause of newClauses) {
                formula.add(clause);
            }
        }
    }
    resolveClausePair(clause1, clause2) {
        const resolvents = [];
        for (const lit1 of clause1) {
            const negatedLit = this.negateLiteral(lit1);
            if (clause2.includes(negatedLit)) {
                const resolvent = [
                    ...clause1.filter((l) => l !== lit1),
                    ...clause2.filter((l) => l !== negatedLit),
                ];
                const uniqueResolvent = [...new Set(resolvent)];
                let isTautology = false;
                for (const lit of uniqueResolvent) {
                    if (uniqueResolvent.includes(this.negateLiteral(lit))) {
                        isTautology = true;
                        break;
                    }
                }
                if (!isTautology) {
                    resolvents.push(uniqueResolvent);
                }
            }
        }
        return resolvents;
    }
    negateLiteral(literal) {
        return literal.startsWith('~') ? literal.substring(1) : '~' + literal;
    }
    serializeClause(clause) {
        return JSON.stringify([...clause].sort());
    }
    deserializeClause(serialized) {
        return JSON.parse(serialized);
    }
}
exports.ResolutionBasedSolver = ResolutionBasedSolver;
