import React, { useState, useEffect, useCallback } from 'react';
import ChatModal from './ChatModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { useAuth } from '../context/AuthContext';

function DocumentList() {
  const [chatDoc, setChatDoc] = useState(null);
  const [docToDelete, setDocToDelete] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const limit = 10;

  const fetchDocuments = useCallback(async (currentPage = 1) => {
    if (!token) {
      setDocuments([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/upload/documents?page=${currentPage}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const mappedDocs = data.data.documents.map(doc => ({
          ...doc,
          name: doc.originalName || doc.filename,
          type: doc.mimetype === 'application/pdf' ? 'PDF' : doc.mimetype?.includes('csv') ? 'CSV' : 'TXT',
          date: new Date(doc.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          size: doc.size ? `${(doc.size / 1024 / 1024).toFixed(2)} MB` : 'Unknown',
          status: doc.status === 'ready' ? 'Ready' : doc.status === 'processing' ? 'Processing' : doc.status === 'error' ? 'Error' : 'Ready'
        }));
        setDocuments(mappedDocs);
        if (data.data.pagination) {
          setTotalPages(data.data.pagination.totalPages);
          setHasMore(data.data.pagination.hasMore);
        }
      } else {
        console.error("Failed to fetch documents");
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  }, [token, limit]);

  // Initial load when token or page changes
  useEffect(() => {
    fetchDocuments(page);
  }, [fetchDocuments, page]);

  // Listen for the custom uploaded event to auto-refresh the list
  useEffect(() => {
    const handleUploadEvent = () => {
      if (page === 1) {
        fetchDocuments(1); 
      } else {
        setPage(1); 
      }
    };
    window.addEventListener('documentUploaded', handleUploadEvent);
    return () => window.removeEventListener('documentUploaded', handleUploadEvent);
  }, [page, fetchDocuments]);

  const handleDownload = async (doc) => {
    try {
      if (!token) return alert('You must be logged in to download.');
      const response = await fetch(`http://localhost:3001/api/upload/documents/${doc._id}/download`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to download document');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', doc.name || 'document');
      document.body.appendChild(link);
      link.click();
      
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
      alert('Could not download the document. Ensure the backend is running and the file exists.');
    }
  };

  const handleDeleteConfirm = async (doc) => {
    try {
      if (!token) return;
      const response = await fetch(`http://localhost:3001/api/upload/documents/${doc._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }

      setDocToDelete(null);
      // Determine what page to fetch on success
      if (documents.length === 1 && page > 1) {
        // If it was the last doc on the current page, go back one page
        setPage(page - 1);
      } else {
        // Otherwise just reload this page
        fetchDocuments(page);
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Failed to delete document. Please try again.');
      setDocToDelete(null);
    }
  };

  return (
    <>
      <div className="w-full max-w-5xl mx-auto mt-16 px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            Your Documents
          </h2>
          <div className="flex gap-2">
            <button className="text-sm px-3 py-1.5 rounded-md bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm">
              Filter
            </button>
            <button className="text-sm px-3 py-1.5 rounded-md bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm">
              Sort
            </button>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100/80">
                  <th className="py-4 px-6 font-semibold text-gray-600 text-sm tracking-wider">File Name</th>
                  <th className="py-4 px-6 font-semibold text-gray-600 text-sm tracking-wider hidden md:table-cell">Date Added</th>
                  <th className="py-4 px-6 font-semibold text-gray-600 text-sm tracking-wider hidden sm:table-cell">Size</th>
                  <th className="py-4 px-6 font-semibold text-gray-600 text-sm tracking-wider">Status</th>
                  <th className="py-4 px-6 font-semibold text-gray-600 text-sm tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/80">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-gray-500">
                      <div className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading documents...
                      </div>
                    </td>
                  </tr>
                ) : documents.map((doc) => (
                  <tr key={doc._id} className="hover:bg-indigo-50/30 transition-colors duration-150 group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm
                          ${doc.type === 'PDF' ? 'bg-red-50 text-red-500' :
                            doc.type === 'CSV' ? 'bg-green-50 text-green-500' :
                            'bg-blue-50 text-blue-500'}
                        `}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 line-clamp-1">{doc.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5 md:hidden">{doc.date}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600 hidden md:table-cell">{doc.date}</td>
                    <td className="py-4 px-6 text-sm text-gray-600 hidden sm:table-cell">{doc.size}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border
                        ${doc.status === 'Ready'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm'
                          : doc.status === 'Error'
                          ? 'bg-red-50 text-red-700 border-red-200 shadow-sm'
                          : 'bg-amber-50 text-amber-700 border-amber-200 shadow-sm animate-pulse'}
                      `}>
                        {doc.status === 'Ready' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>}
                        {doc.status === 'Error' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5"></span>}
                        {doc.status === 'Processing' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>}
                        {doc.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2 transition-opacity duration-200">
                        {/* Chat button */}
                        <button
                          onClick={() => setChatDoc(doc)}
                          className="p-1.5 rounded-md text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          title="Chat with document"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                          </svg>
                        </button>

                        {/* Download button */}
                        <button
                          onClick={() => handleDownload(doc)}
                          className="p-1.5 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Download"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                          </svg>
                        </button>

                        {/* Delete button */}
                        <button
                          onClick={() => setDocToDelete(doc)}
                          className="p-1.5 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!loading && documents.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center mb-4 border border-gray-100 shadow-inner">
                  <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-800">No Documents Uploaded</h3>
                <p className="text-gray-500 font-medium max-w-sm mt-1">Upload your first PDF document above to get started with the RAG engine.</p>
              </div>
            )}

            {/* Pagination Controls */}
            {!loading && documents.length > 0 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100/80 bg-gray-50/50">
                <span className="text-sm text-gray-600">
                  Page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages === 0 ? 1 : totalPages}</span>
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1.5 text-sm font-medium rounded text-indigo-600 bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={!hasMore}
                    className="px-3 py-1.5 text-sm font-medium rounded text-indigo-600 bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {docToDelete && (
        <DeleteConfirmationModal
          document={docToDelete}
          onClose={() => setDocToDelete(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {/* Chat Modal */}
      {chatDoc && (
        <ChatModal
          document={chatDoc}
          onClose={() => setChatDoc(null)}
        />
      )}
    </>
  );
}

export default DocumentList;
