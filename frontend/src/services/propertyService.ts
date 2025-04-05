import axios, { AxiosError } from 'axios';
import { Property, Image } from '../types/property';
import { API_URL } from '../config/api';

// Define validation error type
export interface ValidationError {
    [key: string]: string;
}

// Configure axios defaults
axios.defaults.baseURL = API_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add error interceptor to handle validation errors
axios.interceptors.response.use(
    response => response,
    (error: AxiosError) => {
        if (error.response?.status === 400 && error.response.data) {
            // If it's a validation error, throw it with the validation messages
            throw error.response.data as ValidationError;
        }
        throw error;
    }
);

export const propertyService = {
    getAll: async () => {
        const response = await axios.get<Property[]>('/properties');
        return response.data;
    },

    getById: async (id: number) => {
        try {
            // Try the paginated endpoint first
            const response = await axios.get<Property>(`/properties/${id}`);
            return response.data;
        } catch (error) {
            console.error("Failed to get property by ID from /properties/:id", error);
            
            // Fallback to get it from the list
            const allProperties = await axios.get<any>('/properties');
            const property = allProperties.data.content.find((p: Property) => p.id === id);
            
            if (!property) {
                throw new Error(`Property with ID ${id} not found`);
            }
            
            return property;
        }
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