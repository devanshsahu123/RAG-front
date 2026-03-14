import React from 'react';

// Dummy data for demonstration
const mockDocuments = [
  { id: 1, name: "Project_Proposal_Q3.pdf", type: "PDF", date: "Oct 24, 2023", size: "2.4 MB", status: "Ready" },
  { id: 2, name: "Financial_Report_2022.csv", type: "CSV", date: "Oct 22, 2023", size: "1.1 MB", status: "Processing" },
  { id: 3, name: "Meeting_Notes_Team_Alpha.txt", type: "TXT", date: "Oct 20, 2023", size: "45 KB", status: "Ready" },
];

function DocumentList() {
  return (
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
              {mockDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-indigo-50/30 transition-colors duration-150 group">
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
                        : 'bg-amber-50 text-amber-700 border-amber-200 shadow-sm animate-pulse'}
                    `}>
                      {doc.status === 'Ready' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>}
                      {doc.status === 'Processing' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>}
                      {doc.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button className="p-1.5 rounded-md text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors" title="Chat">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                        </svg>
                      </button>
                      <button className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Delete">
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
          
          {mockDocuments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No documents uploaded yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DocumentList;
