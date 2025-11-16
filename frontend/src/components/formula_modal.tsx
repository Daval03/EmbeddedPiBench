import React from 'react';
import { Sigma, Info } from 'lucide-react';
import { BlockMath } from "react-katex";
import { Formula } from '../types/types';

interface FormulaModalProps {
  formula: Formula;
  onClose: () => void;
}

export const FormulaModal: React.FC<FormulaModalProps> = ({ 
  formula, 
  onClose 
}) => {
  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">{formula.name}</h2>
              <p className="text-purple-100">{formula.description}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Formula */}
          <div>
            <h3 className="text-lg font-semibold text-purple-300 mb-3 flex items-center gap-2">
              <Sigma className="w-5 h-5" />
              Fórmula Matemática
            </h3>
            <div className="bg-slate-900 rounded-lg p-4 text-center text-sm text-slate-200 overflow-x-auto border border-slate-700">
              <BlockMath>{formula.formula}</BlockMath>
            </div>
          </div>

          {/* Deep Explanation */}
          <div>
            <h3 className="text-lg font-semibold text-purple-300 mb-3 flex items-center gap-2">
              <Info className="w-5 h-5" />
              Explicación Profunda
            </h3>
            <p className="text-slate-300 leading-relaxed">{formula.deepExplanation}</p>
          </div>

          {/* Technical Details Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
              <h4 className="font-semibold text-green-400 mb-2">Convergencia</h4>
              <p className="text-slate-300 text-sm">{formula.convergence}</p>
            </div>
            
            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
              <h4 className="font-semibold text-blue-400 mb-2">Complejidad</h4>
              <p className="text-slate-300 text-sm">{formula.complexity}</p>
            </div>
          </div>

          {/* Applications */}
          <div>
            <h3 className="text-lg font-semibold text-purple-300 mb-3">Aplicaciones Prácticas</h3>
            <p className="text-slate-300">{formula.applications}</p>
          </div>

        </div>
      </div>
    </div>
  );
};