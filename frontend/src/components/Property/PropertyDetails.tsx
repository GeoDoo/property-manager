import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { propertyService } from '../../services/propertyService';
import { Property } from '../../types/property';
import { ImageSlider } from '../ImageSlider';
import { Layout } from '../Layout/Layout';
import { Button } from '../Button';
import { ROUTES } from '../../config/routes';

export function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: property, isLoading } = useQuery<Property>({
    queryKey: ['property', id],
    queryFn: () => propertyService.getById(Number(id)),
    enabled: !!id,
  });

  if (isLoading) return <div>Loading...</div>;
  if (!property) return <div>Property not found</div>;

  const handleDelete = async () => {
    await propertyService.delete(property.id!);
    navigate(ROUTES.HOME);
  };

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

          <div className="mt-8 grid grid-cols-3 gap-6">
            <div className="bg-[#f7f7f7] p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-[#262637]">{property.bedrooms}</div>
              <div className="text-[#6a6a6a]">BEDROOMS</div>
            </div>
            <div className="bg-[#f7f7f7] p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-[#262637]">{property.bathrooms}</div>
              <div className="text-[#6a6a6a]">BATHROOMS</div>
            </div>
            <div className="bg-[#f7f7f7] p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-[#262637]">{property.squareFootage}</div>
              <div className="text-[#6a6a6a]">SQ. FT.</div>
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