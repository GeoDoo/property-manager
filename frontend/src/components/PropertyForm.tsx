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
        squareFootage: 0,
        images: []
    });

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [uploadProgress, setUploadProgress] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (property) {
            setFormData({
                description: property.description,
                address: property.address,
                price: property.price,
                bedrooms: property.bedrooms,
                bathrooms: property.bathrooms,
                squareFootage: property.squareFootage,
                images: property.images || []
            });
        }
    }, [property]);

    const propertyMutation = useMutation({
        mutationFn: async (data: Omit<Property, 'id'>) => {
            console.log('Property mutation data:', data);
            try {
                let savedProperty;
                const propertyData = {
                    ...data,
                    price: Number(data.price),
                    bedrooms: Number(data.bedrooms),
                    bathrooms: Number(data.bathrooms),
                    squareFootage: Number(data.squareFootage)
                };
                
                if (id) {
                    console.log('Updating property:', id, propertyData);
                    savedProperty = await propertyService.update(Number(id), { ...propertyData, id: Number(id) });
                } else {
                    console.log('Creating new property:', propertyData);
                    savedProperty = await propertyService.create(propertyData);
                }
                console.log('Mutation result:', savedProperty);
                return savedProperty;
            } catch (error: any) {
                console.error('Property mutation error:', {
                    error,
                    message: error.message,
                    response: error.response?.data
                });
                throw error;
            }
        }
    });

    const uploadImagesMutation = useMutation({
        mutationFn: async ({ propertyId, files }: { propertyId: number; files: File[] }) => {
            return propertyService.uploadImage(propertyId, files);
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setUploadProgress(true);

        try {
            console.log('Submitting form data:', formData);
            // First save/update the property
            const savedProperty = await propertyMutation.mutateAsync(formData);
            console.log('Property saved successfully:', savedProperty);

            // Then upload images if any are selected
            if (selectedFiles.length > 0) {
                console.log('Uploading files:', selectedFiles);
                await uploadImagesMutation.mutateAsync({
                    propertyId: savedProperty.id!,
                    files: selectedFiles
                });
                console.log('Images uploaded successfully');
            }

            // Update queries and navigate
            queryClient.invalidateQueries({ queryKey: ['properties'] });
            if (id) {
                queryClient.invalidateQueries({ queryKey: ['property', id] });
            }
            navigate('/');
        } catch (error: any) {
            console.error('Detailed error in form submission:', {
                error,
                message: error.message,
                response: error.response?.data
            });
            setError(error.response?.data?.message || 'Error saving property. Please try again.');
        } finally {
            setUploadProgress(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const fileList = Array.from(e.target.files);
            console.log('Selected files:', fileList);
            setSelectedFiles(fileList);
        }
    };

    const handleDeleteImage = async (imageId: number) => {
        try {
            await propertyService.deleteImage(imageId);
            setFormData(prev => ({
                ...prev,
                images: prev.images.filter(img => img.id !== imageId)
            }));
            if (id) {
                queryClient.invalidateQueries({ queryKey: ['property', id] });
            }
        } catch (error) {
            console.error('Error deleting image:', error);
            setError('Error deleting image. Please try again.');
        }
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

                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded">
                            {error}
                        </div>
                    )}

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

                        {/* Image Upload Section */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Property Images</label>
                            
                            {/* Current Images */}
                            {formData.images.length > 0 && (
                                <div className="grid grid-cols-3 gap-4 mb-4">
                                    {formData.images.map((image) => (
                                        <div key={image.id} className="relative group">
                                            <img
                                                src={import.meta.env.VITE_API_URL + image.url}
                                                alt="Property"
                                                className="w-full h-32 object-cover rounded"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteImage(image.id)}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Image Upload Input */}
                            <div className="mt-2">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileChange}
                                    className="block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-full file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-[#262637] file:text-white
                                        hover:file:bg-[#363654]"
                                />
                                {selectedFiles.length > 0 && (
                                    <div className="mt-2 text-sm text-gray-500">
                                        Selected {selectedFiles.length} file(s)
                                    </div>
                                )}
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
                                disabled={propertyMutation.isPending || uploadImagesMutation.isPending || uploadProgress}
                            >
                                {(propertyMutation.isPending || uploadImagesMutation.isPending || uploadProgress) 
                                    ? 'Saving...' 
                                    : (id ? 'Update Property' : 'Add Property')}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 