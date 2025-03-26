import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PropertyForm } from './PropertyForm';
import { propertyService } from '../services/propertyService';
import { Button } from './Button';

export function EditProperty() {
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
                    <h1 className="text-2xl font-bold">Edit Property</h1>
                    <Button
                        variant="secondary"
                        onClick={() => navigate('/')}
                    >
                        Back
                    </Button>
                </div>
                <PropertyForm 
                    property={property} 
                    onClose={() => navigate('/')} 
                />
            </div>
        </div>
    );
} 