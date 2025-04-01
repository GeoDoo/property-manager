import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { propertyService } from '../services/propertyService';
import { Button } from './Button';
import { PropertyCard } from './Property/PropertyCard';

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties?.map(property => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>
            </div>
        </div>
    );
} 