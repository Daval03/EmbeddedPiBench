import React, { useState, useEffect } from 'react';
import { Activity, Zap, Target, Code } from 'lucide-react';
import { Link } from 'react-router-dom';

const PiHomepage = () => {
  const [activeAlgo, setActiveAlgo] = useState(0);
  const [digits, setDigits] = useState(0);
  
  const algorithms = [
    { name: 'Chudnovsky', digits: 33, time: 0.000003, color: 'from-purple-500 to-pink-500' },
    { name: 'Ramanujan', digits: 33, time: 0.000004, color: 'from-blue-500 to-cyan-500' },
    { name: 'Gauss-Legendre', digits: 33, time: 0.000006, color: 'from-green-500 to-emerald-500' },
    { name: 'BBP', digits: 33, time: 0.000107, color: 'from-orange-500 to-red-500' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAlgo((prev) => (prev + 1) % algorithms.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const targetDigits = algorithms[activeAlgo].digits;
    let current = 0;
    const increment = targetDigits / 30;
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetDigits) {
        setDigits(targetDigits);
        clearInterval(timer);
      } else {
        setDigits(Math.floor(current));
      }
    }, 30);
    return () => clearInterval(timer);
  }, [activeAlgo]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Calculando <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">π</span> en Tiempo Real
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Comparación de 12 algoritmos ejecutándose en una Raspberry Pi 4. 
            Desde métodos probabilísticos hasta series infinitas.
          </p>
        </div>

        {/* Main Stats */}
        <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-8 mb-8 border border-slate-700">
          <div className="text-center mb-6">
            <div className="text-sm text-slate-400 mb-2">Algoritmo Actual</div>
            <div className={`text-3xl font-bold bg-gradient-to-r ${algorithms[activeAlgo].color} bg-clip-text text-transparent mb-4`}>
              {algorithms[activeAlgo].name}
            </div>
            <div className="text-7xl font-mono font-bold mb-2">
              {digits}
            </div>
            <div className="text-slate-400">dígitos correctos en menos de 1 segundo</div>
          </div>

          <div className="flex gap-2 justify-center mb-4">
            {algorithms.map((algo, idx) => (
              <button
                key={idx}
                onClick={() => setActiveAlgo(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === activeAlgo ? 'w-8 bg-gradient-to-r ' + algo.color : 'w-2 bg-slate-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Activity className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-slate-400 text-sm">Algoritmos</div>
            </div>
            <div className="text-3xl font-bold">12</div>
            <div className="text-sm text-slate-500 mt-1">Métodos comparados</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-slate-400 text-sm">Más Rápido</div>
            </div>
            <div className="text-3xl font-bold">3 μs</div>
            <div className="text-sm text-slate-500 mt-1">Chudnovsky Fast</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-slate-400 text-sm">Precisión Máxima</div>
            </div>
            <div className="text-3xl font-bold">33</div>
            <div className="text-sm text-slate-500 mt-1">Dígitos correctos</div>
          </div>
        </div>

        {/* Algorithm Categories */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20">
            <h3 className="text-lg font-semibold mb-2">Métodos Probabilísticos</h3>
            <p className="text-sm text-slate-400 mb-3">Monte Carlo, Buffon, Coprimes</p>
            <div className="text-sm text-slate-500">3-4 dígitos | ~1s</div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-blue-500/20">
            <h3 className="text-lg font-semibold mb-2">Series Infinitas</h3>
            <p className="text-sm text-slate-400 mb-3">Leibniz, Euler, Nilakantha</p>
            <div className="text-sm text-slate-500">6-18 dígitos | 0.3-1s</div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/20">
            <h3 className="text-lg font-semibold mb-2">Algoritmos Modernos</h3>
            <p className="text-sm text-slate-400 mb-3">Ramanujan, Chudnovsky, BBP</p>
            <div className="text-sm text-slate-500">33 dígitos | &lt;1ms</div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-8 border border-purple-500/30 text-center">
          <Code className="w-12 h-12 mx-auto mb-4 text-purple-400" />
          <h2 className="text-2xl font-bold mb-2">Explora los Algoritmos</h2>
          <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
            Descubre cómo funcionan estos algoritmos, compara su rendimiento y explora las matemáticas detrás del cálculo de π
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link 
              to="/algorithms" 
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition no-underline text-white"
            >
              Ver Algoritmos
            </Link>
            <Link 
              to="/compare" 
              className="px-6 py-3 bg-slate-700 rounded-lg font-semibold hover:bg-slate-600 transition no-underline text-white"
            >
              Ver Comparativa
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PiHomepage;