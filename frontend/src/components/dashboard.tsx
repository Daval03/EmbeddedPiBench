import { Zap, TrendingUp, Cpu } from 'lucide-react';
import type { DashboardProps } from '../types';
import StatCard from './ui/StatCard';

export default function Dashboard({ piDigits, algorithms }: DashboardProps) {
  return (
    <div className="space-y-6">
      {/* Título Principal */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-indigo-900 mb-2">
          Título del Proyecto
        </h1>
        <p className="text-xl text-gray-600">Subtítulo descriptivo</p>
      </div>

      {/* Tarjeta de π Animado */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-2xl">
        <div className="text-center">
          <p className="text-lg mb-2 opacity-90">Valor de π</p>
          <div className="text-6xl font-mono font-bold mb-4 tracking-wider">
            {piDigits}
          </div>
          <p className="text-sm opacity-75">Texto descriptivo</p>
        </div>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={Zap}
          title="Estadística 1"
          value="00"
          description="Descripción"
          borderColor="border-blue-500"
          iconColor="text-blue-500"
        />
        <StatCard
          icon={TrendingUp}
          title="Estadística 2"
          value="00"
          description="Descripción"
          borderColor="border-green-500"
          iconColor="text-green-500"
        />
        <StatCard
          icon={Cpu}
          title="Estadística 3"
          value="Texto"
          description="Descripción"
          borderColor="border-purple-500"
          iconColor="text-purple-500"
        />
      </div>

      {/* Gráfico Comparativo */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Comparativa Visual</h3>
        <div className="space-y-3">
          {algorithms.map((alg) => (
            <div key={alg.id} className="flex items-center">
              <div className="w-40 font-semibold text-gray-700">{alg.name}</div>
              <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${(alg.digits / 100) * 100}%` }}
                ></div>
              </div>
              <div className="w-20 text-right font-bold text-indigo-600">{alg.digits}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}