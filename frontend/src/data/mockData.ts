
import type { Algorithm, MenuItem } from '../types';

import { Activity, Cpu, Zap, TrendingUp, Play } from 'lucide-react';

export const algorithms: Algorithm[] = [
  {
    id: 'algoritmo-1',
    name: 'Nombre del Algoritmo 1',
    formula: 'Fórmula matemática aquí',
    description: 'Descripción del algoritmo',
    complexity: 'O(n)',
    iterations: 1000000,
    digits: 10,
    time: 0.5,
    year: '2000',
    code: `# Código Python aquí
def algoritmo():
    pass`
  },
  // Agregar más algoritmos aquí
];

export const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Activity },
  { id: 'algorithms', label: 'Algoritmos', icon: Zap },
  { id: 'execution', label: 'Ejecución', icon: Play },
  { id: 'comparison', label: 'Comparación', icon: TrendingUp },
  { id: 'about', label: 'Sobre el Proyecto', icon: Cpu },
];