import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { propertyService } from '../services/propertyService';
import { PropertyForm } from './PropertyForm';
import { Button } from './Button';

export function PropertyEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const { data: property, isLoading, error } = useQuery({
        queryKey: ['property', id],
        queryFn: () => {
            if (!id) throw new Error('Property ID is required');
            return propertyService.getById(Number(id));
        },
        retry: false
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center">
                <div className="text-xl">Loading property...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center">
                <div className="text-center">
                    <div className="text-xl text-red-600 mb-4">Failed to load property</div>
                    <Button
                        variant="primary"
                        onClick={() => navigate(`/property/${id}`)}
                    >
                        Back to property
                    </Button>
                </div>
            </div>
        );
    }

    if (!property) {
        return (
            <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center">
                <div className="text-center">
                    <div className="text-xl mb-4">Property not found</div>
                    <Button
                        variant="primary"
                        onClick={() => navigate('/')}
                    >
                        Back to properties
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7f7f7]">
            <div className="bg-[#262637] text-white">
                <div className="container mx-auto px-4 py-3">
                    <Button
                        variant="outline"
                        onClick={() => navigate(`/property/${id}`)}
                        className="bg-white hover:bg-gray-50"
                    >
                        Back to property
                    </Button>
                </div>
            </div>

            <div className="container mx-auto p-4">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h1 className="text-2xl font-bold text-[#262637] mb-6">Edit Property</h1>
                    <PropertyForm 
                        property={property}
                        onClose={() => navigate(`/property/${id}`)}
                    />
                </div>
            </div>
        </div>
    );
} 