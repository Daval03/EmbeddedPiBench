import type { LucideIcon } from 'lucide-react';

export interface Algorithm {
  id: string;
  name: string;
  formula: string;
  description: string;
  complexity: string;
  iterations: number;
  digits: number;
  time: number;
  year: string;
  code: string;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface DashboardProps {
  piDigits: string;
  algorithms: Algorithm[];
}

export interface AlgorithmsProps {
  algorithms: Algorithm[];
  activeAlgorithm: string;
  setActiveAlgorithm: (id: string) => void;
}

export interface ExecutionProps {
  algorithms: Algorithm[];
}

export interface ComparisonProps {
  algorithms: Algorithm[];
}