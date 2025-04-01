export interface Property {
    id?: number;
    description: string;
    address: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    squareFootage: number;
}

export enum PropertyType {
    HOUSE = 'HOUSE',
    APARTMENT = 'APARTMENT',
    CONDO = 'CONDO',
    TOWNHOUSE = 'TOWNHOUSE'
}
