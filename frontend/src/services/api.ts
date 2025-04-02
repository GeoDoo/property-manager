import { Property } from '../types/property';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

interface Filters {
  address: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  page?: number;
  size?: number;
}

interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export const fetchProperties = async (filters: Filters): Promise<Page<Property>> => {
  const params = new URLSearchParams();
  
  if (filters.address) params.append('address', filters.address);
  if (filters.minPrice) params.append('minPrice', filters.minPrice);
  if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
  if (filters.bedrooms) params.append('bedrooms', filters.bedrooms);
  if (filters.page !== undefined) params.append('page', filters.page.toString());
  if (filters.size !== undefined) params.append('size', filters.size.toString());

  console.log('Fetching properties with params:', params.toString());
  const response = await fetch(`${API_URL}/properties/search?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch properties');
  }
  const data = await response.json();
  console.log('Received properties data:', data);

  // If the response is an array, convert it to a Page object
  if (Array.isArray(data)) {
    return {
      content: data,
      totalElements: data.length,
      totalPages: 1,
      size: data.length,
      number: 0,
      first: true,
      last: true,
      empty: data.length === 0
    };
  }

  return data;
}; 