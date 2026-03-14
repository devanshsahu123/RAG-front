import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full backdrop-blur-lg bg-white/10 p-8 rounded-3xl shadow-2xl border border-white/20 transform hover:scale-105 transition-all duration-300">
        <div className="flex flex-col items-center space-y-6">
          <div className="h-24 w-24 bg-gradient-to-tr from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg animate-pulse" />
          
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-200 text-center tracking-tight">
            React + Tailwind
          </h1>
          
          <p className="text-blue-100/80 text-center leading-relaxed font-light">
            Your application is fully configured and ready to build modern, stunning user interfaces exclusively with Tailwind CSS.
          </p>
          
          <button className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg hover:shadow-cyan-500/30 hover:-translate-y-1 transition-all duration-200">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
