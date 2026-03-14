import apiClient from './apiClient';

// POST /api/auth/register
export const registerUser = (name, email, password) =>
  apiClient.post('/auth/register', { name, email, password });

// POST /api/auth/login
export const loginUser = (email, password) =>
  apiClient.post('/auth/login', { email, password });

// GET /api/auth/me  (uses token automatically from apiClient)
export const getMe = () =>
  apiClient.get('/auth/me');
