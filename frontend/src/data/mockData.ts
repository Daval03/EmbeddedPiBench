import type { Algorithm, MenuItem } from '../types';
import { Activity, Cpu, Zap, TrendingUp, Play } from 'lucide-react';

export const algorithms: Algorithm[] = [
  {
    id: 'algoritmo-1',
    name: 'Algoritmo de Leibniz',
    formula: 'π = 4 × (1 - 1/3 + 1/5 - 1/7 + 1/9 - ...)',
    description: 'Serie infinita para calcular π basada en la expansión de arctan(1)',
    complexity: 'O(n)',
    iterations: 1000000,
    digits: 5,
    time: 2.3,
    year: '1671',
    code: `def leibniz_pi(iterations):
    pi_approx = 0
    for i in range(iterations):
        term = (-1) ** i / (2 * i + 1)
        pi_approx += term
    return 4 * pi_approx`
  },
  {
    id: 'algoritmo-2', 
    name: 'Algoritmo de Nilakantha',
    formula: 'π = 3 + 4/(2×3×4) - 4/(4×5×6) + 4/(6×7×8) - ...',
    description: 'Serie que converge más rápido que Leibniz',
    complexity: 'O(n)',
    iterations: 500000,
    digits: 7,
    time: 1.8,
    year: '1500',
    code: `def nilakantha_pi(iterations):
    pi_approx = 3
    for i in range(1, iterations):
        term = 4 / ((2*i) * (2*i+1) * (2*i+2))
        if i % 2 == 1:
            pi_approx += term
        else:
            pi_approx -= term
    return pi_approx`
  },
  {
    id: 'algoritmo-3',
    name: 'Monte Carlo',
    formula: 'π ≈ 4 × (puntos dentro del círculo / puntos totales)',
    description: 'Método probabilístico usando puntos aleatorios',
    complexity: 'O(n)',
    iterations: 100000,
    digits: 3,
    time: 0.5,
    year: '1949',
    code: `import random

def monte_carlo_pi(iterations):
    inside_circle = 0
    for _ in range(iterations):
        x, y = random.random(), random.random()
        if x**2 + y**2 <= 1:
            inside_circle += 1
    return 4 * inside_circle / iterations`
  },
  {
    id: 'algoritmo-4',
    name: 'Algoritmo de Gauss-Legendre',
    formula: 'Iteración con medias aritmético-geométricas',
    description: 'Algoritmo muy rápido que duplica dígitos en cada iteración',
    complexity: 'O(log n)',
    iterations: 10,
    digits: 15,
    time: 0.1,
    year: '1975',
    code: `def gauss_legendre_pi(iterations):
    a = 1.0
    b = 1.0 / (2**0.5)
    t = 0.25
    p = 1.0
    
    for _ in range(iterations):
        a_next = (a + b) / 2
        b = (a * b) ** 0.5
        t -= p * (a - a_next) ** 2
        a = a_next
        p *= 2
    
    return (a + b) ** 2 / (4 * t)`
  },
  {
    id: 'algoritmo-5',
    name: 'Algoritmo de Chudnovsky',
    formula: '1/π = 12 × Σ ((-1)^k × (6k)! × (13591409 + 545140134k)) / ((3k)! × (k!)^3 × 640320^(3k + 3/2))',
    description: 'Algoritmo extremadamente rápido usado para récords mundiales',
    complexity: 'O(n log³ n)',
    iterations: 1,
    digits: 100,
    time: 0.8,
    year: '1988',
    code: `from math import factorial, sqrt

def chudnovsky_pi(digits):
    def term(k):
        return ((-1)**k * factorial(6*k) * (13591409 + 545140134*k)) / (
            factorial(3*k) * (factorial(k))**3 * (640320)**(3*k + 1.5)
        )
    
    pi_inv = sum(term(k) for k in range(digits//14 + 1))
    return 1 / (12 * pi_inv)`
  }
];

export const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Home', icon: Activity },
  { id: 'algorithms', label: 'Algoritmos', icon: Zap },
  { id: 'execution', label: 'Ejecución', icon: Play },
  { id: 'comparison', label: 'Comparación', icon: TrendingUp },
  { id: 'about', label: 'Sobre el Proyecto', icon: Cpu },
];