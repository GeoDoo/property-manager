import { Property } from '../../types/property';

interface PropertyCardProps {
    property: Property;
}

export const PropertyCard = ({ property }: PropertyCardProps) => {
    return (
        <div className="property-card bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-bold mb-2">{property.address}</h3>
            <div className="property-details">
                <p className="text-lg font-semibold text-green-600">
                    ${property.price.toLocaleString()}
                </p>
                <p className="text-gray-600">
                    {property.bedrooms} beds • {property.bathrooms} baths
                </p>
                <p className="text-gray-600">
                    {property.squareFootage.toLocaleString()} sq ft
                </p>
                {property.description && (
                    <p className="text-gray-700 mt-2">{property.description}</p>
                )}
            </div>
        </div>
    );
}; 