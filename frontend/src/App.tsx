// import { useState, useEffect } from 'react';
// import { Activity, Cpu, Zap, TrendingUp, Play } from 'lucide-react';
// import Dashboard from './components/dashboard';
// import Algorithms from './components/algorithms';
// import Execution from './components/execution';
// import Comparison from './components/comparison';
// import About from './components/about';

// export default function App() {
//   const [selectedItem, setSelectedItem] = useState('dashboard');
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [piDigits, setPiDigits] = useState('3.14159265358979323846');
//   const [activeAlgorithm, setActiveAlgorithm] = useState("");

//   useEffect(() => {
//     const interval = setInterval(() => {
//       const pi = '3.14159265358979323846264338327950288419716939937510';
//       const length = Math.floor(Math.random() * 20) + 10;
//       setPiDigits(pi.substring(0, length));
//     }, 3000);
//     return () => clearInterval(interval);
//   }, []);

//   // AQUÍ IRÁN TUS ALGORITMOS CON DATOS REALES
//   const algorithms = [
//     {
//       id: 'algoritmo-1',
//       name: 'Nombre del Algoritmo 1',
//       formula: 'Fórmula matemática aquí',
//       description: 'Descripción del algoritmo',
//       complexity: 'O(n)',
//       iterations: 1000000,
//       digits: 10,
//       time: 0.5,
//       year: '2000',
//       code: `# Código Python aquí
// def algoritmo():
//     pass`
//     },
//     // Agregar más algoritmos aquí
//   ];

//   const menuItems = [
//     { id: 'dashboard', label: 'Dashboard', icon: Activity },
//     { id: 'algorithms', label: 'Algoritmos', icon: Zap },
//     { id: 'execution', label: 'Ejecución', icon: Play },
//     { id: 'comparison', label: 'Comparación', icon: TrendingUp },
//     { id: 'about', label: 'Sobre el Proyecto', icon: Cpu },
//   ];

//   const renderContent = () => {
//     switch(selectedItem) {
//       case 'dashboard':
//         return <Dashboard piDigits={piDigits} algorithms={algorithms} />;
//       case 'algorithms':
//         return (
//           <Algorithms 
//             algorithms={algorithms} 
//             activeAlgorithm={activeAlgorithm}
//             setActiveAlgorithm={setActiveAlgorithm}
//           />
//         );
//       case 'execution':
//         return <Execution algorithms={algorithms} />;
//       case 'comparison':
//         return <Comparison algorithms={algorithms} />;
//       case 'about':
//         return <About />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
//       {/* Sidebar */}
//       <div className={`
//         fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-indigo-900 to-purple-900 shadow-2xl z-10
//         transform transition-transform duration-300
//         ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
//         lg:translate-x-0
//       `}>
//         <div className="p-6 border-b border-indigo-700">
//           <div className="flex items-center">
//             <Cpu className="text-white mr-3" size={32} />
//             <div>
//               <h2 className="font-bold text-white text-lg">Título</h2>
//               <p className="text-indigo-300 text-xs">Subtítulo</p>
//             </div>
//           </div>
//         </div>
       
//         <div className="p-4">
//           {menuItems.map((item) => {
//             const IconComponent = item.icon;
//             return (
//               <button
//                 key={item.id}
//                 onClick={() => {
//                   setSelectedItem(item.id);
//                   setIsSidebarOpen(false);
//                 }}
//                 className={`w-full text-left p-3 rounded-lg mb-2 transition-all flex items-center ${
//                   selectedItem === item.id
//                     ? 'bg-white text-indigo-900 shadow-lg'
//                     : 'text-white hover:bg-indigo-800'
//                 }`}
//               >
//                 <IconComponent size={20} className="mr-3" />
//                 <span className="font-medium">{item.label}</span>
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       {/* Botón Toggle Móvil */}
//       <button
//         onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//         className="fixed top-4 left-4 z-20 lg:hidden bg-indigo-600 text-white p-3 rounded-lg shadow-lg"
//       >
//         {isSidebarOpen ? '✕' : '☰'}
//       </button>

//       {/* Overlay Móvil */}
//       {isSidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-5 lg:hidden"
//           onClick={() => setIsSidebarOpen(false)}
//         />
//       )}

//       {/* Contenido Principal */}
//       <div className="flex-1 lg:ml-64 p-4 md:p-8">
//         <div className="max-w-7xl mx-auto">
//           {renderContent()}
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState } from 'react';
import { usePiDigits } from './hooks/usePiDigits';
import { menuItems, algorithms } from './data/mockData';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './components/dashboard';
import Algorithms from './components/algorithms';
import Execution from './components/execution';
import Comparison from './components/comparison';
import About from './components/about';

export default function App() {
  const [selectedItem, setSelectedItem] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeAlgorithm, setActiveAlgorithm] = useState("");
  const piDigits = usePiDigits(3000);

  const handleMenuItemClick = (itemId: string) => {
    setSelectedItem(itemId);
    setIsSidebarOpen(false);
  };

  const renderContent = () => {
    const contentMap = {
      dashboard: <Dashboard piDigits={piDigits} algorithms={algorithms} />,
      algorithms: (
        <Algorithms 
          algorithms={algorithms} 
          activeAlgorithm={activeAlgorithm}
          setActiveAlgorithm={setActiveAlgorithm}
        />
      ),
      execution: <Execution algorithms={algorithms} />,
      comparison: <Comparison algorithms={algorithms} />,
      about: <About />
    };

    return contentMap[selectedItem as keyof typeof contentMap] || null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      <Sidebar
        menuItems={menuItems}
        selectedItem={selectedItem}
        onItemClick={handleMenuItemClick}
        isOpen={isSidebarOpen}
      />

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