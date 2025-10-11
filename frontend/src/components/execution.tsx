interface Algorithm {
  id: string;
  name: string;
}

interface ExecutionProps {
  algorithms: Algorithm[];
}

export default function Execution({ algorithms }: ExecutionProps) {
  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-indigo-900 mb-2">Ejecución en Vivo</h1>
        <p className="text-gray-600">Descripción de la sección</p>
      </div>

      {/* Terminal Simulada */}
      <div className="bg-gradient-to-br from-gray-900 to-indigo-900 rounded-xl p-8 text-white shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">Terminal / Consola</h3>
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>
        <div className="font-mono text-sm space-y-2 bg-black bg-opacity-50 rounded p-4">
          <p className="text-green-400">$ comando de ejemplo</p>
          <p className="text-gray-400">Output línea 1...</p>
          <p className="text-gray-400">Output línea 2...</p>
          <p className="text-blue-400">▶ Proceso en ejecución...</p>
          <p className="text-yellow-400">✓ Resultado 1</p>
          <p className="text-green-400">✓ Resultado 2</p>
        </div>
      </div>

      {/* Visualización de Convergencia */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Visualización de Datos</h3>
        <div className="space-y-4">
          {algorithms.slice(0, 3).map((alg, idx) => (
            <div key={alg.id}>
              <div className="flex justify-between mb-1">
                <span className="font-semibold">{alg.name}</span>
                <span className="text-gray-600">Etiqueta</span>
              </div>
              <div className="h-8 bg-gray-200 rounded overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${
                    idx === 0 ? 'from-red-400 to-red-600' : 
                    idx === 1 ? 'from-orange-400 to-orange-600' : 
                    'from-green-400 to-green-600'
                  }`}
                  style={{width: `${30 + idx * 30}%`}}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}