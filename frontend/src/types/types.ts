// types.ts
interface Formula {
  id: string;
  name: string;
  formula: string;
  description: string;
  deepExplanation: string;
  convergence: string;
  applications: string;
  complexity: string;
}

interface Estimation {
  id: number;
  algorithm: string;
  pi_estimate: number;
  correct_digits: number;
  iterations: number;
  time_seconds: number;
  iterations_per_second: number;
  absolute_error: number;
  type: AlgorithmType;
}

interface Algorithm {
  name: string;
  digits: number;
  time: number;
  color: string;
}

interface FooterProps {
  companyName: string;
  year: number;
}

interface AlgorithmInfo {
  name: string;
  description?: string;
  code: string;
  type: string;
  
}

interface AlgorithmCardProps {
  algorithm: AlgorithmInfo;
  className?: string;
}

interface FormulaCardProps {
  formulas: Formula[];
  onFormulaSelect: (formula: Formula) => void;
}

interface FormulaModalProps {
  formula: Formula;
  onClose: () => void;
}

type AlgorithmType = "Probability" | "Infinite Series" | "Numerical Methods";

export {Algorithm, Estimation, Formula, AlgorithmType, FooterProps, 
  AlgorithmInfo, AlgorithmCardProps, FormulaCardProps, FormulaModalProps };