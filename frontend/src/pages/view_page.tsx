import React, { useState, useEffect } from 'react';
import { RotateCcw, ArrowUpDown } from 'lucide-react';
import { Estimation, AlgorithmType } from '../types/types';
import { fetchEstimations } from '../services/apiService';

const PiAlgorithmsTable: React.FC = () => {
  const [algorithms, setAlgorithms] = useState<Estimation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Estimation;
    direction: 'asc' | 'desc';
  } | null>(null);

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
  

  const handleSort = (key: keyof Estimation) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedAlgorithms = React.useMemo(() => {
    let sortable = [...algorithms];
    if (sortConfig !== null) {
      sortable.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        
        if (aVal < bVal) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aVal > bVal) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortable;
  }, [algorithms, sortConfig]);

  const handleReRun = (algorithmName: string) => {
    console.log(`Re-run requested for: ${algorithmName}`);
    alert(`Re-running algorithm: ${algorithmName.replace(/_/g, ' ')}`);
  };

  const formatScientific = (num: number): string => {
    if (num === 0) return '0';
    if (Math.abs(num) < 0.0001) return num.toExponential(2);
    return num.toFixed(6);
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 0.001) {
      return `${(seconds * 1000000).toFixed(0)} μs`;
    } else if (seconds < 1) {
      return `${(seconds * 1000).toFixed(2)} ms`;
    } else {
      return `${seconds.toFixed(3)} s`;
    }
  };

  const getTypeColor = (type: AlgorithmType): string => {
    const colors: Record<AlgorithmType, string> = {
      'Probability': 'bg-purple-500/20 text-purple-300',
      'Infinite Series': 'bg-blue-500/20 text-blue-300',
      'Numerical Methods': 'bg-emerald-500/20 text-emerald-300'
    };
    return colors[type] || 'bg-gray-500/20 text-gray-300';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center text-slate-300">
        <div className="text-xl">Cargando datos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center text-red-500">
        <div className="text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent py-2">
            Tabla de Algoritmos π
          </h1>
          <p className="text-xl text-slate-400">
            {algorithms.length} algoritmos ejecutados en Raspberry Pi 4
          </p>
        </div>

        {/* Table */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/80">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => handleSort('id')}
                      className="flex items-center gap-2 font-semibold text-slate-300 hover:text-white transition"
                    >
                      ID
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => handleSort('algorithm')}
                      className="flex items-center gap-2 font-semibold text-slate-300 hover:text-white transition"
                    >
                      Algoritmo
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => handleSort('type')}
                      className="flex items-center gap-2 font-semibold text-slate-300 hover:text-white transition"
                    >
                      Tipo
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleSort('pi_estimate')}
                      className="flex items-center gap-2 font-semibold text-slate-300 hover:text-white transition ml-auto"
                    >
                      Estimación π
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleSort('correct_digits')}
                      className="flex items-center gap-2 font-semibold text-slate-300 hover:text-white transition ml-auto"
                    >
                      Dígitos
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleSort('iterations')}
                      className="flex items-center gap-2 font-semibold text-slate-300 hover:text-white transition ml-auto"
                    >
                      Iteraciones
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleSort('time_seconds')}
                      className="flex items-center gap-2 font-semibold text-slate-300 hover:text-white transition ml-auto"
                    >
                      Tiempo
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleSort('iterations_per_second')}
                      className="flex items-center gap-2 font-semibold text-slate-300 hover:text-white transition ml-auto"
                    >
                      Iter/s
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleSort('absolute_error')}
                      className="flex items-center gap-2 font-semibold text-slate-300 hover:text-white transition ml-auto"
                    >
                      Error
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-slate-300">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedAlgorithms.map((algo, index) => (
                  <tr
                    key={algo.id}
                    className={`border-t border-slate-700 hover:bg-slate-700/30 transition ${
                      index % 2 === 0 ? 'bg-slate-800/20' : 'bg-slate-800/40'
                    }`}
                  >
                    <td className="px-6 py-4 text-slate-300">{algo.id}</td>
                    <td className="px-6 py-4 font-semibold text-white uppercase text-sm">
                      {algo.algorithm.replace(/_/g, ' ')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs ${getTypeColor(algo.type)}`}>
                        {algo.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-emerald-400 text-sm">
                      {algo.pi_estimate.toString().substring(0, 12)}...
                    </td>
                    <td className="px-6 py-4 text-right text-blue-400 font-semibold">
                      {algo.correct_digits}
                    </td>
                    <td className="px-6 py-4 text-right text-slate-300">
                      {algo.iterations.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right text-slate-300">
                      {formatTime(algo.time_seconds)}
                    </td>
                    <td className="px-6 py-4 text-right text-slate-300">
                      {(algo.iterations_per_second / 1000000).toFixed(2)}M
                    </td>
                    <td className="px-6 py-4 text-right text-slate-300 text-sm">
                      {formatScientific(algo.absolute_error)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleReRun(algo.algorithm)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium text-sm"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Re-run
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-8 text-center text-slate-400 text-sm">
          Haz clic en los encabezados de las columnas para ordenar los datos
        </div>
      </div>
    </div>
  );
};

export default PiAlgorithmsTable;