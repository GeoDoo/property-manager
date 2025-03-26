import { useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyService } from '../services/propertyService';
import { Property } from '../types/Property';
import { useState } from 'react';
import { Button } from './Button';

interface PropertyFormProps {
    property?: Property;
    onClose: () => void;
}

export function PropertyForm({ property, onClose }: PropertyFormProps) {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState<Property>({
        address: property?.address ?? '',
        price: property?.price ?? 0,
        bedrooms: property?.bedrooms ?? 0,
        bathrooms: property?.bathrooms ?? 0,
        squareFootage: property?.squareFootage ?? 0,
        description: property?.description ?? ''
    });

    const mutation = useMutation({
        mutationFn: (data: Property) => 
            property?.id 
                ? propertyService.update(property.id, data)
                : propertyService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['properties'] });
            onClose();
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block mb-1 font-medium">Street Address</label>
                <input
                    type="text"
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    className="w-full border p-2 rounded"
                    required
                />
            </div>
            <div>
                <label className="block mb-1 font-medium">Price</label>
                <input
                    type="number"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                    className="w-full border p-2 rounded"
                    required
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block mb-1 font-medium">Bedrooms</label>
                    <input
                        type="number"
                        value={formData.bedrooms}
                        onChange={e => setFormData({...formData, bedrooms: Number(e.target.value)})}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Bathrooms</label>
                    <input
                        type="number"
                        value={formData.bathrooms}
                        onChange={e => setFormData({...formData, bathrooms: Number(e.target.value)})}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>
            </div>
            <div>
                <label className="block mb-1 font-medium">Square Footage</label>
                <input
                    type="number"
                    value={formData.squareFootage}
                    onChange={e => setFormData({...formData, squareFootage: Number(e.target.value)})}
                    className="w-full border p-2 rounded"
                    required
                />
            </div>
            <div>
                <label className="block mb-1 font-medium">Description</label>
                <textarea
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full border p-2 rounded h-32"
                />
            </div>
            <div className="flex gap-2">
                <Button
                    type="submit"
                    variant="primary"
                >
                    {property ? 'Update Property' : 'Add Property'}
                </Button>
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onClose}
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
} 