import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { propertyService } from '../services/propertyService';
import debounce from 'lodash/debounce';

export function SearchBar() {
    const [searchTerm, setSearchTerm] = useState('');
    
    const { data: properties, isLoading, error } = useQuery({
        queryKey: ['properties', searchTerm],
        queryFn: () => {
            console.log('Making API request for:', searchTerm);
            return propertyService.search({ streetName: searchTerm });
        },
        enabled: searchTerm.length > 0,
        staleTime: 0
    });

    const debouncedSearch = useCallback(
        debounce((value: string) => {
            console.log('Debounced value:', value);
            setSearchTerm(value.trim());
        }, 300),
        []
    );

    console.log('Current searchTerm:', searchTerm);

    return (
        <div className="w-full max-w-2xl mx-auto p-4">
            <div className="relative">
                <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search by street name..."
                    onChange={(e) => {
                        console.log('Input changed:', e.target.value);
                        debouncedSearch(e.target.value);
                    }}
                />
            </div>
            
            {isLoading && (
                <div className="mt-4 text-center text-gray-600">
                    Searching...
                </div>
            )}
            
            {error && (
                <div className="mt-4 text-center text-red-600">
                    Error loading properties. Please try again.
                </div>
            )}
            
            {properties && properties.length === 0 && searchTerm && (
                <div className="mt-4 text-center text-gray-600">
                    No properties found matching "{searchTerm}"
                </div>
            )}
            
            {properties && properties.length > 0 && (
                <div className="mt-4 space-y-4">
                    {properties.map(property => (
                        <div 
                            key={property.id}
                            className="p-4 border rounded-lg shadow hover:shadow-md transition-shadow"
                        >
                            <h3 className="font-bold">{property.address}</h3>
                            <p className="text-gray-600">£{property.price.toLocaleString()}</p>
                            <p className="text-gray-600">
                                {property.bedrooms} beds • {property.bathrooms} baths • {property.squareFootage} sq ft
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
} 