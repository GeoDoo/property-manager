import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { propertyService } from '../services/propertyService';
import { Property } from '../types/property';
import { useState, useEffect } from 'react';
import { Button } from './Button';

export function PropertyForm() {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data: property, isLoading } = useQuery({
        queryKey: ['property', id],
        queryFn: () => id ? propertyService.getById(Number(id)) : null,
        enabled: !!id
    });

    const [formData, setFormData] = useState<Omit<Property, 'id'>>({
        description: '',
        address: '',
        price: 0,
        bedrooms: 0,
        bathrooms: 0,
        squareFootage: 0
    });

    useEffect(() => {
        if (property) {
            setFormData({
                description: property.description,
                address: property.address,
                price: property.price,
                bedrooms: property.bedrooms,
                bathrooms: property.bathrooms,
                squareFootage: property.squareFootage
            });
        }
    }, [property]);

    const mutation = useMutation({
        mutationFn: (data: Omit<Property, 'id'>) => 
            id 
                ? propertyService.update(Number(id), { ...data, id: Number(id) })
                : propertyService.create(data as Property),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['properties'] });
            if (id) {
                queryClient.invalidateQueries({ queryKey: ['property', id] });
            }
            navigate('/');
        },
        onError: (error) => {
            console.error('Error saving property:', error);
            alert('Error saving property. Please try again.');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    if (id && isLoading) {
        return (
            <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center">
                <div className="text-xl">Loading property...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7f7f7]">
            <div className="bg-[#262637] text-white">
                <div className="container mx-auto px-4 py-3">
                    <Button
                        variant="outline"
                        onClick={() => navigate('/')}
                        className="bg-white hover:bg-gray-50"
                    >
                        Back to properties
                    </Button>
                </div>
            </div>

            <div className="container mx-auto p-4">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h1 className="text-2xl font-bold text-[#262637] mb-6">
                        {id ? 'Edit Property' : 'Add New Property'}
                    </h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Street Address</label>
                            <input
                                id="address"
                                type="text"
                                value={formData.address}
                                onChange={e => setFormData({...formData, address: e.target.value})}
                                className="mt-1 w-full border p-2 rounded focus:ring-2 focus:ring-[#262637] focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                id="description"
                                value={formData.description}
                                onChange={e => setFormData({...formData, description: e.target.value})}
                                className="mt-1 w-full border p-2 rounded focus:ring-2 focus:ring-[#262637] focus:border-transparent"
                                rows={4}
                            />
                        </div>
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (£)</label>
                            <input
                                id="price"
                                type="number"
                                value={formData.price}
                                onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                                className="mt-1 w-full border p-2 rounded focus:ring-2 focus:ring-[#262637] focus:border-transparent"
                                required
                                min="0"
                                step="1000"
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">Bedrooms</label>
                                <input
                                    id="bedrooms"
                                    type="number"
                                    value={formData.bedrooms}
                                    onChange={e => setFormData({...formData, bedrooms: Number(e.target.value)})}
                                    className="mt-1 w-full border p-2 rounded focus:ring-2 focus:ring-[#262637] focus:border-transparent"
                                    required
                                    min="0"
                                />
                            </div>
                            <div>
                                <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">Bathrooms</label>
                                <input
                                    id="bathrooms"
                                    type="number"
                                    value={formData.bathrooms}
                                    onChange={e => setFormData({...formData, bathrooms: Number(e.target.value)})}
                                    className="mt-1 w-full border p-2 rounded focus:ring-2 focus:ring-[#262637] focus:border-transparent"
                                    required
                                    min="0"
                                    step="0.5"
                                />
                            </div>
                            <div>
                                <label htmlFor="squareFootage" className="block text-sm font-medium text-gray-700">Square Footage</label>
                                <input
                                    id="squareFootage"
                                    type="number"
                                    value={formData.squareFootage}
                                    onChange={e => setFormData({...formData, squareFootage: Number(e.target.value)})}
                                    className="mt-1 w-full border p-2 rounded focus:ring-2 focus:ring-[#262637] focus:border-transparent"
                                    required
                                    min="0"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2 justify-end pt-4">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => navigate('/')}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={mutation.isPending}
                            >
                                {id ? 'Update Property' : 'Add Property'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 