// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header';
import Footer from './components/footer';
import PiHomepage from './pages/home_page';
import AlgorithmsPage from './pages/algorithm_page';
import PiAlgorithmsComparison from './pages/comparison_page';
import FormulasPage from './pages/math_page';

const App: React.FC = () => {
  return (
    <Router>
      <div className='d-flex flex-column min-vh-100'>
        <Header />
        <div className='flex-grow-1'>
          <Routes>
            <Route path="/" element={<PiHomepage />} />
            <Route path="/home" element={<PiHomepage />} />
            <Route path="/algorithms" element={<AlgorithmsPage />} />
            <Route path="/compare" element={<PiAlgorithmsComparison />} />
            <Route path="/math" element={<FormulasPage />} />
          </Routes>
        </div>
        <Footer companyName='' year={2025}/>
      </div>
    </Router>
  );
}

export default App;