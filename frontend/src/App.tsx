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