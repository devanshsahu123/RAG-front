import React, { useState, useRef } from 'react';
import LoginModal from './LoginModal';
import { useAuth } from '../context/AuthContext';
import { uploadDocument } from '../api/upload';

function UploadSection() {
  const { isAuthenticated } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [uploadStatus, setUploadStatus] = useState('idle'); // 'idle' | 'uploading' | 'success' | 'error'
  const fileInputRef = useRef(null);

  // ── Guard: open modal if not logged in ──────────────────────
  const handleUploadIntent = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    fileInputRef.current?.click();
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    fileInputRef.current?.click();
  };

  // ── File validation + real API upload ───────────────────────
  const validateAndUpload = async (file) => {
    setUploadError('');
    setUploadStatus('idle');
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setUploadError('Only PDF files are allowed.');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setUploadStatus('uploading');

    try {
      await uploadDocument(file);
      setUploadStatus('success');
    } catch (err) {
      setUploadStatus('error');
      setUploadError(err.message || 'Upload failed. Please try again.');
    }
  };

  // ── Drag & Drop handlers ─────────────────────────────────────
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragging(true);
    else if (e.type === 'dragleave') setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    const file = e.dataTransfer.files?.[0];
    validateAndUpload(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    validateAndUpload(file);
    e.target.value = '';
  };

  return (
    <>
      {/* Hidden file input — PDF only */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="w-full max-w-3xl mx-auto my-12">
        {/* Hero text */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Chat with your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Documents
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your PDF file to instantly extract insights and ask questions using our powerful RAG engine.
          </p>
        </div>

        {/* Drop zone */}
        <div
          className={`relative group rounded-3xl border-2 border-dashed p-12 transition-all duration-300 ease-in-out flex flex-col items-center justify-center text-center cursor-pointer overflow-hidden
            ${isDragging
              ? 'border-indigo-500 bg-indigo-50/50 scale-[1.02]'
              : 'border-indigo-200 bg-white hover:border-indigo-400 hover:bg-slate-50 shadow-sm hover:shadow-md'
            }
          `}
          onClick={handleUploadIntent}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {/* Animated blobs */}
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>

          <div className="relative z-10 flex flex-col items-center">
            <div className={`w-20 h-20 mb-6 rounded-full flex items-center justify-center transition-all duration-300
              ${isDragging ? 'bg-indigo-100 scale-110' : 'bg-indigo-50 group-hover:bg-indigo-100 group-hover:scale-105'}
            `}>
              <svg
                className={`w-10 h-10 transition-colors duration-300 ${isDragging ? 'text-indigo-600' : 'text-indigo-500 group-hover:text-indigo-600'}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {selectedFile ? selectedFile.name : 'Click to upload or drag & drop'}
            </h3>
            <p className="text-gray-500 mb-6 text-sm">
              {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB · PDF` : 'PDF only (max. 50MB)'}
            </p>

            {/* Error message */}
            {uploadError && (
              <p className="text-sm text-red-500 bg-red-50 rounded-lg px-4 py-2 mb-4">{uploadError}</p>
            )}

            {/* Status badges */}
            {uploadStatus === 'uploading' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 mb-4 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                Uploading…
              </span>
            )}
            {uploadStatus === 'success' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Uploaded successfully!
              </span>
            )}

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleUploadIntent(); }}
              disabled={uploadStatus === 'uploading'}
              className="relative overflow-hidden rounded-full bg-white px-8 py-3 font-semibold text-indigo-600 shadow-sm ring-1 ring-inset ring-indigo-200 hover:bg-gray-50 hover:ring-indigo-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadStatus === 'uploading' ? 'Uploading…' : selectedFile ? 'Change File' : 'Select PDF'}
            </button>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </>
  );
}

export default UploadSection;
