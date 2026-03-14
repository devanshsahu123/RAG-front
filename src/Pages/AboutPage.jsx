import React from 'react';

function AboutPage() {
  return (
    <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">About RAG AI</h1>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        RAG AI is a platform that allows you to chat with your documents using advanced
        Retrieval-Augmented Generation capabilities.
      </p>
    </div>
  );
}

export default AboutPage;
