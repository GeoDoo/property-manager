import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyService } from '../../services/propertyService';
import { Property } from '../../types/property';
import { ImageSlider } from '../ImageSlider';
import { Layout } from '../Layout/Layout';
import { Button } from '../Button';
import { ROUTES } from '../../config/routes';
import { FaBed, FaBath, FaRulerCombined } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

export function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAdmin } = useAuth();

  const { data: property, isLoading, error } = useQuery<Property>({
    queryKey: ['property', id],
    queryFn: () => propertyService.getById(Number(id)),
    enabled: !!id,
    retry: 2,
    retryDelay: 1000,
    // Use any matching property data we already have while loading
    initialData: () => {
      const allProperties = queryClient.getQueryData<any>(['properties']);
      if (allProperties?.content) {
        return allProperties.content.find((p: Property) => p.id === Number(id));
      }
      return undefined;
    }
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

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      </Layout>
    );
  }
  
  if (error) {
    console.error('Error loading property details:', error);
    return (
      <Layout>
        <div className="text-center text-red-500 p-4">
          Error loading property details. Please try again later.
        </div>
      </Layout>
    );
  }

  if (!property) {
    return (
      <Layout>
        <div className="text-center p-4">
          Property not found. <Button onClick={() => navigate('/')}>Go back to properties</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="rounded-xl overflow-hidden">
        <ImageSlider images={property.images || []} />
        
        <div className="py-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-[#262637]">
                £{property.price.toLocaleString()}
              </h1>
              <p className="text-xl text-[#262637] mt-2">
                {property.address}
              </p>
            </div>
            {isAdmin() && (
              <div className="flex gap-2">
                <Button
                  onClick={() => navigate(ROUTES.PROPERTIES.EDIT(property.id!))}
                  variant="primary"
                  className="rounded-xl"
                >
                  Edit property
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  className="rounded-xl"
                >
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-b border-gray-200">
          <div className="grid grid-cols-3">
            <div className="flex flex-col items-center py-6">
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">BEDROOMS</span>
              <div className="flex items-center gap-2">
                <FaBed className="text-[#262637]" />
                <span className="text-lg text-[#262637]">{property.bedrooms}</span>
              </div>
            </div>
            <div className="flex flex-col items-center py-6 border-x border-gray-200">
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

        <div className="py-6">
          <h2 className="text-xl font-bold text-[#262637] mb-4">PROPERTY DETAILS</h2>
          <p className="text-[#6a6a6a] leading-relaxed whitespace-pre-line">
            {property.description || 'No description available'}
          </p>
        </div>
      </div>
    </Layout>
  );
} 