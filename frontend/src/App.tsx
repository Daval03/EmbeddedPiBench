import { useState, useEffect } from 'react';
import { Activity, Cpu, Zap, TrendingUp, BookOpen, Play } from 'lucide-react';

export default function App() {
  const [selectedItem, setSelectedItem] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [piDigits, setPiDigits] = useState('3.14159265358979323846');
  const [activeAlgorithm, setActiveAlgorithm] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const pi = '3.14159265358979323846264338327950288419716939937510';
      const length = Math.floor(Math.random() * 20) + 10;
      setPiDigits(pi.substring(0, length));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // AQUÍ IRÁN TUS ALGORITMOS CON DATOS REALES
  const algorithms = [
    {
      id: 'algoritmo-1',
      name: 'Nombre del Algoritmo 1',
      formula: 'Fórmula matemática aquí',
      description: 'Descripción del algoritmo',
      complexity: 'O(n)',
      iterations: 1000000,
      digits: 10,
      time: 0.5,
      year: '2000',
      code: `# Código Python aquí
def algoritmo():
    pass`
    },
    // Agregar más algoritmos aquí
  ];

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'algorithms', label: 'Algoritmos', icon: Zap },
    { id: 'execution', label: 'Ejecución', icon: Play },
    { id: 'comparison', label: 'Comparación', icon: TrendingUp },
    { id: 'about', label: 'Sobre el Proyecto', icon: Cpu },
  ];

  const renderContent = () => {
    switch(selectedItem) {
      case 'dashboard':
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
              <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
                <div className="flex items-center mb-3">
                  <Zap className="text-blue-500 mr-2" />
                  <h3 className="font-bold text-gray-800">Estadística 1</h3>
                </div>
                <p className="text-4xl font-bold text-gray-900">00</p>
                <p className="text-sm text-gray-600 mt-1">Descripción</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500">
                <div className="flex items-center mb-3">
                  <TrendingUp className="text-green-500 mr-2" />
                  <h3 className="font-bold text-gray-800">Estadística 2</h3>
                </div>
                <p className="text-4xl font-bold text-gray-900">00</p>
                <p className="text-sm text-gray-600 mt-1">Descripción</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-500">
                <div className="flex items-center mb-3">
                  <Cpu className="text-purple-500 mr-2" />
                  <h3 className="font-bold text-gray-800">Estadística 3</h3>
                </div>
                <p className="text-2xl font-bold text-gray-900">Texto</p>
                <p className="text-sm text-gray-600 mt-1">Descripción</p>
              </div>
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

      case 'algorithms':
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

      case 'execution':
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

      case 'comparison':
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

      case 'about':
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

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-indigo-900 to-purple-900 shadow-2xl z-10
        transform transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="p-6 border-b border-indigo-700">
          <div className="flex items-center">
            <Cpu className="text-white mr-3" size={32} />
            <div>
              <h2 className="font-bold text-white text-lg">Título</h2>
              <p className="text-indigo-300 text-xs">Subtítulo</p>
            </div>
          </div>
        </div>
       
        <div className="p-4">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedItem(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full text-left p-3 rounded-lg mb-2 transition-all flex items-center ${
                  selectedItem === item.id
                    ? 'bg-white text-indigo-900 shadow-lg'
                    : 'text-white hover:bg-indigo-800'
                }`}
              >
                <IconComponent size={20} className="mr-3" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Botón Toggle Móvil */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-20 lg:hidden bg-indigo-600 text-white p-3 rounded-lg shadow-lg"
      >
        {isSidebarOpen ? '✕' : '☰'}
      </button>

      {/* Overlay Móvil */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-5 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Contenido Principal */}
      <div className="flex-1 lg:ml-64 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}