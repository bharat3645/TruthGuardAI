import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { DeepfakeDetection } from './pages/DeepfakeDetection';
import { FakeNewsDetection } from './pages/FakeNewsDetection';
import { About } from './pages/About';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/deepfake" element={<DeepfakeDetection />} />
            <Route path="/fakenews" element={<FakeNewsDetection />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;