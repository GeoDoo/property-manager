import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { propertyService } from '../services/propertyService';
import { Property } from '../types/Property';
import { Button } from './Button';

export function PropertyList() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: properties, isLoading } = useQuery({
        queryKey: ['properties'],
        queryFn: propertyService.getAll
    });

    const deleteMutation = useMutation({
        mutationFn: propertyService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['properties'] });
        }
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Properties</h1>
                <Button
                    onClick={() => navigate('/property/new')}
                >
                    Add Property
                </Button>
            </div>
            <div className="grid gap-4">
                {properties?.map(property => (
                    <div key={property.id} className="bg-white p-4 rounded-lg shadow">
                        <div className="flex justify-between items-start">
                            <Link 
                                to={`/property/${property.id}`}
                                className="text-blue-600 hover:text-blue-800 text-lg font-semibold"
                            >
                                {property.address}
                            </Link>
                            <div className="text-xl font-bold">
                                ${property.price.toLocaleString()}
                            </div>
                        </div>
                        <div className="mt-2 text-gray-600">
                            {property.bedrooms} beds • {property.bathrooms} baths • {property.squareFootage} sqft
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 