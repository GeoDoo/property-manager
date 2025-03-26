import axios from 'axios';
import { Property } from '../types/Property';

const API_URL = 'http://localhost:8081/api/properties';

export const propertyService = {
    getAll: async () => {
        const response = await axios.get<Property[]>(API_URL);
        return response.data;
    },

    getById: async (id: number) => {
        const response = await axios.get<Property>(`${API_URL}/${id}`);
        return response.data;
    },

    create: async (property: Property) => {
        const response = await axios.post<Property>(API_URL, property);
        return response.data;
    },

    update: async (id: number, property: Property) => {
        const response = await axios.put<Property>(`${API_URL}/${id}`, property);
        return response.data;
    },

    delete: async (id: number) => {
        await axios.delete(`${API_URL}/${id}`);
    }
}; 