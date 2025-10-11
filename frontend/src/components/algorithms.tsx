import type { Algorithm } from '../types';
import AlgorithmCard from './ui/AlgorithmCard';

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
        {algorithms.map((algorithm) => (
          <AlgorithmCard
            key={algorithm.id}
            algorithm={algorithm}
            isActive={activeAlgorithm === algorithm.id}
            onClick={() => setActiveAlgorithm(
              activeAlgorithm === algorithm.id ? "" : algorithm.id
            )}
          />
        ))}
      </div>
    </div>
  );
}