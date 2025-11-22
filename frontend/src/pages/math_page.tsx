import React, { useState, useEffect } from 'react';
import { Sigma} from 'lucide-react';
import { Formula } from '../types/types';
import { FormulaCard } from '../components/formula_card';
import { FormulaModal } from '../components/formula_modal';
import { fetchAlgorithmsInfo } from '../services/algorithmService';
import "katex/dist/katex.min.css";

const FormulasPage: React.FC = () => {
  const [selectedFormula, setSelectedFormula] = useState<Formula | null>(null);
  const [formulasData, setAlgorithms] = useState<Formula[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
      const loadAlgorithms = async () => {
        const algoList = await fetchAlgorithmsInfo();
        setAlgorithms(algoList);
        setLoading(false);
      };
  
      loadAlgorithms();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-xl text-slate-400">Cargando algoritmos...</div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sigma className="w-12 h-12 text-purple-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Fundamentos Matemáticos de π
            </h1>
          </div>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Exploración profunda de las fórmulas, algoritmos y teorías matemáticas
            detrás del cálculo de la constante más fascinante de las matemáticas
          </p>
        </div>

        {/* Formula Cards Grid*/}
        <FormulaCard 
          formulas={formulasData} 
          onFormulaSelect={setSelectedFormula} 
        />

        {/* Detailed Modal */}
        {selectedFormula && (
          <FormulaModal 
            formula={selectedFormula} 
            onClose={() => setSelectedFormula(null)} 
          />
        )}

      </div>
    </div>
  );
};

export default FormulasPage;