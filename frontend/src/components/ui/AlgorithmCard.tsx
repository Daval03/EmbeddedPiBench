import { BookOpen } from 'lucide-react';
import type { Algorithm } from '../../types';

interface AlgorithmCardProps {
  algorithm: Algorithm;
  isActive: boolean;
  onClick: () => void;
}

export default function AlgorithmCard({ algorithm, isActive, onClick }: AlgorithmCardProps) {
  return (
    <div 
      className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-transparent hover:border-indigo-500 transition-all cursor-pointer"
      onClick={onClick}
    >
      {/* Header del Algoritmo */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-2xl font-bold">{algorithm.name}</h3>
          <span className="bg-white text-indigo-600 px-3 py-1 rounded-full text-xs font-bold">
            {algorithm.year}
          </span>
        </div>
        <div className="bg-white bg-opacity-20 rounded p-3 font-mono text-sm backdrop-blur-sm">
          {algorithm.formula}
        </div>
      </div>

      {/* Contenido del Algoritmo */}
      <div className="p-6">
        <p className="text-gray-700 mb-4">{algorithm.description}</p>
        
        {/* Métricas */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-50 rounded p-3">
            <p className="text-xs text-gray-600">Iteraciones</p>
            <p className="font-bold text-lg text-blue-700">{algorithm.iterations.toLocaleString()}</p>
          </div>
          <div className="bg-green-50 rounded p-3">
            <p className="text-xs text-gray-600">Dígitos</p>
            <p className="font-bold text-lg text-green-700">{algorithm.digits}</p>
          </div>
          <div className="bg-purple-50 rounded p-3">
            <p className="text-xs text-gray-600">Tiempo</p>
            <p className="font-bold text-lg text-purple-700">{algorithm.time}s</p>
          </div>
          <div className="bg-orange-50 rounded p-3">
            <p className="text-xs text-gray-600">Complejidad</p>
            <p className="font-bold text-lg text-orange-700">{algorithm.complexity}</p>
          </div>
        </div>

        {/* Código (se muestra al hacer clic) */}
        {isActive && (
          <div className="mt-4 border-t pt-4">
            <h4 className="font-bold text-gray-800 mb-2 flex items-center">
              <BookOpen size={18} className="mr-2" />
              Código de Implementación
            </h4>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
              {algorithm.code}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}