import { MEMORY_LIMIT, TIME_LIMIT } from '../config';
import {
  checkMemoryLimit,
  checkTimeLimit,
  getMemoryUsage,
  getPreciseTimestamp,
  getTime,
} from '../utils';
import { SatSolver } from './solver';

let start: bigint;
let maxMemory: number = getMemoryUsage();

export class ResolutionBasedSolver implements SatSolver {
  solve(clauses: string[][]): {
    sat: boolean;
    maxMemory: number;
  } {
    start = getPreciseTimestamp();
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
    let formula = new Set<string>();

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
      const newClauses = new Set<string>();

      const formulaArray = Array.from(formula);
      for (let i = 0; i < formulaArray.length; i++) {
        for (let j = i + 1; j < formulaArray.length; j++) {
          maxMemory = getMemoryUsage();
          checkMemoryLimit(MEMORY_LIMIT);
          checkTimeLimit(getTime(start, getPreciseTimestamp()), TIME_LIMIT);

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

  private resolveClausePair(clause1: string[], clause2: string[]): string[][] {
    const resolvents: string[][] = [];

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

  private negateLiteral(literal: string): string {
    return literal.startsWith('~') ? literal.substring(1) : '~' + literal;
  }

  private serializeClause(clause: string[]): string {
    return JSON.stringify([...clause].sort());
  }

  private deserializeClause(serialized: string): string[] {
    return JSON.parse(serialized);
  }
}
