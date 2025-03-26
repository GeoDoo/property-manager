import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { propertyService } from '../services/propertyService';
import { Button } from './Button';

export function PropertyDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const { data: property, isLoading } = useQuery({
        queryKey: ['property', id],
        queryFn: () => propertyService.getById(Number(id))
    });

    if (isLoading) return <div>Loading...</div>;
    if (!property) return <div>Property not found</div>;

    return (
        <div className="container mx-auto p-4">
            <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">{property.address}</h1>
                    <Button
                        variant="secondary"
                        onClick={() => navigate('/')}
                    >
                        Back
                    </Button>
                </div>
                <div className="space-y-4">
                    <div className="text-3xl font-bold text-blue-600">
                        ${property.price.toLocaleString()}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-gray-600">
                        <div>
                            <span className="font-semibold">Bedrooms:</span> {property.bedrooms}
                        </div>
                        <div>
                            <span className="font-semibold">Bathrooms:</span> {property.bathrooms}
                        </div>
                        <div>
                            <span className="font-semibold">Square Footage:</span> {property.squareFootage}
                        </div>
                    </div>
                    <div className="mt-4">
                        <h2 className="text-xl font-semibold mb-2">Description</h2>
                        <p className="text-gray-600">{property.description}</p>
                    </div>
                    <div className="flex gap-2 mt-6">
                        <Button
                            onClick={() => navigate(`/property/${property.id}/edit`)}
                        >
                            Edit Property
                        </Button>
                        <Button
                            variant="danger"
                            onClick={async () => {
                                await propertyService.delete(property.id);
                                navigate('/');
                            }}
                        >
                            Delete Property
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
} 