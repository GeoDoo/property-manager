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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading properties</div>;
  if (!properties?.length) return <div>No properties found</div>;

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property: Property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </Layout>
  );
} 