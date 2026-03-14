import React, { useState } from 'react';

function UploadSection() {
  const [isDragging, setIsDragging] = useState(false);

  // Simplified handlers for visual effect
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    // In a real app, handle file processing here
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
          Chat with your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Documents</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Upload your resume, research papers, or any PDF/TXT file to instantly extract insights and ask questions using our powerful RAG engine.
        </p>
      </div>

      <div 
        className={`relative group rounded-3xl border-2 border-dashed p-12 transition-all duration-300 ease-in-out flex flex-col items-center justify-center text-center cursor-pointer overflow-hidden
          ${isDragging 
            ? 'border-indigo-500 bg-indigo-50/50 scale-[1.02]' 
            : 'border-indigo-200 bg-white hover:border-indigo-400 hover:bg-slate-50 shadow-sm hover:shadow-md'
          }
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {/* Animated background blob */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 animation-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 animation-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 animation-blob animation-delay-4000"></div>

        <div className="relative z-10 flex flex-col items-center">
          <div className={`w-20 h-20 mb-6 rounded-full flex items-center justify-center transition-all duration-300
            ${isDragging ? 'bg-indigo-100 scale-110' : 'bg-indigo-50 group-hover:bg-indigo-100 group-hover:scale-105'}
          `}>
             <svg className={`w-10 h-10 transition-colors duration-300 ${isDragging ? 'text-indigo-600' : 'text-indigo-500 group-hover:text-indigo-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Click to upload or drag & drop
          </h3>
          <p className="text-gray-500 mb-6 text-sm">
            PDF, TXT, DOCX, or CSV (max. 50MB)
          </p>

          <button className="relative overflow-hidden rounded-full bg-white px-8 py-3 font-semibold text-indigo-600 shadow-sm ring-1 ring-inset ring-indigo-200 hover:bg-gray-50 hover:ring-indigo-300 transition-all duration-200">
            Select Files
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadSection;
