import React, { useState, useEffect } from 'react';
import UploadSection from '../components/UploadSection';
import DocumentList from '../components/DocumentList';
import LoginModal from '../components/LoginModal';

function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    setIsAuthenticated(!!(token && userId));
  };

  useEffect(() => {
    checkAuth();
    // Re-check whenever localStorage changes (e.g. after LoginModal saves token)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  // Also expose a global trigger so LoginModal inside UploadSection can notify HomePage
  useEffect(() => {
    const handler = () => checkAuth();
    window.addEventListener('auth:updated', handler);
    return () => window.removeEventListener('auth:updated', handler);
  }, []);

  const handleLoginSuccess = () => {
    checkAuth();
    setShowLoginModal(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center px-4 py-24 text-center">
        {/* Icon */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-6 shadow-inner">
          <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Please Login to Continue</h2>
        <p className="text-gray-500 max-w-sm mb-8 text-base leading-relaxed">
          Sign in to upload your documents and start chatting with them using our RAG engine.
        </p>

        <button
          onClick={() => setShowLoginModal(true)}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/40 hover:-translate-y-0.5 transform transition-all duration-200"
        >
          Sign In
        </button>

        {showLoginModal && (
          <LoginModal
            onClose={() => setShowLoginModal(false)}
            onLoginSuccess={handleLoginSuccess}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex-grow pt-8 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <UploadSection />
      <DocumentList />
    </div>
  );
}

export default HomePage;
