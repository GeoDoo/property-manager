import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import PropertyCard from './PropertyCard';
import Filter from './Filter';
import { Property } from '../../types/property';
import { fetchProperties } from '../../services/api';
import { Layout } from '../Layout/Layout';

// Validation and sanitization functions
const sanitizeString = (str: string | null): string => {
  if (!str) return '';
  // Remove any HTML tags and limit length
  return str.replace(/<[^>]*>/g, '').slice(0, 100);
};

const sanitizeNumber = (str: string | null): string => {
  if (!str) return '';
  // Only allow digits
  return str.replace(/\D/g, '');
};

const PropertyList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Sanitize and validate URL parameters
  const filters = {
    address: sanitizeString(searchParams.get('address')),
    minPrice: sanitizeNumber(searchParams.get('minPrice')),
    maxPrice: sanitizeNumber(searchParams.get('maxPrice')),
    bedrooms: sanitizeNumber(searchParams.get('bedrooms')),
    page: parseInt(searchParams.get('page') || '0'),
    size: parseInt(searchParams.get('size') || '12'),
  };

  console.log('Current filters:', filters);

  const { data, isLoading, error } = useQuery({
    queryKey: ['properties', filters],
    queryFn: () => fetchProperties(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleFilterChange = (newFilters: typeof filters) => {
    const params = new URLSearchParams();
    
    // Only add non-empty, sanitized values to URL
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, value.toString());
      }
    });
    
    setSearchParams(params);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    console.error('Error loading properties:', error);
    return (
      <Layout>
        <div className="text-center text-red-500 p-4">
          Error loading properties. Please try again later.
        </div>
      </Layout>
    );
  }

  console.log('Rendering with data:', data);

  const properties = data?.content || [];
  const totalPages = data?.totalPages || 0;
  const currentPage = data?.number || 0;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Filter onFilterChange={handleFilterChange} initialFilters={filters} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property: Property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
        {!isLoading && (!data || data.empty) && (
          <div className="text-center text-gray-500 p-4">
            No properties found matching your criteria.
          </div>
        )}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={data?.first}
                className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={data?.last}
                className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PropertyList; 