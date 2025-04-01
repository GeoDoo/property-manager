import { Property } from '../../types/property';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes';

interface PropertyCardProps {
    property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
    const navigate = useNavigate();

    const handleViewDetails = () => {
        navigate(ROUTES.PROPERTIES.DETAILS(property.id!));
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(ROUTES.PROPERTIES.EDIT(property.id!));
    };

    return (
        <div 
            onClick={handleViewDetails}
            className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
        >
            {/* Image Section */}
            <div className="relative h-48 bg-gray-200">
                {property.images && property.images.length > 0 ? (
                    <img
                        src={property.images[0].url.startsWith('http') 
                            ? property.images[0].url 
                            : `${import.meta.env.VITE_API_URL}${property.images[0].url.replace(/^\/api/, '')}`}
                        alt={property.address}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image Available
                    </div>
                )}
                <div className="absolute top-4 right-4">
                    <button
                        onClick={handleEdit}
                        className="bg-white text-gray-700 px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors duration-200"
                    >
                        Edit
                    </button>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-4">
                <div className="mb-2">
                    <h3 className="text-xl font-bold text-[#262637] mb-2">{property.address}</h3>
                    <p className="text-2xl font-bold text-[#262637]">
                        £{property.price.toLocaleString()}
                    </p>
                </div>

                {/* Property Features */}
                <div className="grid grid-cols-3 gap-4 py-4 border-t border-gray-100">
                    <div className="text-center">
                        <p className="text-lg font-semibold text-[#262637]">{property.bedrooms}</p>
                        <p className="text-sm text-gray-500">BEDS</p>
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-semibold text-[#262637]">{property.bathrooms}</p>
                        <p className="text-sm text-gray-500">BATHS</p>
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-semibold text-[#262637]">{property.squareFootage.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">SQ.FT</p>
                    </div>
                </div>

                {/* Description Preview */}
                {property.description && (
                    <div className="mt-4 border-t border-gray-100 pt-4">
                        <p className="text-gray-600 text-sm line-clamp-2">
                            {property.description}
                        </p>
                    </div>
                )}

                {/* View Details Button */}
                <div className="mt-4 text-center">
                    <button
                        onClick={handleViewDetails}
                        className="w-full bg-[#262637] text-white px-4 py-2 rounded-md hover:bg-[#363654] transition-colors duration-200"
                    >
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
}; 