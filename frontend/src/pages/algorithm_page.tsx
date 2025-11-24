// src/App.js
import React, { useState, useEffect } from 'react';
import {AlgorithmCard} from '../components/algorithm_card';
import { Container, Row, Col } from 'react-bootstrap';
import { fetchAlgorithms } from '../services/apiService';
import {AlgorithmInfo} from '../types/types';


const AlgorithmsPage: React.FC = () => {
  const [algorithms, setAlgorithms] = useState<AlgorithmInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAlgorithms = async () => {
      const algoList = await fetchAlgorithms();
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
            Exploración de Algoritmos para Calcular π
        </h1>

        <p className="text-xl text-slate-400 max-w-2xl mx-auto text-center mb-8">
        Evaluación comparativa de {algorithms.length} algoritmos ejecutados en una Raspberry Pi 4,
        analizando eficiencia, velocidad y precisión.
        </p>
        <Container className="my-4">
          <Row>
            {algorithms.map((algorithm, index) => (
              <Col lg={6} className="mb-4" key={algorithm.name}>
                <AlgorithmCard algorithm={algorithm} />
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default AlgorithmsPage;