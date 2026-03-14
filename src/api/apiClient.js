const BASE_URL = 'http://localhost:3001/api';

// Reads token from localStorage on every call so it's always fresh
const getToken = () => localStorage.getItem('token');

const apiClient = {
  async request(endpoint, options = {}) {
    const token = getToken();
    const headers = {
      ...(options.headers || {}),
    };

    // Don't set Content-Type for FormData (browser sets it with boundary)
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || 'Something went wrong.');
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  },

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  },

  post(endpoint, body, options = {}) {
    const isFormData = body instanceof FormData;
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: isFormData ? body : JSON.stringify(body),
    });
  },
};

export default apiClient;
