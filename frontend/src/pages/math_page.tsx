import React, { useState } from 'react';
import { BookOpen, Sigma, TrendingUp, Info } from 'lucide-react';
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

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

const formulasData: Formula[] = [
  {
    id: 'bbp',
    name: 'Bailey-Borwein-Plouffe (BBP)',
    formula: '\\pi = \\sum_{k=0}^{\\infty} \\frac{1}{16^k} \\left( \\frac{4}{8k+1} - \\frac{2}{8k+4} - \\frac{1}{8k+5} - \\frac{1}{8k+6} \\right)',

    description: 'La fórmula BBP es revolucionaria porque permite calcular dígitos hexadecimales de π en cualquier posición sin necesidad de calcular los anteriores.',
    deepExplanation: 'Descubierta en 1995 por Simon Plouffe, esta fórmula utiliza una base 16 que permite la extracción de dígitos específicos. La clave está en que cada término de la serie puede calcularse módulo 16ᵏ, lo que permite evaluar dígitos individuales mediante aritmética modular. Esta propiedad hace que π sea un número "normalmente distribuido" en base 16.',
    convergence: 'Convergencia lineal: cada término añade aproximadamente 1.2 dígitos hexadecimales',
    applications: 'Verificación de cálculos de π, criptografía, generación de números pseudoaleatorios',
    complexity: 'O(n) para calcular n dígitos específicos'
  },
  {
    id: 'chudnovsky',
    name: 'Algoritmo de Chudnovsky',
    formula: '\\frac{1}{\\pi} = \\frac{12}{\\sqrt{640320^3}} \\sum_{k=0}^{\\infty} \\frac{(-1)^k (6k)! (13591409 + 545140134k)}{(3k)! (k!)^3 (640320^{3k})}',
    description: 'El algoritmo más rápido conocido para calcular billones de dígitos de π. Cada término adiciona aproximadamente 14 dígitos decimales correctos.',
    deepExplanation: 'Desarrollado por los hermanos Chudnovsky en 1988, esta fórmula se basa en la teoría de números complejos y funciones modulares. El número 640320 no es arbitrario: está relacionado con el j-invariante de curvas elípticas. La serie converge extraordinariamente rápido debido a la estructura algebraica subyacente de las formas modulares de Ramanujan.',
    convergence: 'Convergencia superlineal: ~14.18 dígitos decimales por término',
    applications: 'Récords mundiales de cálculo de π, verificación de supercomputadoras, tests de precisión numérica',
    complexity: 'O(n²) para n dígitos debido a la multiplicación de grandes números'
  },
  {
    id: 'gauss_legendre',
    name: 'Gauss-Legendre',
    formula: `
    \\begin{aligned}
    a_{n+1} &= \\frac{a_n + b_n}{2},\\\\
    b_{n+1} &= \\sqrt{a_n b_n},\\\\
    t_{n+1} &= t_n - p_n(a_n - a_{n+1})^2,\\\\
    p_{n+1} &= 2p_n, \\\\
    \\pi &\\approx \\frac{(a_n + b_n)^2}{4t_n}
    \\end{aligned}
    `,
    description: 'Algoritmo iterativo que duplica el número de dígitos correctos en cada iteración, basado en la media aritmético-geométrica.',
    deepExplanation: 'Este método combina dos conceptos profundos: la media aritmético-geométrica (AGM) estudiada por Gauss y Legendre, y la integral elíptica completa. La convergencia cuadrática significa que si una iteración da 10 dígitos correctos, la siguiente dará 20, luego 40, 80, etc. El algoritmo requiere operaciones con raíces cuadradas de alta precisión, lo que lo hace costoso computacionalmente pero extremadamente eficiente en términos de iteraciones.',
    convergence: 'Convergencia cuadrática: duplica dígitos correctos por iteración',
    applications: 'Cálculos de precisión extrema, benchmarking de sistemas numéricos',
    complexity: 'O(M(n) log n) donde M(n) es el costo de multiplicar números de n dígitos'
  },
  {
    id: 'ramanujan',
    name: 'Serie de Ramanujan',
    formula: '\\frac{1}{\\pi} = \\frac{2\\sqrt{2}}{9801} \\sum_{k=0}^{\\infty} \\frac{(4k)! (1103 + 26390k)}{(k!)^4 (396^{4k})}',
    description: 'Serie descubierta por el matemático indio Srinivasa Ramanujan, converge a razón de 8 dígitos por término.',
    deepExplanation: 'Ramanujan descubrió esta fórmula en 1914 sin demostración formal. Se basa en la teoría de formas modulares y ecuaciones diferenciales hipergeométricas. Los números 1103 y 26390 provienen de propiedades profundas de funciones elípticas. Esta serie fue precursora del algoritmo de Chudnovsky y demuestra la intuición extraordinaria de Ramanujan sobre las propiedades de π.',
    convergence: 'Convergencia rápida: ~8 dígitos decimales por término',
    applications: 'Cálculos de precisión media-alta, educación matemática',
    complexity: 'O(n²) similar a Chudnovsky pero con constantes menores'
  },
  {
    id: 'monte_carlo',
    name: 'Método de Monte Carlo',
    formula: '\\pi \\approx 4 \\cdot \\frac{N_{\\text{círculo}}}{N_{\\text{total}}} \\quad \\text{donde } x^2+y^2 \\le 1',
    description: 'Método probabilístico que estima π mediante simulación de lanzamientos aleatorios de puntos.',
    deepExplanation: 'Basado en el principio de que la probabilidad de que un punto aleatorio caiga dentro de un círculo inscrito en un cuadrado es proporcional a sus áreas. La razón de áreas es πr²/(2r)² = π/4. Este método ilustra la conexión entre geometría, probabilidad y análisis numérico. La precisión mejora con √n puntos según el teorema del límite central, haciendo que sea ineficiente para alta precisión pero excelente para demostración pedagógica.',
    convergence: 'Convergencia probabilística: O(1/√n) - muy lenta',
    applications: 'Enseñanza, visualización, introducción a métodos estocásticos',
    complexity: 'O(n) pero con constante probabilística grande'
  },
  {
    id: 'leibniz',
    name: 'Serie de Leibniz-Gregory',
    formula: '\\pi = 4 \\sum_{n=0}^{\\infty} \\frac{(-1)^n}{2n+1} = 4 \\left(1 - \\frac{1}{3} + \\frac{1}{5} - \\frac{1}{7} + \\dots \\right)',
    description: 'La serie más simple para calcular π, descubierta independientemente por Leibniz y Gregory en el siglo XVII.',
    deepExplanation: 'Esta serie proviene de la expansión en serie de Taylor de arctan(x) evaluada en x=1. Es elegante pero impráctica: necesitas ~5 mil millones de términos para obtener 10 dígitos correctos. La alternancia de signos (-1)ⁿ crea cancelaciones que ralentizan la convergencia. Históricamente importante porque fue una de las primeras fórmulas analíticas para π y conecta π con funciones trigonométricas inversas.',
    convergence: 'Convergencia muy lenta: O(1/n) - necesita millones de términos',
    applications: 'Educación matemática, demostración de series infinitas',
    complexity: 'O(n) pero con convergencia extremadamente lenta'
  },
  {
    id: 'nilakantha',
    name: 'Serie de Nilakantha',
    formula: '\\pi = 3 + 4 \\sum_{n=1}^{\\infty} \\frac{(-1)^{n+1}}{(2n)(2n+1)(2n+2)}',
    description: 'Fórmula india del siglo XV que converge más rápido que la serie de Leibniz.',
    deepExplanation: 'Desarrollada por el matemático Nilakantha Somayaji en Kerala, India. Esta serie comienza en 3 (una aproximación inicial de π) y añade correcciones alternantes. El denominador es el producto de tres enteros consecutivos, lo que acelera la convergencia comparada con Leibniz. Representa un avance significativo en la matemática india medieval y muestra conocimiento sofisticado de series infinitas antes del cálculo europeo.',
    convergence: 'Convergencia moderada: O(1/n³) - más rápida que Leibniz',
    applications: 'Historia de las matemáticas, algoritmos educativos',
    complexity: 'O(n) con mejor convergencia que Leibniz'
  },
  {
    id: 'buffon',
    name: 'Aguja de Buffon',
    formula: `
    \\pi \\approx \\frac{2Ln}{td}, \\\\
    P(\\text{cruce}) = \\frac{2L}{\\pi d}
    `,
    description: 'Experimento probabilístico del siglo XVIII que relaciona π con la geometría de agujas lanzadas sobre líneas paralelas.',
    deepExplanation: 'Propuesto por Georges-Louis Leclerc, Comte de Buffon en 1777, es uno de los primeros problemas de probabilidad geométrica. La probabilidad de que una aguja de longitud L cruce una línea cuando la distancia entre líneas es d≥L se calcula mediante integración sobre todos los ángulos posibles. Este método conecta probabilidad, geometría integral y π de manera sorprendente, aunque es muy ineficiente computacionalmente.',
    convergence: 'Convergencia estocástica: O(1/√n) similar a Monte Carlo',
    applications: 'Enseñanza de probabilidad geométrica, experimentos físicos',
    complexity: 'O(n) con alta varianza estadística'
  },
  {
    id: 'borwein',
    name: 'Algoritmos de Borwein',
    formula: `
    \\begin{aligned}
    a_{n+1} &= \\frac{1 + y_n}{1 + \\sqrt{1 - y_n^4}},\\\\
    y_{n+1} &= 1 - (1 - y_n^4)^{1/4}
    \\end{aligned}
    \\text{Convergencia de orden } 4.
    `,
    description: 'Familia de algoritmos iterativos desarrollados por los hermanos Borwein con convergencia de alto orden.',
    deepExplanation: 'Jonathan y Peter Borwein desarrollaron múltiples algoritmos en los años 80-90 con diferentes órdenes de convergencia (cuadrática, cúbica, cuártica, etc.). Estos métodos se basan en identidades modulares y la teoría de la AGM. El algoritmo cuártico cuadruplica los dígitos correctos en cada iteración, lo que lo hace extremadamente eficiente. Requiere cálculos con raíces cuartas de alta precisión.',
    convergence: 'Convergencia cuártica: cuadruplica dígitos por iteración',
    applications: 'Cálculos de alta precisión, investigación en teoría de números',
    complexity: 'O(M(n) log n) eficiente para precisión moderada-alta'
  },
  {
    id: 'euler',
    name: 'Serie de Euler (ζ(2))',
    formula: '\\pi = \\sqrt{6 \\cdot \\sum_{k=1}^{\\infty} \\frac{1}{k^2}}',

    description: 'Este método aproxima π utilizando la serie de Euler para la función zeta de Riemann evaluada en 2, donde se sabe que ζ(2) = π²/6.',
    deepExplanation: 'En lugar de usar la identidad clásica de Euler como e^(iπ) + 1 = 0 o una integral trigonométrica, aquí se implementa la famosa serie de Euler: sum_{k=1..∞} 1/k² = π²/6. El programa calcula una suma parcial y al final toma la raíz cuadrada multiplicada por 6 para aproximar π.',
    convergence: 'Convergencia moderada (O(1/n²)), más rápida que series como Leibniz.',
    applications: 'Introducción a la función zeta de Riemann, aproximaciones numéricas básicas.',
    complexity: 'O(n)'
  },
  {
    id: 'euler_kahan',
    name: 'Serie de Euler con Compensación Kahan',
    formula: `
    \\begin{aligned}
    S &= 0, \\\\
    c &= 0, \\\\
    \\text{para } k = 1 \\ldots n: \\\\
    &\\quad y = \\frac{1}{k^2} - c, \\\\
    &\\quad t = S + y, \\\\
    &\\quad c = (t - S) - y, \\\\
    &\\quad S = t, \\\\
    \\pi \\approx \\sqrt{6S}
    \\end{aligned}
    `,
    description: 'Variante mejorada de la serie de Euler que utiliza la suma compensada de Kahan para reducir errores numéricos en aritmética de punto flotante.',
    deepExplanation: 'Esta versión usa la misma serie que la entrada anterior (ζ(2)), pero incorpora el algoritmo de suma compensada de Kahan. Este algoritmo mantiene un término de corrección que acumula los errores de redondeo, lo que permite obtener una aproximación más precisa cuando se calculan miles o millones de términos.',
    convergence: 'Convergencia matemática igual a Euler, pero con mucha mayor estabilidad numérica.',
    applications: 'Computación de alta precisión, análisis numérico, manejo de errores de redondeo.',
    complexity: 'O(n) con precisión mejorada'
  },
  {
    id: 'coprimes',
    name: 'Método de Coprimos',
    formula: '\\frac{\\pi^2}{6} = \\lim_{n \\to \\infty} \\frac{n^2}{\\#\\{(a,b): 1\\le a,b\\le n,\\,\\gcd(a,b)=1\\}}',
    description: 'Método basado en la probabilidad de que dos enteros aleatorios sean coprimos (sin factores comunes).',
    deepExplanation: 'Este método conecta π con la teoría de números a través de la función zeta de Riemann: ζ(2) = π²/6. La probabilidad de que dos enteros positivos aleatorios sean coprimos es exactamente 6/π². Esto se demuestra usando el producto de Euler sobre primos: ∏(1-1/p²) = 6/π². El método estima esta probabilidad mediante conteo de pares coprimos en rangos finitos, usando el algoritmo de Euclides para calcular MCD.',
    convergence: 'Convergencia probabilística: O(1/√n) con alta varianza',
    applications: 'Teoría de números, criptografía (generación de claves RSA)',
    complexity: 'O(n² log n) debido al cálculo de múltiples MCD'
  }
];



// const FormulasPage = () => {
//   const [selectedFormula, setSelectedFormula] = useState<Formula | null>(null);
//   const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});


//   const toggleExpand = (id: string) => {
//     setExpandedCards(prev => ({
//       ...prev,
//       [id]: !prev[id]
//     }));
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
//       <div className="container mx-auto px-4 py-12">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <div className="flex items-center justify-center gap-3 mb-4">
//             <Sigma className="w-12 h-12 text-purple-400" />
//             <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
//               Fundamentos Matemáticos de π
//             </h1>
//           </div>
//           <p className="text-xl text-slate-300 max-w-3xl mx-auto">
//             Exploración profunda de las fórmulas, algoritmos y teorías matemáticas 
//             detrás del cálculo de la constante más fascinante de las matemáticas
//           </p>
//         </div>

//         {/* Formula Cards Grid */}
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {formulasData.map((formula) => (
//             <div
//               key={formula.id}
//               className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer"
//               onClick={() => setSelectedFormula(formula)}
//             >
//               <div className="flex items-start justify-between mb-4">
//                 <h3 className="text-xl font-bold text-purple-300">{formula.name}</h3>
//                 <BookOpen className="w-5 h-5 text-purple-400 flex-shrink-0" />
//               </div>
              
//               <div className="bg-slate-900/50 rounded p-3 mb-4 font-mono text-sm text-slate-300 overflow-x-auto">
//                 {formula.formula.split('\n').map((line, i) => (
//                   <div key={i} className="whitespace-nowrap">{line}</div>
//                 ))}
//               </div>

//               <p className="text-slate-400 text-sm mb-4">{formula.description}</p>

//               <div className="flex items-center gap-2 text-xs">
//                 <TrendingUp className="w-4 h-4 text-green-400" />
//                 <span className="text-slate-400">{formula.convergence}</span>
//               </div>

//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setSelectedFormula(formula);
//                 }}
//                 className="mt-4 w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-sm font-medium"
//               >
//                 Ver Detalles Completos
//               </button>
//             </div>
//           ))}
//         </div>

//         {/* Detailed Modal */}
//         {selectedFormula && (
//           <div
//             className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
//             onClick={() => setSelectedFormula(null)}
//           >
//             <div
//               className="bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-700"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-t-2xl">
//                 <div className="flex items-start justify-between">
//                   <div>
//                     <h2 className="text-3xl font-bold mb-2">{selectedFormula.name}</h2>
//                     <p className="text-purple-100">{selectedFormula.description}</p>
//                   </div>
//                   <button
//                     onClick={() => setSelectedFormula(null)}
//                     className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
//                   >
//                     ✕
//                   </button>
//                 </div>
//               </div>

//               <div className="p-6 space-y-6">
//                 {/* Formula */}
//                 <div>
//                   <h3 className="text-lg font-semibold text-purple-300 mb-3 flex items-center gap-2">
//                     <Sigma className="w-5 h-5" />
//                     Fórmula Matemática
//                   </h3>
//                   <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-slate-200 overflow-x-auto border border-slate-700">
//                     {selectedFormula.formula.split('\n').map((line, i) => (
//                       <div key={i} className="mb-1">{line}</div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Deep Explanation */}
//                 <div>
//                   <h3 className="text-lg font-semibold text-purple-300 mb-3 flex items-center gap-2">
//                     <Info className="w-5 h-5" />
//                     Explicación Profunda
//                   </h3>
//                   <p className="text-slate-300 leading-relaxed">{selectedFormula.deepExplanation}</p>
//                 </div>

//                 {/* Technical Details Grid */}
//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
//                     <h4 className="font-semibold text-green-400 mb-2">Convergencia</h4>
//                     <p className="text-slate-300 text-sm">{selectedFormula.convergence}</p>
//                   </div>
                  
//                   <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
//                     <h4 className="font-semibold text-blue-400 mb-2">Complejidad</h4>
//                     <p className="text-slate-300 text-sm">{selectedFormula.complexity}</p>
//                   </div>
//                 </div>

//                 {/* Applications */}
//                 <div>
//                   <h3 className="text-lg font-semibold text-purple-300 mb-3">Aplicaciones Prácticas</h3>
//                   <p className="text-slate-300">{selectedFormula.applications}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FormulasPage;

const FormulasPage = () => {
  const [selectedFormula, setSelectedFormula] = useState<Formula | null>(null);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  //const cleanFormula = formula.formula.replace(/\\\(|\\\)/g, "");
  
  const toggleExpand = (id: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sigma className="w-12 h-12 text-purple-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Fundamentos Matemáticos de π
            </h1>
          </div>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Exploración profunda de las fórmulas, algoritmos y teorías matemáticas
            detrás del cálculo de la constante más fascinante de las matemáticas
          </p>
        </div>

        {/* Formula Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formulasData.map((formula) => (
            <div
              key={formula.id}
              className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer"
              onClick={() => setSelectedFormula(formula)}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-purple-300">{formula.name}</h3>
                <BookOpen className="w-5 h-5 text-purple-400 flex-shrink-0" />
              </div>
              
              <div className="bg-slate-900/50 rounded p-3 mb-4 text-center text-sm text-slate-300 overflow-x-auto">
                <BlockMath>{formula.formula}</BlockMath>
              </div>

              <p className="text-slate-400 text-sm mb-4">{formula.description}</p>

              <div className="flex items-center gap-2 text-xs">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-slate-400">{formula.convergence}</span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFormula(formula);
                }}
                className="mt-4 w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-sm font-medium"
              >
                Ver Detalles Completos
              </button>
            </div>
          ))}
        </div>

        {/* Detailed Modal */}
        {selectedFormula && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedFormula(null)}
          >
            <div
              className="bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-t-2xl">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{selectedFormula.name}</h2>
                    <p className="text-purple-100">{selectedFormula.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedFormula(null)}
                    className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                
                {/* Formula */}
                <div>
                  <h3 className="text-lg font-semibold text-purple-300 mb-3 flex items-center gap-2">
                    <Sigma className="w-5 h-5" />
                    Fórmula Matemática
                  </h3>
                  <div className="bg-slate-900 rounded-lg p-4 text-center text-sm text-slate-200 overflow-x-auto border border-slate-700">
                    <BlockMath >{selectedFormula.formula}</BlockMath>
                    
                  </div>
                </div>

                {/* Deep Explanation */}
                <div>
                  <h3 className="text-lg font-semibold text-purple-300 mb-3 flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    Explicación Profunda
                  </h3>
                  <p className="text-slate-300 leading-relaxed">{selectedFormula.deepExplanation}</p>
                </div>

                {/* Technical Details Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                    <h4 className="font-semibold text-green-400 mb-2">Convergencia</h4>
                    <p className="text-slate-300 text-sm">{selectedFormula.convergence}</p>
                  </div>
                  
                  <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                    <h4 className="font-semibold text-blue-400 mb-2">Complejidad</h4>
                    <p className="text-slate-300 text-sm">{selectedFormula.complexity}</p>
                  </div>
                </div>

                {/* Applications */}
                <div>
                  <h3 className="text-lg font-semibold text-purple-300 mb-3">Aplicaciones Prácticas</h3>
                  <p className="text-slate-300">{selectedFormula.applications}</p>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default FormulasPage;