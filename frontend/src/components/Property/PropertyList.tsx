import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Property } from '../../types/property';
import { PropertyCard } from './PropertyCard';

export const PropertyList = () => {
    const { data: properties, isLoading, error } = useQuery({
        queryKey: ['properties'],
        queryFn: async () => {
            const { data } = await axios.get<Property[]>('/api/properties');
            return data;
        },
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading properties</div>;

    return (
        <div className="property-list">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {properties?.map(property => (
                    <PropertyCard key={property.id} property={property} />
                ))}
            </div>
        </div>
    );
}; 