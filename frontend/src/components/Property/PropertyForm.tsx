import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { propertyService, ValidationError } from '../../services/propertyService';
import { Property, Image } from '../../types/property';
import { ROUTES } from '../../config/routes';
import { getFullImageUrl } from '../../config/api';

export function PropertyForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError>({});
  const [formData, setFormData] = useState<Property>({
    address: '',
    description: '',
    price: 0,
    bedrooms: 0,
    bathrooms: 0,
    squareFootage: 0,
    images: [],
  });

  const { data: property, isLoading: isLoadingProperty } = useQuery<Property>({
    queryKey: ['property', id],
    queryFn: () => propertyService.getById(Number(id)),
    enabled: !!id,
  });

  useEffect(() => {
    if (property) {
      setFormData({
        address: property.address,
        description: property.description,
        price: property.price,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        squareFootage: property.squareFootage,
        images: property.images || [],
      });
    }
  }, [property]);

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
        navigate(ROUTES.PROPERTIES.LIST);
      }
    },
    onError: (error) => {
      if (error && typeof error === 'object' && !(error instanceof Error)) {
        setValidationErrors(error as unknown as ValidationError);
        setError('Please fix the validation errors below.');
      } else {
        setError('Error saving property. Please try again.');
        console.error('Error saving property:', error);
      }
    },
  });

  const uploadImagesMutation = useMutation({
    mutationFn: ({ propertyId, files }: { propertyId: number; files: File[] }) => {
      setUploadProgress(true);
      return propertyService.uploadImage(propertyId, files);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      navigate(ROUTES.PROPERTIES.LIST);
    },
    onError: (error) => {
      setError('Error uploading images. Please try again.');
      console.error('Error uploading images:', error);
    },
    onSettled: () => {
      setUploadProgress(false);
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: propertyService.deleteImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property', id] });
    },
    onError: (error) => {
      setError('Error deleting image. Please try again.');
      console.error('Error deleting image:', error);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidationErrors({});

    // Validate numeric fields before submission
    const numericFields = ['price', 'bedrooms', 'bathrooms', 'squareFootage'];
    const newErrors: ValidationError = {};
    
    numericFields.forEach(field => {
      const value = formData[field as keyof Property];
      if (typeof value === 'number' && value <= 0) {
        newErrors[field] = `Please enter a valid ${field === 'price' ? 'price' : field === 'squareFootage' ? 'square footage' : field}`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setValidationErrors(newErrors);
      setError('Please check the highlighted fields and fix any errors before submitting.');
      return;
    }

    propertyMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // For numeric fields, ensure the value is non-negative
    if (name === 'price' || name === 'bedrooms' || name === 'bathrooms' || name === 'squareFootage') {
      const numericValue = Number(value);
      if (numericValue < 0) {
        setValidationErrors(prev => ({
          ...prev,
          [name]: `Please enter a valid ${name === 'price' ? 'price' : name === 'squareFootage' ? 'square footage' : name}`
        }));
        return;
      }
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'bedrooms' || name === 'bathrooms' || name === 'squareFootage'
        ? Number(value)
        : value,
    }));
    // Clear validation error for the field being changed
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleRemoveImage = async (imageToRemove: Image) => {
    try {
      await deleteImageMutation.mutateAsync(imageToRemove.id);
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter(img => img.id !== imageToRemove.id)
      }));
    } catch {
      // Error is handled by the mutation
    }
  };

  if (isLoadingProperty && id) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#262637]"></div>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden">
      <div className="py-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold text-[#262637]">
            {id ? 'Edit Property' : 'Add New Property'}
          </h1>
        </div>

        {error && (
          <div className="border-2 border-red-500 p-4 mt-6 rounded-xl">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#262637] mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`block w-full rounded-xl border-2 px-4 py-3 text-[#262637] focus:ring-0 transition-colors ${
                  validationErrors.address ? 'border-red-500' : 'border-[#e5e5e5] focus:border-[#00deb6]'
                }`}
                required
              />
              {validationErrors.address && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.address}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#262637] mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`block w-full rounded-xl border-2 px-4 py-3 text-[#262637] focus:ring-0 transition-colors ${
                  validationErrors.description ? 'border-red-500' : 'border-[#e5e5e5] focus:border-[#00deb6]'
                }`}
                required
              />
              {validationErrors.description && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
              )}
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
                  className={`block w-full rounded-xl border-2 px-4 py-3 text-[#262637] focus:ring-0 transition-colors ${
                    validationErrors.price ? 'border-red-500' : 'border-[#e5e5e5] focus:border-[#00deb6]'
                  }`}
                  required
                />
                {validationErrors.price && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.price}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#262637] mb-2">Square Footage</label>
                <input
                  type="number"
                  name="squareFootage"
                  value={formData.squareFootage}
                  onChange={handleChange}
                  min="0"
                  className={`block w-full rounded-xl border-2 px-4 py-3 text-[#262637] focus:ring-0 transition-colors ${
                    validationErrors.squareFootage ? 'border-red-500' : 'border-[#e5e5e5] focus:border-[#00deb6]'
                  }`}
                  required
                />
                {validationErrors.squareFootage && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.squareFootage}</p>
                )}
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
                  className={`block w-full rounded-xl border-2 px-4 py-3 text-[#262637] focus:ring-0 transition-colors ${
                    validationErrors.bedrooms ? 'border-red-500' : 'border-[#e5e5e5] focus:border-[#00deb6]'
                  }`}
                  required
                />
                {validationErrors.bedrooms && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.bedrooms}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#262637] mb-2">Bathrooms</label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  min="0"
                  className={`block w-full rounded-xl border-2 px-4 py-3 text-[#262637] focus:ring-0 transition-colors ${
                    validationErrors.bathrooms ? 'border-red-500' : 'border-[#e5e5e5] focus:border-[#00deb6]'
                  }`}
                  required
                />
                {validationErrors.bathrooms && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.bathrooms}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#262637] mb-2">Images</label>
              {formData.images.length > 0 && (
                <div className="mb-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={getFullImageUrl(image.url)}
                        alt={`Property image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(image)}
                        className="absolute top-2 right-2 bg-[#e60000] text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
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
                className="block w-full text-sm text-[#666666]
                  file:mr-4 file:py-3 file:px-4
                  file:rounded-xl file:border-0
                  file:text-sm file:font-medium
                  file:bg-[#00deb6] file:text-white
                  hover:file:bg-[#00c5a0]"
              />
            </div>

            <div className="mt-8 flex items-center justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate(ROUTES.PROPERTIES.LIST)}
                className="px-6 py-3 text-sm font-medium text-[#262637] bg-white border-2 border-[#e5e5e5] rounded-xl hover:border-[#00deb6] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={propertyMutation.isPending || uploadProgress}
                className="px-6 py-3 text-sm font-medium text-white bg-[#00deb6] rounded-xl hover:bg-[#00c5a0] disabled:opacity-50"
              >
                {propertyMutation.isPending || uploadProgress ? 'Saving...' : id ? 'Update Property' : 'Add Property'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 