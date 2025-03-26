import { Property } from '../../types/property';

interface PropertyCardProps {
    property: Property;
}

export const PropertyCard = ({ property }: PropertyCardProps) => {
    return (
        <div className="property-card">
            <h3 className="property-title">{property.address}</h3>
            <div className="property-details">
                <p className="property-price">
                    ${property.price.toLocaleString()}
                </p>
                <p className="property-info">
                    {property.bedrooms} beds • {property.bathrooms} baths
                </p>
                <p className="property-info">
                    {property.squareFootage.toLocaleString()} sq ft
                </p>
                {property.description && (
                    <p className="property-description">{property.description}</p>
                )}
            </div>
        </div>
    );
}; 