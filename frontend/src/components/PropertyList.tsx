import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { propertyService } from '../services/propertyService';
import { Button } from './Button';

export function PropertyList() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    
    const { data: properties } = useQuery({
        queryKey: ['properties'],
        queryFn: propertyService.getAll
    });

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Properties</h1>
                <Button onClick={() => navigate('/property/new')}>
                    Add Property
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {properties?.map(property => (
                    <div key={property.id} className="bg-white p-4 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-2">{property.address}</h2>
                        <p className="text-gray-600">${property.price.toLocaleString()}</p>
                        <p className="text-gray-600">{property.bedrooms} beds • {property.bathrooms} baths</p>
                        <p className="text-gray-600">{property.squareFootage} sq ft</p>
                        <div className="mt-4 flex justify-end gap-2">
                            <Button 
                                variant="secondary"
                                onClick={() => navigate(`/edit/${property.id}`)}
                            >
                                Edit
                            </Button>
                            <Button 
                                variant="danger"
                                onClick={async () => {
                                    if (window.confirm('Are you sure you want to delete this property?')) {
                                        await propertyService.delete(property.id);
                                        queryClient.invalidateQueries({ queryKey: ['properties'] });
                                    }
                                }}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 