import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const api = {
  // Health check
  healthCheck: () => apiClient.get('/'),

  // Generate AI message
  generateMessage: (personName, relationship) => 
    apiClient.post('/generate-message', {
      person_name: personName,
      relationship: relationship
    }),

  // Upload files
  uploadFiles: (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    return apiClient.post('/upload-files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Create birthday wish
  createWish: (wishData) => 
    apiClient.post('/wishes', {
      person_name: wishData.personName,
      relationship: wishData.relationship,
      message: wishData.message,
      photos: wishData.photos,
      custom_no_texts: wishData.customNoTexts
    }),

  // Get birthday wish
  getWish: (wishId) => 
    apiClient.get(`/wishes/${wishId}`),

  // Update birthday wish
  updateWish: (wishId, wishData) => 
    apiClient.put(`/wishes/${wishId}`, {
      person_name: wishData.personName,
      relationship: wishData.relationship,
      message: wishData.message,
      photos: wishData.photos,
      custom_no_texts: wishData.customNoTexts
    }),

  // Delete birthday wish
  deleteWish: (wishId) => 
    apiClient.delete(`/wishes/${wishId}`),

  // Get all wishes (admin)
  getAllWishes: () => 
    apiClient.get('/wishes'),
};

export default api;