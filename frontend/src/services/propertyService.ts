import axios from 'axios';
import { Property, Image } from '../types/property';

// Configure axios defaults
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';
axios.defaults.headers.common['Content-Type'] = 'application/json';

export const propertyService = {
    getAll: async () => {
        const response = await axios.get<Property[]>('/properties');
        return response.data;
    },

    getById: async (id: number) => {
        const response = await axios.get<Property>(`/properties/${id}`);
        return response.data;
    },

    create: async (property: Property) => {
        const response = await axios.post<Property>('/properties', property);
        return response.data;
    },

    update: async (id: number, property: Property) => {
        const response = await axios.put<Property>(`/properties/${id}`, property);
        return response.data;
    },

    delete: async (id: number) => {
        await axios.delete(`/properties/${id}`);
    },

    uploadImage: async (propertyId: number, files: File[]) => {
        const formData = new FormData();
        if (Array.isArray(files)) {
            files.forEach(file => {
                formData.append('files', file);
            });
        } else {
            console.error('Files parameter is not an array:', files);
            throw new Error('Invalid files parameter');
        }
        const response = await axios.post<Image[]>(`/images/upload/${propertyId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    getPropertyImages: async (propertyId: number) => {
        const response = await axios.get<Image[]>(`/images/property/${propertyId}`);
        return response.data;
    },

    deleteImage: async (imageId: number) => {
        await axios.delete(`/images/${imageId}`);
    }
}; 