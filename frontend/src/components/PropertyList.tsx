import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { propertyService } from '../services/propertyService';
import { Button } from './Button';

export function PropertyList() {
    const navigate = useNavigate();
    const { data: properties, isLoading, error } = useQuery({
        queryKey: ['properties'],
        queryFn: propertyService.getAll
    });

    if (isLoading) return (
        <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center">
            <div className="text-xl">Loading...</div>
        </div>
    );
    
    if (error) return (
        <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center">
            <div className="text-xl">Error loading properties</div>
        </div>
    );

    const handleAddProperty = () => {
        navigate('/property/new');
    };

    return (
        <div className="min-h-screen bg-[#f7f7f7]">
            <div className="bg-[#262637] text-white">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Properties</h1>
                    <Button 
                        onClick={handleAddProperty}
                        variant="outline"
                        className="bg-white hover:bg-gray-50"
                    >
                        Add Property
                    </Button>
                </div>
            </div>

            <div className="container mx-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {properties?.map(property => (
                        <div key={property.id} className="bg-white p-4 rounded-lg shadow-sm">
                            <h2 className="text-xl font-semibold mb-2">{property.address}</h2>
                            <p className="text-2xl font-bold text-[#262637] mb-4">£{property.price.toLocaleString()}</p>
                            <div className="grid grid-cols-3 gap-4 mb-4">
                                <div className="text-center">
                                    <div className="font-bold">{property.bedrooms}</div>
                                    <div className="text-gray-600 text-sm">BEDS</div>
                                </div>
                                <div className="text-center">
                                    <div className="font-bold">{property.bathrooms}</div>
                                    <div className="text-gray-600 text-sm">BATHS</div>
                                </div>
                                <div className="text-center">
                                    <div className="font-bold">{property.squareFootage}</div>
                                    <div className="text-gray-600 text-sm">SQ.FT</div>
                                </div>
                            </div>
                            <div className="flex gap-2 justify-end">
                                <Button 
                                    variant="secondary"
                                    onClick={() => navigate(`/property/${property.id}`)}
                                >
                                    View Details
                                </Button>
                                <Button 
                                    variant="primary"
                                    onClick={() => navigate(`/property/${property.id}/edit`)}
                                >
                                    Edit
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 