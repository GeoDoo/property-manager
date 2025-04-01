import axios from 'axios';
import { Property } from '../types/property';

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

    search: async (params: { streetName?: string }): Promise<Property[]> => {
        console.log('propertyService.search called with:', params);
        const response = await axios.get<Property[]>('/properties/search', {
            params: {
                streetName: params.streetName
            }
        });
        console.log('Search response:', response.data);
        return response.data;
    }
}; 