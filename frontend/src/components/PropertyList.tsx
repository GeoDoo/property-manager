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
        <div className="min-h-screen bg-[#f7f7f7]">
            {/* Rightmove-style header */}
            <div className="bg-[#262637] text-white">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Property Manager</h1>
                        <Button
                            variant="outline"
                            onClick={() => navigate('/property/new')}
                            className="bg-white hover:bg-gray-50"
                        >
                            Add Property
                        </Button>
                    </div>
                </div>
                {/* Search filters bar */}
                <div className="bg-[#313144] py-4">
                    <div className="container mx-auto px-4">
                        <div className="flex gap-4">
                            <input 
                                type="text" 
                                placeholder="Search location"
                                className="px-4 py-2 rounded text-black w-64"
                            />
                            <select className="px-4 py-2 rounded text-black">
                                <option>Price range</option>
                            </select>
                            <select className="px-4 py-2 rounded text-black">
                                <option>Property type</option>
                            </select>
                            <select className="px-4 py-2 rounded text-black">
                                <option>Bedrooms</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="container mx-auto p-4">
                <div className="space-y-4">
                    {properties?.map(property => (
                        <Link 
                            key={property.id} 
                            to={`/property/${property.id}`}
                            className="block bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            <div className="flex">
                                {/* Placeholder image */}
                                <div className="w-80 h-60 bg-gray-200 flex-shrink-0">
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        Property Image
                                    </div>
                                </div>
                                <div className="p-4 flex-grow">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h2 className="text-2xl font-bold text-[#262637]">
                                                £{property.price.toLocaleString()}
                                            </h2>
                                            <p className="text-lg text-[#262637] mt-1">
                                                {property.address}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center text-[#6a6a6a] space-x-6">
                                        <div className="flex items-center">
                                            <span className="font-semibold">{property.bedrooms}</span>
                                            <span className="ml-1">bedroom{property.bedrooms !== 1 ? 's' : ''}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="font-semibold">{property.bathrooms}</span>
                                            <span className="ml-1">bathroom{property.bathrooms !== 1 ? 's' : ''}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span>{property.squareFootage} sq. ft.</span>
                                        </div>
                                    </div>
                                    {property.description && (
                                        <p className="mt-4 text-[#6a6a6a] line-clamp-2">
                                            {property.description}
                                        </p>
                                    )}
                                    <div className="mt-4 flex items-center text-[#70b857]">
                                        <span className="font-semibold">View property details →</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
} 