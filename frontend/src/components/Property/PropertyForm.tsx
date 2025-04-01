import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { propertyService } from '../../services/propertyService';
import { Property, Image } from '../../types/property';
import { Layout } from '../Layout/Layout';

export function PropertyForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: property, isLoading: isLoadingProperty } = useQuery<Property>({
    queryKey: ['property', id],
    queryFn: () => propertyService.getById(Number(id)),
    enabled: !!id,
  });

  const [formData, setFormData] = useState<Property>({
    address: property?.address || '',
    description: property?.description || '',
    price: property?.price || 0,
    bedrooms: property?.bedrooms || 0,
    bathrooms: property?.bathrooms || 0,
    squareFootage: property?.squareFootage || 0,
    images: property?.images || [],
  });

  const propertyMutation = useMutation({
    mutationFn: (data: Property) => {
      if (id) {
        return propertyService.update(Number(id), data);
      }
      return propertyService.create(data);
    },
    onSuccess: (savedProperty) => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      if (selectedFiles.length > 0) {
        uploadImagesMutation.mutate({
          propertyId: savedProperty.id!,
          files: selectedFiles,
        });
      } else {
        navigate('/properties');
      }
    },
    onError: (error) => {
      setError('Error saving property. Please try again.');
      console.error('Error saving property:', error);
    },
  });

  const uploadImagesMutation = useMutation({
    mutationFn: ({ propertyId, files }: { propertyId: number; files: File[] }) => {
      setUploadProgress(true);
      return propertyService.uploadImage(propertyId, files);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      navigate('/properties');
    },
    onError: (error) => {
      setError('Error uploading images. Please try again.');
      console.error('Error uploading images:', error);
    },
    onSettled: () => {
      setUploadProgress(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    propertyMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'bedrooms' || name === 'bathrooms' || name === 'squareFootage'
        ? Number(value)
        : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleRemoveImage = (imageToRemove: Image) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== imageToRemove.id)
    }));
  };

  if (isLoadingProperty && id) return <div>Loading...</div>;

  return (
    <Layout>
      <div className="bg-white rounded-lg shadow-md p-8">
        <form onSubmit={handleSubmit}>
          <h1 className="text-2xl font-bold mb-8 text-[#262637]">{id ? 'Edit Property' : 'Add New Property'}</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#262637] mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="block w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#262637] mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="block w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#262637] mb-2">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  className="block w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#262637] mb-2">Square Footage</label>
                <input
                  type="number"
                  name="squareFootage"
                  value={formData.squareFootage}
                  onChange={handleChange}
                  min="0"
                  className="block w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#262637] mb-2">Bedrooms</label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  min="0"
                  className="block w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#262637] mb-2">Bathrooms</label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  min="0"
                  className="block w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#262637] mb-2">Images</label>
              {formData.images.length > 0 && (
                <div className="mb-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {formData.images.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.url.startsWith('http') 
                          ? image.url 
                          : `${import.meta.env.VITE_API_URL}${image.url.replace(/^\/api/, '')}`}
                        alt="Property"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(image)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <input
                type="file"
                onChange={handleFileChange}
                multiple
                accept="image/*"
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-3 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-medium
                  file:bg-[#262637] file:text-white
                  hover:file:bg-[#363654]"
              />
            </div>
          </div>

          <div className="mt-8 flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/properties')}
              className="px-6 py-3 text-sm font-medium text-[#262637] bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={propertyMutation.isPending || uploadProgress}
              className="px-6 py-3 text-sm font-medium text-white bg-[#262637] rounded-lg hover:bg-[#363654] disabled:opacity-50"
            >
              {propertyMutation.isPending || uploadProgress ? 'Saving...' : id ? 'Update Property' : 'Add Property'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
} 