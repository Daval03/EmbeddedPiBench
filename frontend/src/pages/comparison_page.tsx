import React, { useState, useMemo } from 'react';
import { Clock, Target, Zap, TrendingUp } from 'lucide-react';

type AlgorithmType = 
  | 'Probability'
  | 'Infinite Series'
  | 'Numerical Methods';

interface Algorithm {
  id: number;
  name: string;
  type: AlgorithmType;
  piEstimate: number;
  correctDigits: number;
  iterations: number;
  timeSeconds: number;
  iterationsPerSecond: number;
  absoluteError: number;
}


const PiAlgorithmsComparison = () => {
  const [sortBy, setSortBy] = useState('id');
  const [filterType, setFilterType] = useState('all');

  // Datos simulados basados en el documento
  const algorithms: Algorithm[] = [
    {
      id: 1,
      name: "Monte Carlo",
      type: "Probability",
      piEstimate: 3.14064,
      correctDigits: 3,
      iterations: 50000,
      timeSeconds: 0.017259,
      iterationsPerSecond: 2897039,
      absoluteError: 0.000953
    },
    {
      id: 2,
      name: "Leibniz",
      type: "Infinite Series",
      piEstimate: 3.141592370450778,
      correctDigits: 6,
      iterations: 3531834,
      timeSeconds: 0.999462,
      iterationsPerSecond: 3533735,
      absoluteError: 2.83e-07
    },
    {
      id: 3,
      name: "Nilakantha",
      type: "Infinite Series",
      piEstimate: 3.141592653589793,
      correctDigits: 18,
      iterations: 1269528,
      timeSeconds: 0.388015,
      iterationsPerSecond: 3271853,
      absoluteError: 5.29e-19
    },
    {
      id: 4,
      name: "Pi Coprimes",
      type: "Probability",
      piEstimate: 3.141499511846553,
      correctDigits: 4,
      iterations: 5322265,
      timeSeconds: 0.997432,
      iterationsPerSecond: 5335968,
      absoluteError: 9.31e-05
    },
    {
      id: 5,
      name: "Buffon",
      type: "Probability",
      piEstimate: 3.1416902293433866,
      correctDigits: 4,
      iterations: 10000,
      timeSeconds: 0.017028,
      iterationsPerSecond: 587268,
      absoluteError: 9.76e-05
    },
    {
      id: 6,
      name: "Euler",
      type: "Infinite Series",
      piEstimate: 3.1415924797291157,
      correctDigits: 6,
      iterations: 5492500,
      timeSeconds: 0.747309,
      iterationsPerSecond: 7349704,
      absoluteError: 1.74e-07
    },
    {
      id: 7,
      name: "Euler Kahan",
      type: "Infinite Series",
      piEstimate: 3.141592560033731,
      correctDigits: 7,
      iterations: 10207031,
      timeSeconds: 0.99912,
      iterationsPerSecond: 10216021,
      absoluteError: 9.36e-08
    },
    {
      id: 8,
      name: "Ramanujan Fast",
      type: "Infinite Series",
      piEstimate: 3.141592653589793,
      correctDigits: 33,
      iterations: 5,
      timeSeconds: 0.000004,
      iterationsPerSecond: 1250000,
      absoluteError: 0.0
    },
    {
      id: 9,
      name: "Chudnovsky Fast",
      type: "Infinite Series",
      piEstimate: 3.141592653589793,
      correctDigits: 33,
      iterations: 3,
      timeSeconds: 0.000003,
      iterationsPerSecond: 1000000,
      absoluteError: 0.0
    },
    {
      id: 10,
      name: "Gauss Legendre",
      type: "Numerical Methods",
      piEstimate: 3.141592653589793,
      correctDigits: 33,
      iterations: 4,
      timeSeconds: 0.000006,
      iterationsPerSecond: 666667,
      absoluteError: 0.0
    },
    {
      id: 11,
      name: "BBP",
      type: "Numerical Methods",
      piEstimate: 3.141592653589793,
      correctDigits: 33,
      iterations: 50,
      timeSeconds: 0.000107,
      iterationsPerSecond: 467290,
      absoluteError: 0.0
    },
    {
      id: 12,
      name: "Borwein",
      type: "Numerical Methods",
      piEstimate: 3.141592653589793,
      correctDigits: 33,
      iterations: 2,
      timeSeconds: 0.000184,
      iterationsPerSecond: 10870,
      absoluteError: 0.0
    }
  ];

  const filteredAndSorted = useMemo(() => {
    let filtered = filterType === 'all' 
      ? algorithms 
      : algorithms.filter(a => a.type === filterType);

    return filtered.sort((a, b) => {
      switch(sortBy) {
        case 'speed': return a.timeSeconds - b.timeSeconds;
        case 'precision': return b.correctDigits - a.correctDigits;
        case 'efficiency': return b.iterationsPerSecond - a.iterationsPerSecond;
        default: return a.id - b.id;
      }
    });
  }, [sortBy, filterType]);

  const getTypeColor = (type: AlgorithmType) => {
    const colors: Record<AlgorithmType, string> = {
      'Probability': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      'Infinite Series': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'Numerical Methods': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    };
    return colors[type] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  const formatScientific = (num: number): string => {
    if (num === 0) return '0';
    if (Math.abs(num) < 0.0001) return num.toExponential(2);
    return num.toFixed(6);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Comparación de Algoritmos π
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Evaluación comparativa de {algorithms.length} algoritmos ejecutados en Raspberry Pi 4
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('id')}
              className={`px-4 py-2 rounded-lg transition ${
                sortBy === 'id' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Original
            </button>
            <button
              onClick={() => setSortBy('speed')}
              className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                sortBy === 'speed' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <Clock className="w-4 h-4" />
              Velocidad
            </button>
            <button
              onClick={() => setSortBy('precision')}
              className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                sortBy === 'precision' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <Target className="w-4 h-4" />
              Precisión
            </button>
            <button
              onClick={() => setSortBy('efficiency')}
              className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                sortBy === 'efficiency' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <Zap className="w-4 h-4" />
              Eficiencia
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-lg transition ${
                filterType === 'all' 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterType('Probability')}
              className={`px-4 py-2 rounded-lg transition ${
                filterType === 'Probability' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Probabilidad
            </button>
            <button
              onClick={() => setFilterType('Infinite Series')}
              className={`px-4 py-2 rounded-lg transition ${
                filterType === 'Infinite Series' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Series Infinitas
            </button>
            <button
              onClick={() => setFilterType('Numerical Methods')}
              className={`px-4 py-2 rounded-lg transition ${
                filterType === 'Numerical Methods' 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Métodos Numéricos
            </button>
          </div>
        </div>

        {/* Algorithm Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAndSorted.map((algo) => (
            <div
              key={algo.id}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/50"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {algo.name}
                  </h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm border ${getTypeColor(algo.type)}`}>
                    {algo.type}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-400">Precisión</div>
                  <div className="text-3xl font-bold text-blue-400">
                    {algo.correctDigits}
                  </div>
                  <div className="text-xs text-slate-500">dígitos</div>
                </div>
              </div>

              {/* Pi Estimate */}
              <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
                <div className="text-sm text-slate-400 mb-1">Estimación de π</div>
                <div className="text-xl font-mono text-emerald-400">
                  {algo.piEstimate.toString().substring(0, 17)}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-slate-400">Tiempo</span>
                  </div>
                  <div className="text-lg font-semibold text-white">
                    {algo.timeSeconds < 0.001 
                      ? `${(algo.timeSeconds * 1000000).toFixed(0)} μs`
                      : algo.timeSeconds < 1
                      ? `${(algo.timeSeconds * 1000).toFixed(2)} ms`
                      : `${algo.timeSeconds.toFixed(3)} s`
                    }
                  </div>
                </div>

                <div className="bg-slate-900/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-slate-400">Iteraciones</span>
                  </div>
                  <div className="text-lg font-semibold text-white">
                    {algo.iterations.toLocaleString()}
                  </div>
                </div>

                <div className="bg-slate-900/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-slate-400">Velocidad</span>
                  </div>
                  <div className="text-lg font-semibold text-white">
                    {(algo.iterationsPerSecond / 1000000).toFixed(2)}M/s
                  </div>
                </div>

                <div className="bg-slate-900/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4 text-red-400" />
                    <span className="text-sm text-slate-400">Error</span>
                  </div>
                  <div className="text-lg font-semibold text-white">
                    {formatScientific(algo.absoluteError)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-xl p-6">
            <div className="text-sm text-blue-300 mb-2">Más Rápido</div>
            <div className="text-2xl font-bold text-white">
              {algorithms.reduce((min, algo) => 
                algo.timeSeconds < min.timeSeconds ? algo : min
              ).name}
            </div>
            <div className="text-sm text-slate-400 mt-1">
              {(algorithms.reduce((min, algo) => 
                algo.timeSeconds < min.timeSeconds ? algo : min
              ).timeSeconds * 1000000).toFixed(0)} μs
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/30 rounded-xl p-6">
            <div className="text-sm text-purple-300 mb-2">Más Preciso</div>
            <div className="text-2xl font-bold text-white">
              {algorithms.reduce((max, algo) => 
                algo.correctDigits > max.correctDigits ? algo : max
              ).name}
            </div>
            <div className="text-sm text-slate-400 mt-1">
              {algorithms.reduce((max, algo) => 
                algo.correctDigits > max.correctDigits ? algo : max
              ).correctDigits} dígitos correctos
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-800/20 border border-emerald-500/30 rounded-xl p-6">
            <div className="text-sm text-emerald-300 mb-2">Más Eficiente</div>
            <div className="text-2xl font-bold text-white">
              {algorithms.reduce((max, algo) => 
                algo.iterationsPerSecond > max.iterationsPerSecond ? algo : max
              ).name}
            </div>
            <div className="text-sm text-slate-400 mt-1">
              {(algorithms.reduce((max, algo) => 
                algo.iterationsPerSecond > max.iterationsPerSecond ? algo : max
              ).iterationsPerSecond / 1000000).toFixed(2)}M iter/s
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PiAlgorithmsComparison;