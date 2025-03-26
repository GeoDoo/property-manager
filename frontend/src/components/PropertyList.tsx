import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { propertyService } from '../services/propertyService';
import { Property } from '../types/Property';

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
                <button
                    onClick={() => navigate('/property/new')}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Add Property
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {properties?.map((property) => (
                    <div key={property.id} className="border p-4 rounded-lg shadow">
                        <h2 className="text-xl font-semibold">{property.address}</h2>
                        <p>Price: ${property.price.toLocaleString()}</p>
                        <p>Bedrooms: {property.bedrooms}</p>
                        <p>Bathrooms: {property.bathrooms}</p>
                        <p>Square Footage: {property.squareFootage}</p>
                        <div className="mt-4 flex gap-2">
                            <button
                                onClick={() => navigate(`/property/${property.id}/edit`)}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => property.id && deleteMutation.mutate(property.id)}
                                className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 