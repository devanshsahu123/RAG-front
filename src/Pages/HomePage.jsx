import React from 'react';
import UploadSection from '../components/UploadSection';
import DocumentList from '../components/DocumentList';

function HomePage() {
  return (
    <div className="flex-grow pt-8 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <UploadSection />
      <DocumentList />
    </div>
  );
}

export default HomePage;
