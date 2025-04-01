export interface Image {
    id: number;
    fileName: string;
    contentType: string;
    url: string;
}

export interface Property {
    id?: number;
    address: string;
    description: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    squareFootage: number;
    images: Image[];
}

export enum PropertyType {
    HOUSE = 'HOUSE',
    APARTMENT = 'APARTMENT',
    CONDO = 'CONDO',
    TOWNHOUSE = 'TOWNHOUSE'
}
