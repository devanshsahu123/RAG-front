import apiClient from './apiClient';

// POST /api/upload  — sends file as multipart/form-data
export const uploadDocument = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return apiClient.post('/upload', formData);
};

// GET /api/upload/documents  — list documents for authenticated user
export const getDocuments = () =>
  apiClient.get('/upload/documents');
