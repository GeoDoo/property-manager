import React from 'react';
import { Property } from '../../types/property';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import { FaBed, FaBath, FaRulerCombined, FaHome } from 'react-icons/fa';
import { getFullImageUrl } from '../../config/api';

interface PropertyCardProps {
    property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
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
            className="bg-white rounded-xl overflow-hidden shadow-none border-2 border-[#e5e5e5] hover:border-[#00deb6] transition-colors duration-300 cursor-pointer"
        >
            {/* Image Section */}
            <div className="relative h-48 bg-gray-200">
                {property.images && property.images.length > 0 ? (
                    <img
                        src={getFullImageUrl(property.images[0].url)}
                        alt={property.address}
                        className="w-full h-full object-cover rounded-t-xl"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full bg-gray-200 rounded-t-xl">
                        <FaHome className="text-4xl text-gray-400" />
                    </div>
                )}
                <div className="absolute top-4 right-4">
                    <button
                        onClick={handleEdit}
                        className="bg-white text-[#262637] px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors duration-200"
                    >
                        Edit
                    </button>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-4">
                <div className="mb-2">
                    <h3 className="text-xl font-bold text-[#262637] mb-2">{property.address}</h3>
                    <p className="text-2xl font-bold text-[#00deb6]">
                        £{property.price.toLocaleString()}
                    </p>
                </div>

                {/* Property Features */}
                <div className="grid grid-cols-3 gap-4 py-4 border-t border-gray-100">
                    <div className="text-center">
                        {property.bedrooms && (
                            <div className="flex items-center justify-center text-[#666666]">
                                <FaBed className="mr-1" />
                                <span>{property.bedrooms}</span>
                            </div>
                        )}
                    </div>
                    <div className="text-center">
                        {property.bathrooms && (
                            <div className="flex items-center justify-center text-[#666666]">
                                <FaBath className="mr-1" />
                                <span>{property.bathrooms}</span>
                            </div>
                        )}
                    </div>
                    <div className="text-center">
                        {property.squareFootage && (
                            <div className="flex items-center justify-center text-[#666666]">
                                <FaRulerCombined className="mr-1" />
                                <span>{property.squareFootage.toLocaleString()}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Description Preview */}
                {property.description && (
                    <div className="mt-4 border-t border-gray-100 pt-4">
                        <p className="text-[#666666] text-sm line-clamp-2">
                            {property.description}
                        </p>
                    </div>
                )}

                {/* View Details Button */}
                <div className="mt-4 text-center">
                    <button
                        onClick={handleViewDetails}
                        className="w-full bg-[#00deb6] text-white px-4 py-2 rounded-xl hover:bg-[#00c5a0] transition-colors duration-200"
                    >
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PropertyCard; 