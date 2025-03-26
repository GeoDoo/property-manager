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
        <div className="min-h-screen bg-[#f7f7f7]">
            <div className="bg-[#262637] text-white">
                <div className="container mx-auto px-4 py-3">
                    <Button
                        variant="outline"
                        onClick={() => navigate('/')}
                        className="bg-white hover:bg-gray-50"
                    >
                        Back to search
                    </Button>
                </div>
            </div>

            <div className="container mx-auto p-4">
                <div className="bg-white rounded-lg overflow-hidden">
                    {/* Image gallery placeholder */}
                    <div className="w-full h-[480px] bg-gray-200 flex items-center justify-center text-gray-400">
                        Property Images
                    </div>

                    <div className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold text-[#262637]">
                                    £{property.price.toLocaleString()}
                                </h1>
                                <p className="text-xl text-[#262637] mt-2">
                                    {property.address}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => navigate(`/property/${property.id}/edit`)}
                                    variant="primary"
                                >
                                    Edit property
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={async () => {
                                        await propertyService.delete(property.id);
                                        navigate('/');
                                    }}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-3 gap-6">
                            <div className="bg-[#f7f7f7] p-4 rounded-lg text-center">
                                <div className="text-2xl font-bold text-[#262637]">{property.bedrooms}</div>
                                <div className="text-[#6a6a6a]">BEDROOMS</div>
                            </div>
                            <div className="bg-[#f7f7f7] p-4 rounded-lg text-center">
                                <div className="text-2xl font-bold text-[#262637]">{property.bathrooms}</div>
                                <div className="text-[#6a6a6a]">BATHROOMS</div>
                            </div>
                            <div className="bg-[#f7f7f7] p-4 rounded-lg text-center">
                                <div className="text-2xl font-bold text-[#262637]">{property.squareFootage}</div>
                                <div className="text-[#6a6a6a]">SQ. FT.</div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h2 className="text-xl font-bold text-[#262637] mb-4">PROPERTY DETAILS</h2>
                            <p className="text-[#6a6a6a] leading-relaxed whitespace-pre-line">
                                {property.description || 'No description available'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 