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

export class DPLLBasedSolver implements SatSolver {
  solve(clauses: string[][] | []): {
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
    if (clauses.find((clause) => clause.length === 0)) {
      return {
        sat: false,
        maxMemory: maxMemory,
      };
    }

    const allLiterals = new Set<string>();
    const dpllClauses: [string, boolean][][] = clauses.map((clause) =>
      clause.map((literal) => {
        const isNegated = literal.startsWith('~');
        const name = isNegated ? literal.slice(1) : literal;
        allLiterals.add(name);
        return [name, isNegated];
      })
    );

    return this.dpll(dpllClauses, new Map<string, boolean>(), allLiterals);
  }

  private dpll(
    clauses: [string, boolean][][],
    assignment: Map<string, boolean>,
    unassigned: Set<string>
  ): {
    sat: boolean;
    maxMemory: number;
  } {
    maxMemory = Math.max(maxMemory, getMemoryUsage());
    checkMemoryLimit(MEMORY_LIMIT);
    checkTimeLimit(getTime(start, getPreciseTimestamp()), TIME_LIMIT);

    // Check if formula is already satisfied
    if (clauses.length === 0) {
      return {
        sat: true,
        maxMemory: maxMemory,
      };
    }

    // Check if formula contains empty clause (unsatisfiable)
    if (clauses.some((clause) => clause.length === 0)) {
      return {
        sat: false,
        maxMemory: maxMemory,
      };
    }

    // Apply unit propagation
    const unitResult = this.applyUnitPropagation(
      clauses,
      assignment,
      unassigned
    );
    if (unitResult !== null) {
      return unitResult; // Return early if conflict detected or all clauses satisfied
    }

    // Apply pure literal elimination
    const pureLiterals = this.findPureLiterals(clauses);
    let formulaChanged = false;

    for (const [name, isNegated] of pureLiterals) {
      if (unassigned.has(name)) {
        assignment.set(name, !isNegated);
        clauses = this.simplify(clauses, [name, isNegated]);
        unassigned.delete(name);
        formulaChanged = true;
      }
    }

    // If the formula changed, recur to check for new simplifications
    if (formulaChanged) {
      return this.dpll(clauses, assignment, unassigned);
    }

    // Check if formula is satisfied after simplification
    if (clauses.length === 0) {
      return {
        sat: true,
        maxMemory: maxMemory,
      };
    }

    // Check if formula is unsatisfiable after simplification
    if (clauses.some((clause) => clause.length === 0)) {
      return {
        sat: false,
        maxMemory: maxMemory,
      };
    }

    // Choose a variable for branching (first variable from shortest clause)
    const unassignedVars = new Set<string>();
    for (const clause of clauses) {
      for (const [name, _] of clause) {
        if (unassigned.has(name)) {
          unassignedVars.add(name);
        }
      }
    }

    // If no unassigned variables are left, the formula is unsatisfiable
    if (unassignedVars.size === 0) {
      return {
        sat: false,
        maxMemory: maxMemory,
      };
    }

    // Sort clauses by length and choose variable from shortest clause
    const shortestClause = [...clauses].sort((a, b) => a.length - b.length)[0];
    let branchVar = '';

    // Find the first unassigned variable in the shortest clause
    for (const [name, _] of shortestClause) {
      if (unassigned.has(name)) {
        branchVar = name;
        break;
      }
    }

    // If no suitable branching variable found in shortest clause, use first unassigned
    if (!branchVar && unassignedVars.size > 0) {
      branchVar = Array.from(unassignedVars)[0];
    }

    // Try both assignments for the chosen variable
    for (const value of [true, false]) {
      const newAssignment = new Map(assignment);
      newAssignment.set(branchVar, value);

      const newUnassigned = new Set([...unassigned]);
      newUnassigned.delete(branchVar);

      const result = this.dpll(
        this.simplify(clauses, [branchVar, !value]),
        newAssignment,
        newUnassigned
      );

      if (result.sat) {
        return {
          sat: true,
          maxMemory: Math.max(maxMemory, result.maxMemory),
        };
      }

      maxMemory = Math.max(maxMemory, result.maxMemory);
    }

    return {
      sat: false,
      maxMemory: maxMemory,
    };
  }

  private applyUnitPropagation(
    clauses: [string, boolean][][],
    assignment: Map<string, boolean>,
    unassigned: Set<string>
  ): { sat: boolean; maxMemory: number } | null {
    let unitClauses = this.findUnitClauses(clauses);
    let changed = false;

    // Handle contradictions in unit clauses
    const unitMap = new Map<string, boolean>();
    for (const [name, isNegated] of unitClauses) {
      if (unitMap.has(name) && unitMap.get(name) !== isNegated) {
        // Contradiction found - formula is unsatisfiable
        return {
          sat: false,
          maxMemory: maxMemory,
        };
      }
      unitMap.set(name, isNegated);
    }

    // Apply all unit clauses
    while (unitClauses.length > 0) {
      changed = true;
      for (const [name, isNegated] of unitClauses) {
        if (unassigned.has(name)) {
          assignment.set(name, !isNegated);
          clauses = this.simplify(clauses, [name, isNegated]);
          unassigned.delete(name);
        }
      }

      // Check if formula is satisfied or unsatisfiable after unit propagation
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

      // Find new unit clauses
      unitClauses = this.findUnitClauses(clauses);

      // Check for contradictions in new unit clauses
      for (const [name, isNegated] of unitClauses) {
        if (unitMap.has(name) && unitMap.get(name) !== isNegated) {
          return {
            sat: false,
            maxMemory: maxMemory,
          };
        }
        unitMap.set(name, isNegated);
      }
    }

    // Return null to indicate no definitive result yet
    return changed ? this.dpll(clauses, assignment, unassigned) : null;
  }

  private findPureLiterals(
    clauses: [string, boolean][][]
  ): [string, boolean][] {
    const positive = new Set<string>();
    const negative = new Set<string>();

    // Track all literals
    for (const clause of clauses) {
      for (const [name, isNegated] of clause) {
        if (isNegated) {
          negative.add(name);
        } else {
          positive.add(name);
        }
      }
    }

    // Find pure literals
    const pureLiterals: [string, boolean][] = [];

    // Variables appearing only as positive
    for (const name of positive) {
      if (!negative.has(name)) {
        pureLiterals.push([name, false]);
      }
    }

    // Variables appearing only as negative
    for (const name of negative) {
      if (!positive.has(name)) {
        pureLiterals.push([name, true]);
      }
    }

    return pureLiterals;
  }

  private findUnitClauses(clauses: [string, boolean][][]): [string, boolean][] {
    const units: [string, boolean][] = [];

    for (const clause of clauses) {
      if (clause.length === 1) {
        units.push(clause[0]);
      }
    }

    return units;
  }

  private simplify(
    clauses: [string, boolean][][],
    literal: [string, boolean]
  ): [string, boolean][][] {
    const [target, targetNeg] = literal;
    const newClauses: [string, boolean][][] = [];

    for (const clause of clauses) {
      let skip = false;
      const reduced: [string, boolean][] = [];

      for (const [name, isNegated] of clause) {
        if (name === target) {
          if (isNegated === targetNeg) {
            skip = true;
            break;
          }
          continue;
        }
        reduced.push([name, isNegated]);
      }

      if (!skip) {
        newClauses.push(reduced);
      }
    }
    return newClauses;
  }
}
