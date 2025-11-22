import React from 'react';
import { BookOpen, TrendingUp } from 'lucide-react';
import { BlockMath } from "react-katex";
import { FormulaCardProps } from '../types/types';

export const FormulaCard: React.FC<FormulaCardProps> = ({ 
  formulas, 
  onFormulaSelect 
}) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {formulas.map((formula) => (
        <div
          key={formula.id}
          className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer"
          onClick={() => onFormulaSelect(formula)}
        >
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-bold text-purple-300">{formula.name}</h3>
            <BookOpen className="w-5 h-5 text-purple-400 flex-shrink-0" />
          </div>
          
          <div className="bg-slate-900/50 rounded p-3 mb-4 text-center text-sm text-slate-300 overflow-x-auto">
            <BlockMath>{formula.formula}</BlockMath>
          </div>

          <p className="text-slate-400 text-sm mb-4">{formula.description}</p>

          <div className="flex items-center gap-2 text-xs">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-slate-400">{formula.convergence}</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onFormulaSelect(formula);
            }}
            className="mt-4 w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-sm font-medium"
          >
            Ver Detalles Completos
          </button>
        </div>
      ))}
    </div>
  );
};