import React, { useState, useEffect } from 'react';
import { Activity, Zap, Target, Code } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Algorithm {
  name: string;
  digits: number;
  time: number;
  color: string;
}

const PiHomepage = () => {

  
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
      {/* Algorithm Categories */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20">
          <Target className="w-8 h-8 text-purple-400 mb-3" />
          <h3 className="text-lg font-semibold mb-2">¿Qué es π?</h3>
          <p className="text-sm text-slate-400 mb-3">
            La constante matemática que relaciona la circunferencia de un círculo con su diámetro. 
            Es un número irracional y trascendente con infinitos dígitos no periódicos.
          </p>
          <div className="text-xs text-slate-500">
            Aproximación: 3.14159265358979323846...
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-blue-500/20">
          <Zap className="w-8 h-8 text-blue-400 mb-3" />
          <h3 className="text-lg font-semibold mb-2">Métodos de Cálculo</h3>
          <p className="text-sm text-slate-400 mb-3">
            Desde aproximaciones geométricas hasta series infinitas y algoritmos modernos. 
            Cada método tiene diferente eficiencia y precisión.
          </p>
          <div className="text-xs text-slate-500">
            Probabilísticos • Series • Algoritmos iterativos
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/20">
          <Activity className="w-8 h-8 text-green-400 mb-3" />
          <h3 className="text-lg font-semibold mb-2">Limitaciones Técnicas</h3>
          <p className="text-sm text-slate-400 mb-3">
            En este sistema (Raspberry Pi 4 con C/long double) la precisión máxima es de 33 dígitos. 
            Los algoritmos modernos alcanzan este límite rápidamente.
          </p>
          <div className="text-xs text-slate-500">
            Máx. 33 dígitos | Precisión de hardware
          </div>
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