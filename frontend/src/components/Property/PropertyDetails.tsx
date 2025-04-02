import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyService } from '../../services/propertyService';
import { Property } from '../../types/property';
import { ImageSlider } from '../ImageSlider';
import { Layout } from '../Layout/Layout';
import { Button } from '../Button';
import { ROUTES } from '../../config/routes';
import { FaBed, FaBath, FaRulerCombined } from 'react-icons/fa';

export function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: property, isLoading } = useQuery<Property>({
    queryKey: ['property', id],
    queryFn: () => propertyService.getById(Number(id)),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: propertyService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      navigate(ROUTES.HOME);
    },
  });

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      deleteMutation.mutate(Number(id));
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!property) return <div>Property not found</div>;

  return (
    <Layout>
      <div className="bg-white rounded-lg overflow-hidden">
        <ImageSlider images={property.images || []} />

        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-[#262637]">
                £{property.price.toLocaleString()}
              </h1>
              <p className="text-xl text-[#262637] mt-2">
                {property.address}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => navigate(ROUTES.PROPERTIES.EDIT(property.id!))}
                variant="primary"
              >
                Edit property
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </div>

          <div className="mt-8 border border-gray-200 rounded-lg p-4 bg-white">
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-gray-200 p-4 rounded-lg text-center">
                <div className="flex items-center justify-center text-lg text-[#262637]">
                  <FaBed className="mr-2" />
                  <span>{property.bedrooms} Bedrooms</span>
                </div>
              </div>
              <div className="bg-gray-200 p-4 rounded-lg text-center">
                <div className="flex items-center justify-center text-lg text-[#262637]">
                  <FaBath className="mr-2" />
                  <span>{property.bathrooms} Bathrooms</span>
                </div>
              </div>
              <div className="bg-gray-200 p-4 rounded-lg text-center">
                <div className="flex items-center justify-center text-lg text-[#262637]">
                  <FaRulerCombined className="mr-2" />
                  <span>{property.squareFootage.toLocaleString()} sq ft</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold text-[#262637] mb-4">PROPERTY DETAILS</h2>
            <p className="text-[#6a6a6a] leading-relaxed whitespace-pre-line">
              {property.description || 'No description available'}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
} 