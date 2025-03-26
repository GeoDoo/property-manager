import axios from 'axios';
import { Property } from '../types/Property';

const API_URL = 'http://localhost:8081/api';

export const propertyService = {
    getAll: async () => {
        const response = await axios.get<Property[]>(API_URL + '/properties');
        return response.data;
    },

    getById: async (id: number) => {
        const response = await axios.get<Property>(API_URL + '/properties/' + id);
        return response.data;
    },

    create: async (property: Property) => {
        const response = await axios.post<Property>(API_URL + '/properties', property);
        return response.data;
    },

    update: async (id: number, property: Property) => {
        const response = await axios.put<Property>(API_URL + '/properties/' + id, property);
        return response.data;
    },

    delete: async (id: number) => {
        await axios.delete(API_URL + '/properties/' + id);
    },

    search: async (params: { streetName?: string }): Promise<Property[]> => {
        console.log('propertyService.search called with:', params);
        const response = await axios.get<Property[]>(`${API_URL}/properties/search`, {
            params: {
                streetName: params.streetName
            }
        });
        console.log('Search response:', response.data);
        return response.data;
    }
}; 