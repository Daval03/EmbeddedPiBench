interface Algorithm {
  id: string;
  name: string;
  year: string;
  iterations: number;
  digits: number;
  time: number;
}

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
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              <tr>
                <th className="p-4 text-left">Columna 1</th>
                <th className="p-4 text-right">Columna 2</th>
                <th className="p-4 text-right">Columna 3</th>
                <th className="p-4 text-right">Columna 4</th>
                <th className="p-4 text-right">Columna 5</th>
                <th className="p-4 text-center">Columna 6</th>
              </tr>
            </thead>
            <tbody>
              {algorithms.map((alg, idx) => (
                <tr key={alg.id} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="p-4 font-bold text-gray-800">{alg.name}</td>
                  <td className="p-4 text-right text-gray-600">{alg.year}</td>
                  <td className="p-4 text-right font-mono text-sm">{alg.iterations.toLocaleString()}</td>
                  <td className="p-4 text-right">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-bold">
                      {alg.digits}
                    </span>
                  </td>
                  <td className="p-4 text-right font-mono">{alg.time}</td>
                  <td className="p-4 text-center">⭐</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rankings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Ranking por Criterio 1</h3>
          <div className="space-y-3">
            {algorithms.map((alg, idx) => (
              <div key={alg.id} className="flex items-center">
                <span className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-sm mr-3">
                  {idx + 1}
                </span>
                <span className="flex-1 font-semibold text-gray-700">{alg.name}</span>
                <span className="text-indigo-600 font-bold">{alg.time}s</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Ranking por Criterio 2</h3>
          <div className="space-y-3">
            {algorithms.map((alg, idx) => (
              <div key={alg.id} className="flex items-center">
                <span className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-sm mr-3">
                  {idx + 1}
                </span>
                <span className="flex-1 font-semibold text-gray-700">{alg.name}</span>
                <span className="text-green-600 font-bold">{alg.digits}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}