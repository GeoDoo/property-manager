import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { propertyService } from '../../services/propertyService';
import PropertyCard from './PropertyCard';
import { Property } from '../../types/property';
import { Layout } from '../Layout/Layout';

export default function PropertyList() {
  const { data: properties, isLoading, error } = useQuery<Property[]>({
    queryKey: ['properties'],
    queryFn: propertyService.getAll,
  });

  return (
    <Layout>
      {isLoading && (
        <div className="flex justify-center items-center min-h-[40vh]">
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      )}
      
      {error && (
        <div className="flex justify-center items-center min-h-[40vh]">
          <div className="text-lg text-red-600">Error loading properties</div>
        </div>
      )}
      
      {!isLoading && !error && !properties?.length && (
        <div className="flex flex-col justify-center items-center min-h-[40vh] bg-gray-50 rounded-lg p-8">
          <div className="text-lg text-gray-600 mb-2">No properties found</div>
          <div className="text-sm text-gray-500">Add a new property to get started</div>
        </div>
      )}

      {!isLoading && !error && properties && properties.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property: Property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </Layout>
  );
} 