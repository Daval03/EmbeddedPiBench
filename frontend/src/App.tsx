// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './componets/header';
import Footer from './componets/footer';
import PiHomepage from './pages/home_page';
import AlgorithmsPage from './pages/algorithm_page';

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
          </Routes>
        </div>
        <Footer companyName='Test' year={2024}/>
      </div>
    </Router>
  );
}

export default App;