import axios from 'axios';

// Set API URL directly to work in both environments
export const API_URL = 'http://localhost:8081/api';

// Utility functions for token management
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Create an axios instance with default config
export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to include auth token
api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Unauthorized - redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const getFullImageUrl = (imageUrl: string) => {
    if (!imageUrl) return '';
    
    // If it's already a full URL, use it as is
    if (imageUrl.startsWith('http')) return imageUrl;
    
    // Extract the filename from /images/filename.jpg pattern
    const parts = imageUrl.split('/');
    const filename = parts[parts.length - 1];
    
    // Return the full API URL to the image endpoint with the filename
    return `${API_URL}/images/${filename}`;
}; 