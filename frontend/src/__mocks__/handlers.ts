import { http, HttpResponse } from 'msw';
import { API_URL } from '../config/api';

// Mock data
export const mockProperty = {
  id: 1,
  address: "123 Test Street, London",
  description: "A beautiful test property",
  price: 500000,
  bedrooms: 3,
  bathrooms: 2,
  squareFootage: 1500,
  images: [
    {
      id: 1,
      fileName: "test.jpg",
      contentType: "image/jpeg",
      url: "/images/test.jpg"
    }
  ]
};

export const mockProperties = {
  content: [mockProperty],
  pageable: {
    pageNumber: 0,
    pageSize: 10,
    sort: { empty: true, sorted: false, unsorted: true }
  },
  totalPages: 1,
  totalElements: 1,
  last: true,
  size: 10,
  number: 0,
  sort: { empty: true, sorted: false, unsorted: true },
  numberOfElements: 1,
  first: true,
  empty: false
};

// API handlers
export const handlers = [
  // Get all properties
  http.get(`${API_URL}/properties`, ({ request }) => {
    // Parse the URL to extract query parameters
    const url = new URL(request.url);
    const bedrooms = url.searchParams.get('bedrooms');
    
    // If bedrooms parameter exists, filter properties by exact match
    if (bedrooms) {
      const bedroomCount = parseInt(bedrooms);
      // Filter mock data for exact bedroom match
      const filteredProperties = {
        ...mockProperties,
        content: mockProperties.content.filter(p => p.bedrooms === bedroomCount)
      };
      return HttpResponse.json(filteredProperties);
    }
    
    // Return all properties if no bedroom filter
    return HttpResponse.json(mockProperties);
  }),

  // Get property by ID
  http.get(`${API_URL}/properties/:id`, ({ params }) => {
    const { id } = params;
    if (id === '1') {
      return HttpResponse.json(mockProperty);
    }
    return new HttpResponse(null, { status: 404 });
  }),

  // Search properties
  http.post(`${API_URL}/properties/search`, () => {
    return HttpResponse.json(mockProperties);
  }),

  // Upload images
  http.post(`${API_URL}/images/upload/:propertyId`, () => {
    return HttpResponse.json([
      {
        id: 1,
        fileName: "test.jpg",
        contentType: "image/jpeg",
        url: "/images/test.jpg"
      }
    ]);
  }),

  // Delete image
  http.delete(`${API_URL}/images/:id`, () => {
    return HttpResponse.json({});
  })
]; 