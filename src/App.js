import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './Pages/HomePage';
import AboutPage from './Pages/AboutPage';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex flex-col font-sans text-gray-900 selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />
      <main className="flex-grow flex flex-col relative z-10 w-full">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>

      {/* Decorative background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-100/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
      </div>
    </div>
  );
}

export default App;

