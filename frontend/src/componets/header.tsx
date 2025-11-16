import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="border-b border-slate-700 bg-slate-900/95 backdrop-blur-sm sticky top-0 z-50 shadow-lg">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white">
            π
          </div>
          <span className="text-xl font-bold text-white">Pi Calculator</span>
        </Link>
        
        <nav className="flex gap-6 text-sm">
          <Link 
            to="/" 
            className={`transition no-underline ${
              isActive('/') || isActive('/home')
                ? 'text-white font-medium' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/algorithms" 
            className={`transition no-underline ${
              isActive('/algorithms')
                ? 'text-white font-medium' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Algoritmos
          </Link>
          <Link 
            to="/compare" 
            className={`transition no-underline ${
              isActive('/compare')
                ? 'text-white font-medium' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Comparativa
          </Link>
          <Link 
            to="/math" 
            className={`transition no-underline ${
              isActive('/math')
                ? 'text-white font-medium' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Matemáticas
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;