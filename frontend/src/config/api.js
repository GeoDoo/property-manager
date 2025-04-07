// API configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

export const getFullImageUrl = (imageUrl) => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${API_URL}${imageUrl.replace(/^\/api/, '')}`;
}; 