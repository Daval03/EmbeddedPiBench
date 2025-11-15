import React, { useState, useMemo, useEffect } from 'react';
import { Clock, Target, Zap, TrendingUp } from 'lucide-react';
import { fetchEstimations, Estimation } from '../services/algorithmService';

// Definir el tipo para las categorías de algoritmos
type AlgorithmType = "Probability" | "Infinite Series" | "Numerical Methods";

const PiAlgorithmsComparison = () => {
  const [sortBy, setSortBy] = useState('id');
  const [filterType, setFilterType] = useState<AlgorithmType | 'all'>('all');
  const [algorithms, setAlgorithms] = useState<Estimation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadEstimations = async () => {
      try {
        const data = await fetchEstimations();
        setAlgorithms(data);
      } catch {
        setError("No se pudieron cargar los datos desde el servidor.");
      } finally {
        setLoading(false);
      }
    };

    loadEstimations();
  }, []);

  const filteredAndSorted = useMemo(() => {
    let filtered =
      filterType === "all"
        ? algorithms
        : algorithms.filter((a) => a.type === filterType);

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "speed":
          return a.time_seconds - b.time_seconds;
        case "precision":
          return b.correct_digits - a.correct_digits;
        case "efficiency":
          return b.iterations_per_second - a.iterations_per_second;
        default:
          return a.id - b.id;
      }
    });
  }, [sortBy, filterType, algorithms]);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-300">
        Cargando datos...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

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
                    {algo.algorithm}
                  </h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm border ${getTypeColor(algo.type)}`}>
                    {algo.type}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-400">Precisión</div>
                  <div className="text-3xl font-bold text-blue-400">
                    {algo.correct_digits}
                  </div>
                  <div className="text-xs text-slate-500">dígitos</div>
                </div>
              </div>

              {/* Pi Estimate */}
              <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
                <div className="text-sm text-slate-400 mb-1">Estimación de π</div>
                <div className="text-xl font-mono text-emerald-400">
                  {algo.pi_estimate.toString().substring(0, 17)}
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
                    {algo.time_seconds < 0.001 
                      ? `${(algo.time_seconds * 1000000).toFixed(0)} μs`
                      : algo.time_seconds < 1
                      ? `${(algo.time_seconds * 1000).toFixed(2)} ms`
                      : `${algo.time_seconds.toFixed(3)} s`
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
                    {(algo.iterations_per_second / 1000000).toFixed(2)}M/s
                  </div>
                </div>

                <div className="bg-slate-900/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4 text-red-400" />
                    <span className="text-sm text-slate-400">Error</span>
                  </div>
                  <div className="text-lg font-semibold text-white">
                    {formatScientific(algo.absolute_error)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        {algorithms.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-xl p-6">
              <div className="text-sm text-blue-300 mb-2">Más Rápido</div>
              <div className="text-2xl font-bold text-white">
                {algorithms.reduce((min, algo) => 
                  algo.time_seconds < min.time_seconds ? algo : min
                ).algorithm}
              </div>
              <div className="text-sm text-slate-400 mt-1">
                {(algorithms.reduce((min, algo) => 
                  algo.time_seconds < min.time_seconds ? algo : min
                ).time_seconds * 1000).toFixed(2)} ms
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/30 rounded-xl p-6">
              <div className="text-sm text-purple-300 mb-2">Más Preciso</div>
              <div className="text-2xl font-bold text-white">
                {algorithms.reduce((max, algo) => 
                  algo.correct_digits > max.correct_digits ? algo : max
                ).algorithm}
              </div>
              <div className="text-sm text-slate-400 mt-1">
                {algorithms.reduce((max, algo) => 
                  algo.correct_digits > max.correct_digits ? algo : max
                ).correct_digits} dígitos correctos
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-800/20 border border-emerald-500/30 rounded-xl p-6">
              <div className="text-sm text-emerald-300 mb-2">Más Eficiente</div>
              <div className="text-2xl font-bold text-white">
                {algorithms.reduce((max, algo) => 
                  algo.iterations_per_second > max.iterations_per_second ? algo : max
                ).algorithm}
              </div>
              <div className="text-sm text-slate-400 mt-1">
                {(algorithms.reduce((max, algo) => 
                  algo.iterations_per_second > max.iterations_per_second ? algo : max
                ).iterations_per_second / 1000000).toFixed(2)}M iter/s
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PiAlgorithmsComparison;