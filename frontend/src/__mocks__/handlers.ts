import { rest } from 'msw';
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

// Mock authentication responses
export const mockAuthResponse = {
  token: "mock-jwt-token",
  username: "testuser",
  isAdmin: false
};

export const mockAdminAuthResponse = {
  token: "mock-admin-jwt-token",
  username: "admin",
  isAdmin: true
};

// Helper to create a delay
const createDelay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// API handlers
export const handlers = [
  // --- PROPERTIES ENDPOINTS ---
  
  // Get all properties
  rest.get(`${API_URL}/properties`, async (req, res, ctx) => {
    // Parse the URL to extract query parameters
    const bedrooms = req.url.searchParams.get('bedrooms');
    const shouldFail = req.url.searchParams.get('shouldFail');
    const shouldDelay = req.url.searchParams.get('shouldDelay');
    
    // Simulate network delay if requested
    if (shouldDelay) {
      await createDelay(parseInt(shouldDelay));
    }
    
    // Simulate server error if requested
    if (shouldFail === 'true') {
      return res(ctx.status(500));
    }
    
    // If bedrooms parameter exists, filter properties by exact match
    if (bedrooms) {
      const bedroomCount = parseInt(bedrooms);
      // Filter mock data for exact bedroom match
      const filteredProperties = {
        ...mockProperties,
        content: mockProperties.content.filter(p => p.bedrooms === bedroomCount)
      };
      return res(ctx.json(filteredProperties));
    }
    
    // Return all properties if no bedroom filter
    return res(ctx.json(mockProperties));
  }),

  // Get property by ID
  rest.get(`${API_URL}/properties/:id`, async (req, res, ctx) => {
    const { id } = req.params;
    const shouldFail = req.url.searchParams.get('shouldFail');
    const notFound = req.url.searchParams.get('notFound');
    const shouldDelay = req.url.searchParams.get('shouldDelay');
    
    // Simulate network delay if requested
    if (shouldDelay) {
      await createDelay(parseInt(shouldDelay));
    }
    
    // Simulate server error if requested
    if (shouldFail === 'true') {
      return res(ctx.status(500));
    }
    
    // Simulate not found if requested or if ID != 1
    if (notFound === 'true' || (id !== '1' && id !== '2')) {
      return res(ctx.status(404));
    }
    
    // Return property with ID=1 or a variant for ID=2
    if (id === '2') {
      return res(
        ctx.json({
          ...mockProperty,
          id: 2,
          address: "456 Another Street, London",
          bedrooms: 4
        })
      );
    }
    
    return res(ctx.json(mockProperty));
  }),

  // Create property
  rest.post(`${API_URL}/properties`, async (req, res, ctx) => {
    const shouldFail = req.url.searchParams.get('shouldFail');
    const shouldDelay = req.url.searchParams.get('shouldDelay');
    const validation = req.url.searchParams.get('validation');
    
    // Simulate network delay if requested
    if (shouldDelay) {
      await createDelay(parseInt(shouldDelay));
    }
    
    // Simulate server error if requested
    if (shouldFail === 'true') {
      return res(ctx.status(500));
    }
    
    // Simulate validation error
    if (validation === 'true') {
      return res(
        ctx.status(400),
        ctx.json({
          message: "Validation failed",
          errors: {
            address: "Address is required",
            price: "Price must be positive"
          }
        })
      );
    }
    
    // Return created property
    return res(
      ctx.status(201),
      ctx.json({
        ...mockProperty,
        id: 3 // New ID for created property
      })
    );
  }),
  
  // Update property
  rest.put(`${API_URL}/properties/:id`, async (req, res, ctx) => {
    const { id } = req.params;
    const shouldFail = req.url.searchParams.get('shouldFail');
    const shouldDelay = req.url.searchParams.get('shouldDelay');
    const notFound = req.url.searchParams.get('notFound');
    
    // Simulate network delay if requested
    if (shouldDelay) {
      await createDelay(parseInt(shouldDelay));
    }
    
    // Simulate server error if requested
    if (shouldFail === 'true') {
      return res(ctx.status(500));
    }
    
    // Simulate not found error
    if (notFound === 'true') {
      return res(ctx.status(404));
    }
    
    // Return updated property
    return res(
      ctx.json({
        ...mockProperty,
        id: parseInt(id as string),
        // We would add updated fields from request body here
      })
    );
  }),
  
  // Delete property
  rest.delete(`${API_URL}/properties/:id`, async (req, res, ctx) => {
    const { id } = req.params;
    const shouldFail = req.url.searchParams.get('shouldFail');
    const shouldDelay = req.url.searchParams.get('shouldDelay');
    const notFound = req.url.searchParams.get('notFound');
    
    // Simulate network delay if requested
    if (shouldDelay) {
      await createDelay(parseInt(shouldDelay));
    }
    
    // Simulate server error if requested
    if (shouldFail === 'true') {
      return res(ctx.status(500));
    }
    
    // Simulate not found error
    if (notFound === 'true') {
      return res(ctx.status(404));
    }
    
    // Return success response
    return res(ctx.status(204));
  }),

  // Search properties
  rest.post(`${API_URL}/properties/search`, async (req, res, ctx) => {
    const shouldFail = req.url.searchParams.get('shouldFail');
    const shouldDelay = req.url.searchParams.get('shouldDelay');
    const emptyResults = req.url.searchParams.get('emptyResults');
    
    // Simulate network delay if requested
    if (shouldDelay) {
      await createDelay(parseInt(shouldDelay));
    }
    
    // Simulate server error if requested
    if (shouldFail === 'true') {
      return res(ctx.status(500));
    }
    
    // Simulate empty results
    if (emptyResults === 'true') {
      return res(
        ctx.json({
          ...mockProperties,
          content: [],
          totalElements: 0,
          numberOfElements: 0,
          empty: true
        })
      );
    }
    
    return res(ctx.json(mockProperties));
  }),

  // --- IMAGES ENDPOINTS ---
  
  // Upload images
  rest.post(`${API_URL}/images/upload/:propertyId`, async (req, res, ctx) => {
    const shouldFail = req.url.searchParams.get('shouldFail');
    const shouldDelay = req.url.searchParams.get('shouldDelay');
    
    // Simulate network delay if requested
    if (shouldDelay) {
      await createDelay(parseInt(shouldDelay));
    }
    
    // Simulate server error if requested
    if (shouldFail === 'true') {
      return res(ctx.status(500));
    }
    
    return res(
      ctx.json([
        {
          id: 1,
          fileName: "test.jpg",
          contentType: "image/jpeg",
          url: "/images/test.jpg"
        }
      ])
    );
  }),

  // Delete image
  rest.delete(`${API_URL}/images/:id`, async (req, res, ctx) => {
    const shouldFail = req.url.searchParams.get('shouldFail');
    const shouldDelay = req.url.searchParams.get('shouldDelay');
    
    // Simulate network delay if requested
    if (shouldDelay) {
      await createDelay(parseInt(shouldDelay));
    }
    
    // Simulate server error if requested
    if (shouldFail === 'true') {
      return res(ctx.status(500));
    }
    
    return res(ctx.status(204));
  }),
  
  // --- AUTH ENDPOINTS ---
  
  // Login endpoint
  rest.post(`${API_URL}/auth/login`, async (req, res, ctx) => {
    const shouldFail = req.url.searchParams.get('shouldFail');
    const shouldDelay = req.url.searchParams.get('shouldDelay');
    const invalidCreds = req.url.searchParams.get('invalidCreds');
    
    // Simulate network delay if requested
    if (shouldDelay) {
      await createDelay(parseInt(shouldDelay));
    }
    
    // Simulate server error if requested
    if (shouldFail === 'true') {
      return res(ctx.status(500));
    }
    
    // Simulate invalid credentials
    if (invalidCreds === 'true') {
      return res(
        ctx.status(401),
        ctx.json({ message: "Invalid username or password" })
      );
    }
    
    // Get request body to check if it's an admin login
    const body = await req.json();
    const isAdmin = body.username === 'admin';
    
    return res(
      ctx.json(isAdmin ? mockAdminAuthResponse : mockAuthResponse)
    );
  }),
  
  // Register endpoint
  rest.post(`${API_URL}/auth/register`, async (req, res, ctx) => {
    const shouldFail = req.url.searchParams.get('shouldFail');
    const shouldDelay = req.url.searchParams.get('shouldDelay');
    const userExists = req.url.searchParams.get('userExists');
    
    // Simulate network delay if requested
    if (shouldDelay) {
      await createDelay(parseInt(shouldDelay));
    }
    
    // Simulate server error if requested
    if (shouldFail === 'true') {
      return res(ctx.status(500));
    }
    
    // Simulate user already exists
    if (userExists === 'true') {
      return res(
        ctx.status(409),
        ctx.json({ message: "Username already exists" })
      );
    }
    
    return res(ctx.status(201), ctx.json(mockAuthResponse));
  }),
  
  // Validate token
  rest.get(`${API_URL}/auth/validate`, async (req, res, ctx) => {
    const shouldFail = req.url.searchParams.get('shouldFail');
    const shouldDelay = req.url.searchParams.get('shouldDelay');
    const invalidToken = req.url.searchParams.get('invalidToken');
    
    // Simulate network delay if requested
    if (shouldDelay) {
      await createDelay(parseInt(shouldDelay));
    }
    
    // Simulate server error if requested
    if (shouldFail === 'true') {
      return res(ctx.status(500));
    }
    
    // Simulate invalid token
    if (invalidToken === 'true') {
      return res(
        ctx.status(401),
        ctx.json({ message: "Invalid token" })
      );
    }
    
    // Check auth header to determine if admin
    const authHeader = req.headers.get('Authorization');
    const isAdmin = authHeader?.includes('admin');
    
    return res(
      ctx.json({
        username: isAdmin ? 'admin' : 'testuser',
        isAdmin: !!isAdmin
      })
    );
  })
]; 