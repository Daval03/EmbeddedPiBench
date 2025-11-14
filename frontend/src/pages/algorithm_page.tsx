// src/App.js
import React from 'react';
import {AlgorithmCard, AlgorithmInfo} from '../componets/algorithm_card';
import { Container, Row, Col } from 'react-bootstrap';

const bbpAlgorithm: AlgorithmInfo = {
    name: "BBP Algorithm",
    description: "Bailey–Borwein–Plouffe formula for calculating π",
    language: "c++",
    code: "long double bbp(long long iterations){\n    long double pi = 0.0L;\n    long double power_16 = 1.0L;\n    for(long long k = 0; k < iterations; ++k) {\n        long double k8 = 8.0L * k;\n        long double term = power_16 * (\n            4.0L / (k8 + 1.0L) -\n            2.0L / (k8 + 4.0L) -\n            1.0L / (k8 + 5.0L) -\n            1.0L / (k8 + 6.0L)\n        );\n        pi += term;\n        power_16 /= 16.0L;\n    }\n    return pi;\n}"
  };


const AlgorithmsPage: React.FC = () => {
    return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Comparación de 12 algoritmos ejecutándose en una Raspberry Pi 4. 
            Desde métodos probabilísticos hasta series infinitas.
        </p>
        <Container className="my-4">
            <Row>
                <Col lg={6} className="mb-4">
                    <AlgorithmCard algorithm={bbpAlgorithm} />
                </Col>
            </Row>
        </Container>
    </div>
    );
}

export default AlgorithmsPage;