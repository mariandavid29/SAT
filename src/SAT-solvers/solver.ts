/**
 * Interfata comuna pentru algoritmii de satisfiabilitate
 */
export interface SatSolver {
  solve(clauses: string[][] | []): {
    sat: boolean;
    maxMemory: number;
  };
}
