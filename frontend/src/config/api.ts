export const API_URL = import.meta.env.VITE_API_URL;

export const getFullImageUrl = (imageUrl: string) => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${API_URL}${imageUrl.replace(/^\/api/, '')}`;
}; 