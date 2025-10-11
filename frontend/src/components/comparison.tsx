import type { Algorithm } from '../types';

interface ComparisonProps {
  algorithms: Algorithm[];
}

export default function Comparison({ algorithms }: ComparisonProps) {
  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-indigo-900 mb-2">Comparación</h1>
        <p className="text-gray-600">Análisis comparativo de resultados</p>
      </div>

      {/* Tabla Comparativa */}
      <ComparisonTable algorithms={algorithms} />
      
      {/* Rankings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Ranking 
          title="Ranking por Criterio 1" 
          algorithms={algorithms}
          getValue={(alg) => `${alg.time}s`}
          bgColor="bg-indigo-100"
          textColor="text-indigo-700"
        />
        <Ranking 
          title="Ranking por Criterio 2" 
          algorithms={algorithms}
          getValue={(alg) => alg.digits.toString()}
          bgColor="bg-green-100"
          textColor="text-green-700"
        />
      </div>
    </div>
  );
}

// Componente de Tabla Comparativa
interface ComparisonTableProps {
  algorithms: Algorithm[];
}

function ComparisonTable({ algorithms }: ComparisonTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <tr>
              <th className="p-4 text-left">Algoritmo</th>
              <th className="p-4 text-right">Año</th>
              <th className="p-4 text-right">Iteraciones</th>
              <th className="p-4 text-right">Dígitos</th>
              <th className="p-4 text-right">Tiempo (s)</th>
              <th className="p-4 text-center">Puntuación</th>
            </tr>
          </thead>
          <tbody>
            {algorithms.map((algorithm, index) => (
              <tr key={algorithm.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="p-4 font-bold text-gray-800">{algorithm.name}</td>
                <td className="p-4 text-right text-gray-600">{algorithm.year}</td>
                <td className="p-4 text-right font-mono text-sm">
                  {algorithm.iterations.toLocaleString()}
                </td>
                <td className="p-4 text-right">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-bold">
                    {algorithm.digits}
                  </span>
                </td>
                <td className="p-4 text-right font-mono">{algorithm.time}</td>
                <td className="p-4 text-center">⭐</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Componente de Ranking Reutilizable
interface RankingProps {
  title: string;
  algorithms: Algorithm[];
  getValue: (algorithm: Algorithm) => string;
  bgColor: string;
  textColor: string;
}

function Ranking({ title, algorithms, getValue, bgColor, textColor }: RankingProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
      <div className="space-y-3">
        {algorithms.map((algorithm, index) => (
          <div key={algorithm.id} className="flex items-center">
            <span className={`w-8 h-8 ${bgColor} ${textColor} rounded-full flex items-center justify-center font-bold text-sm mr-3`}>
              {index + 1}
            </span>
            <span className="flex-1 font-semibold text-gray-700">{algorithm.name}</span>
            <span className={`font-bold ${textColor}`}>{getValue(algorithm)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}