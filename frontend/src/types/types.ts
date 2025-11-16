// types.ts
export interface Formula {
  id: string;
  name: string;
  formula: string;
  description: string;
  deepExplanation: string;
  convergence: string;
  applications: string;
  complexity: string;
}

export interface Estimation {
  id: number;
  algorithm: string;
  pi_estimate: number;
  correct_digits: number;
  iterations: number;
  time_seconds: number;
  iterations_per_second: number;
  absolute_error: number;
  type: "Probability" | "Infinite Series" | "Numerical Methods";
}