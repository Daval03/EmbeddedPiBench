import { Cpu } from 'lucide-react';

export default function About() {
  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-indigo-900 mb-2">Sobre el Proyecto</h1>
        <p className="text-gray-600">Información adicional y detalles técnicos</p>
      </div>

      {/* Tarjeta Principal */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex items-center mb-6">
          <Cpu size={48} className="mr-4" />
          <div>
            <h2 className="text-3xl font-bold">Título Principal</h2>
            <p className="opacity-90">Subtítulo descriptivo</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white bg-opacity-20 rounded p-4 backdrop-blur-sm">
            <p className="text-sm opacity-75 mb-1">Especificación 1</p>
            <p className="font-bold">Valor 1</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded p-4 backdrop-blur-sm">
            <p className="text-sm opacity-75 mb-1">Especificación 2</p>
            <p className="font-bold">Valor 2</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded p-4 backdrop-blur-sm">
            <p className="text-sm opacity-75 mb-1">Especificación 3</p>
            <p className="font-bold">Valor 3</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded p-4 backdrop-blur-sm">
            <p className="text-sm opacity-75 mb-1">Especificación 4</p>
            <p className="font-bold">Valor 4</p>
          </div>
        </div>
      </div>

      {/* Sección de Objetivos */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Objetivos / Características</h3>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start">
            <span className="text-indigo-600 font-bold mr-3">1.</span>
            <span>Objetivo o característica 1</span>
          </li>
          <li className="flex items-start">
            <span className="text-indigo-600 font-bold mr-3">2.</span>
            <span>Objetivo o característica 2</span>
          </li>
          <li className="flex items-start">
            <span className="text-indigo-600 font-bold mr-3">3.</span>
            <span>Objetivo o característica 3</span>
          </li>
          <li className="flex items-start">
            <span className="text-indigo-600 font-bold mr-3">4.</span>
            <span>Objetivo o característica 4</span>
          </li>
        </ul>
      </div>

      {/* Sección Adicional */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Información Adicional</h3>
        <p className="text-gray-700 mb-4">
          Descripción o contexto adicional del proyecto...
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded p-4">
            <h4 className="font-bold text-blue-900 mb-2">Aspecto 1</h4>
            <p className="text-sm text-gray-700">Descripción del aspecto 1</p>
          </div>
          <div className="bg-green-50 rounded p-4">
            <h4 className="font-bold text-green-900 mb-2">Aspecto 2</h4>
            <p className="text-sm text-gray-700">Descripción del aspecto 2</p>
          </div>
          <div className="bg-purple-50 rounded p-4">
            <h4 className="font-bold text-purple-900 mb-2">Aspecto 3</h4>
            <p className="text-sm text-gray-700">Descripción del aspecto 3</p>
          </div>
        </div>
      </div>
    </div>
  );
}