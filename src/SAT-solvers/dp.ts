import { SatSolver } from './solver';
import { MEMORY_LIMIT, TIME_LIMIT } from '../config';
import {
  checkMemoryLimit,
  checkTimeLimit,
  getMemoryUsage,
  getPreciseTimestamp,
  getTime,
} from '../utils';

let start: bigint;
let maxMemory: number = getMemoryUsage();

export class DPBasedSolver implements SatSolver {
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

    let formula = this.removeTautologies(clauses.map((c) => [...c]));

    while (formula.length > 0) {
      const unitResult = this.applyUnitPropagation(formula);
      if (unitResult === false) {
        return {
          sat: false,
          maxMemory: maxMemory,
        };
      }
      formula = unitResult;

      if (formula.length === 0) {
        return {
          sat: true,
          maxMemory: maxMemory,
        };
      }

      formula = this.applyPureLiteralRule(formula);

      if (formula.length === 0) {
        return {
          sat: true,
          maxMemory: maxMemory,
        };
      }

      const variable = this.chooseVariable(formula);

      const resolutionResult = this.resolveOnVariable(formula, variable);

      if (resolutionResult === false) {
        return {
          sat: false,
          maxMemory: maxMemory,
        };
      }

      formula = resolutionResult;
    }

    return {
      sat: true,
      maxMemory: maxMemory,
    };
  }

  private removeTautologies(clauses: string[][]): string[][] {
    return clauses.filter((clause) => {
      const literals = new Set(clause);
      for (const literal of literals) {
        if (literals.has(this.negateLiteral(literal))) {
          return false;
        }
      }
      return true;
    });
  }

  private applyUnitPropagation(clauses: string[][]): string[][] | false {
    let formula = [...clauses];
    let unitClauses = formula.filter((clause) => clause.length === 1);

    while (unitClauses.length > 0) {
      const unit = unitClauses[0][0];
      const negatedUnit = this.negateLiteral(unit);

      formula = formula.filter((clause) => !clause.includes(unit));

      formula = formula.map((clause) =>
        clause.filter((lit) => lit !== negatedUnit)
      );

      if (formula.some((clause) => clause.length === 0)) {
        return false;
      }

      unitClauses = formula.filter((clause) => clause.length === 1);
    }

    return formula;
  }

  private applyPureLiteralRule(clauses: string[][]): string[][] {
    const literals = new Set<string>();
    const negatedLiterals = new Set<string>();

    for (const clause of clauses) {
      for (const literal of clause) {
        if (literal.startsWith('~')) {
          negatedLiterals.add(literal);
          literals.add(this.negateLiteral(literal));
        } else {
          literals.add(literal);
          negatedLiterals.add(this.negateLiteral(literal));
        }
      }
    }

    const pureLiterals = new Set<string>();
    for (const literal of literals) {
      if (!literals.has(this.negateLiteral(literal))) {
        pureLiterals.add(literal);
      }
    }

    for (const literal of negatedLiterals) {
      if (!negatedLiterals.has(this.negateLiteral(literal))) {
        pureLiterals.add(literal);
      }
    }

    if (pureLiterals.size > 0) {
      return clauses.filter(
        (clause) => !clause.some((literal) => pureLiterals.has(literal))
      );
    }

    return clauses;
  }

  private chooseVariable(clauses: string[][]): string {
    const variableCounts = new Map<string, number>();

    for (const clause of clauses) {
      for (const literal of clause) {
        const variable = this.getVariable(literal);
        variableCounts.set(variable, (variableCounts.get(variable) || 0) + 1);
      }
    }

    let maxVar = '';
    let maxCount = 0;

    for (const [variable, count] of variableCounts.entries()) {
      if (count > maxCount) {
        maxVar = variable;
        maxCount = count;
      }
    }

    return maxVar;
  }

  private resolveOnVariable(
    clauses: string[][],
    variable: string
  ): string[][] | false {
    const positiveClauses: string[][] = [];
    const negativeClauses: string[][] = [];
    const otherClauses: string[][] = [];

    for (const clause of clauses) {
      if (clause.includes(variable)) {
        positiveClauses.push(clause);
      } else if (clause.includes(`~${variable}`)) {
        negativeClauses.push(clause);
      } else {
        otherClauses.push(clause);
      }
    }

    const resolvents: string[][] = [];

    for (const posClause of positiveClauses) {
      for (const negClause of negativeClauses) {
        maxMemory = getMemoryUsage();
        checkMemoryLimit(MEMORY_LIMIT);
        checkTimeLimit(getTime(start, getPreciseTimestamp()), TIME_LIMIT);
        const resolvent = [
          ...posClause.filter((lit) => lit !== variable),
          ...negClause.filter((lit) => lit !== `~${variable}`),
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
          if (uniqueResolvent.length === 0) {
            return false;
          }

          resolvents.push(uniqueResolvent);
        }
      }
    }

    return [...otherClauses, ...resolvents];
  }

  private getVariable(literal: string): string {
    return literal.startsWith('~') ? literal.substring(1) : literal;
  }

  private negateLiteral(literal: string): string {
    return literal.startsWith('~') ? literal.substring(1) : `~${literal}`;
  }
}
