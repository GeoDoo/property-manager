import { useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyService } from '../services/propertyService';
import { Property } from '../types/property';
import { useState } from 'react';
import { Button } from './Button';

interface PropertyFormProps {
    property?: Property;
    onClose: () => void;
}

export function PropertyForm({ property, onClose }: PropertyFormProps) {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState<Omit<Property, 'id'>>({
        description: property?.description ?? '',
        address: property?.address ?? '',
        price: property?.price ?? 0,
        bedrooms: property?.bedrooms ?? 0,
        bathrooms: property?.bathrooms ?? 0,
        squareFootage: property?.squareFootage ?? 0
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
        mutation.mutate(formData as Property);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="address">Street</label>
                <input
                    id="address"
                    type="text"
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    className="w-full border p-2 rounded"
                    required
                />
            </div>
            <div>
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full border p-2 rounded"
                    required
                />
            </div>
            <div>
                <label htmlFor="price">Price</label>
                <input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                    className="w-full border p-2 rounded"
                    required
                />
            </div>
            <div>
                <label htmlFor="bedrooms">Bedrooms</label>
                <input
                    id="bedrooms"
                    type="number"
                    value={formData.bedrooms}
                    onChange={e => setFormData({...formData, bedrooms: Number(e.target.value)})}
                    className="w-full border p-2 rounded"
                    required
                />
            </div>
            <div>
                <label htmlFor="bathrooms">Bathrooms</label>
                <input
                    id="bathrooms"
                    type="number"
                    value={formData.bathrooms}
                    onChange={e => setFormData({...formData, bathrooms: Number(e.target.value)})}
                    className="w-full border p-2 rounded"
                    required
                />
            </div>
            <div>
                <label htmlFor="squareFootage">Square Footage</label>
                <input
                    id="squareFootage"
                    type="number"
                    value={formData.squareFootage}
                    onChange={e => setFormData({...formData, squareFootage: Number(e.target.value)})}
                    className="w-full border p-2 rounded"
                    required
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