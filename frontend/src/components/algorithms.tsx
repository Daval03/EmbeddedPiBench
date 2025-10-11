import { BookOpen } from 'lucide-react';

interface Algorithm {
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

interface AlgorithmsProps {
  algorithms: Algorithm[];
  activeAlgorithm: string;
  setActiveAlgorithm: (id: string) => void;
}

export default function Algorithms({ 
  algorithms, 
  activeAlgorithm, 
  setActiveAlgorithm 
}: AlgorithmsProps) {
  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-indigo-900 mb-2">Sección de Algoritmos</h1>
        <p className="text-gray-600">Descripción de la sección</p>
      </div>

      {/* Grid de Tarjetas de Algoritmos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {algorithms.map((alg) => (
          <div 
            key={alg.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-transparent hover:border-indigo-500 transition-all cursor-pointer"
            onClick={() => setActiveAlgorithm(activeAlgorithm === alg.id ? "" : alg.id)}
          >
            {/* Header del Algoritmo */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl font-bold">{alg.name}</h3>
                <span className="bg-white text-indigo-600 px-3 py-1 rounded-full text-xs font-bold">
                  {alg.year}
                </span>
              </div>
              <div className="bg-white bg-opacity-20 rounded p-3 font-mono text-sm backdrop-blur-sm">
                {alg.formula}
              </div>
            </div>

            {/* Contenido del Algoritmo */}
            <div className="p-6">
              <p className="text-gray-700 mb-4">{alg.description}</p>
              
              {/* Métricas */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 rounded p-3">
                  <p className="text-xs text-gray-600">Métrica 1</p>
                  <p className="font-bold text-lg text-blue-700">{alg.iterations.toLocaleString()}</p>
                </div>
                <div className="bg-green-50 rounded p-3">
                  <p className="text-xs text-gray-600">Métrica 2</p>
                  <p className="font-bold text-lg text-green-700">{alg.digits}</p>
                </div>
                <div className="bg-purple-50 rounded p-3">
                  <p className="text-xs text-gray-600">Métrica 3</p>
                  <p className="font-bold text-lg text-purple-700">{alg.time}s</p>
                </div>
                <div className="bg-orange-50 rounded p-3">
                  <p className="text-xs text-gray-600">Métrica 4</p>
                  <p className="font-bold text-lg text-orange-700">{alg.complexity}</p>
                </div>
              </div>

              {/* Código (se muestra al hacer clic) */}
              {activeAlgorithm === alg.id && (
                <div className="mt-4 border-t pt-4">
                  <h4 className="font-bold text-gray-800 mb-2 flex items-center">
                    <BookOpen size={18} className="mr-2" />
                    Código de Implementación
                  </h4>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
                    {alg.code}
                  </pre>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}