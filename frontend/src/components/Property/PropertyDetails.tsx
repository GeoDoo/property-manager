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
        <div className="p-6">
          <div className="rounded-lg overflow-hidden">
            <ImageSlider images={property.images || []} />
          </div>
        </div>

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

          <div className="mt-8 bg-white border border-gray-200 rounded-none">
            <div className="grid grid-cols-3">
              <div className="flex flex-col items-center py-6">
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">BEDROOMS</span>
                <div className="flex items-center gap-2">
                  <FaBed className="text-[#262637]" />
                  <span className="text-lg text-[#262637]">{property.bedrooms}</span>
                </div>
              </div>
              <div className="flex flex-col items-center py-6">
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">BATHROOMS</span>
                <div className="flex items-center gap-2">
                  <FaBath className="text-[#262637]" />
                  <span className="text-lg text-[#262637]">{property.bathrooms}</span>
                </div>
              </div>
              <div className="flex flex-col items-center py-6">
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">SIZE</span>
                <div className="flex items-center gap-2">
                  <FaRulerCombined className="text-[#262637]" />
                  <div className="flex flex-col items-center">
                    <span className="text-lg text-[#262637]">{property.squareFootage} sq ft</span>
                    <span className="text-sm text-gray-500">{Math.round(property.squareFootage * 0.092903)} sq m</span>
                  </div>
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