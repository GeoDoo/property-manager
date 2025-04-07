import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { rest } from 'msw';
import { server } from '../__mocks__/server';
import { API_URL } from '../config/api';

// Mock fetch to use in tests
global.fetch = jest.fn();

// Define an interface for the Property data structure
interface Property {
  id: number;
  address: string;
  price: number;
  description: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  images: Array<{
    id: number;
    fileName: string;
    contentType: string;
    url: string;
  }>;
}

// PropertyFetcher component fetches and displays property data
const PropertyFetcher: React.FC<{ 
  id: number;
  showError?: boolean;
}> = ({ id, showError = true }) => {
  const [property, setProperty] = React.useState<Property | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/properties/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Property not found');
          }
          throw new Error(`Server error: ${response.status}`);
        }
        const data = await response.json();
        setProperty(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error && showError) return <div>Error: {error.message}</div>;
  if (!property) return <div>No property data</div>;

  return (
    <div>
      <h1>Property: {property.address}</h1>
      <p>Price: ${property.price}</p>
      <p>{property.description}</p>
      <p>{property.bedrooms} bedrooms, {property.bathrooms} bathrooms</p>
      <p>{property.squareFootage} sq ft</p>
    </div>
  );
};

// Setup handlers for this test file
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('PropertyFetcher', () => {
  test('renders property data when API call succeeds', async () => {
    // Override the default handler for this test
    server.use(
      rest.get(`${API_URL}/properties/:id`, (req, res, ctx) => {
        return res(
          ctx.json({
            id: 1,
            address: '123 Test Street, London',
            price: 500000,
            description: 'A nice property',
            bedrooms: 3,
            bathrooms: 2,
            squareFootage: 1500,
            images: [
              {
                id: 1,
                fileName: 'test.jpg',
                contentType: 'image/jpeg',
                url: 'http://example.com/test.jpg'
              }
            ]
          })
        );
      })
    );
    
    render(<PropertyFetcher id={1} />);
    
    // Check loading state
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Property: 123 Test Street, London')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Price: $500000')).toBeInTheDocument();
    expect(screen.getByText('A nice property')).toBeInTheDocument();
    expect(screen.getByText('3 bedrooms, 2 bathrooms')).toBeInTheDocument();
    expect(screen.getByText('1500 sq ft')).toBeInTheDocument();
  });

  test('handles 404 errors when property not found', async () => {
    // Override the default handler for this test
    server.use(
      rest.get(`${API_URL}/properties/:id`, (req, res, ctx) => {
        return res(ctx.status(404));
      })
    );
    
    render(<PropertyFetcher id={999} />);
    
    await waitFor(() => {
      expect(screen.getByText('Error: Property not found')).toBeInTheDocument();
    });
  });

  test('handles 500 server errors', async () => {
    // Override the default handler for this test
    server.use(
      rest.get(`${API_URL}/properties/:id`, (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );
    
    render(<PropertyFetcher id={1} />);
    
    await waitFor(() => {
      expect(screen.getByText('Error: Server error: 500')).toBeInTheDocument();
    });
  });

  test('handles network failures', async () => {
    // Override the default handler for this test
    server.use(
      rest.get(`${API_URL}/properties/:id`, (req, res, ctx) => {
        return res.networkError('Failed to connect');
      })
    );
    
    render(<PropertyFetcher id={1} />);
    
    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });

  test('shows loading state during delayed responses', async () => {
    // Override the default handler for this test with a delay
    server.use(
      rest.get(`${API_URL}/properties/:id`, (req, res, ctx) => {
        return res(
          ctx.delay(500), // Add a 500ms delay
          ctx.json({
            id: 1,
            address: '123 Test Street, London',
            price: 500000,
            description: 'A nice property',
            bedrooms: 3,
            bathrooms: 2,
            squareFootage: 1500,
            images: [
              {
                id: 1,
                fileName: 'test.jpg',
                contentType: 'image/jpeg',
                url: 'http://example.com/test.jpg'
              }
            ]
          })
        );
      })
    );
    
    render(<PropertyFetcher id={1} />);
    
    // Initially should show loading
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    // After the delay, should show property data
    await waitFor(() => {
      expect(screen.getByText('Property: 123 Test Street, London')).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  test('suppresses error component when showError is false', async () => {
    // Override the default handler for this test
    server.use(
      rest.get(`${API_URL}/properties/:id`, (req, res, ctx) => {
        return res(ctx.status(404));
      })
    );
    
    render(<PropertyFetcher id={999} showError={false} />);
    
    // First check loading is displayed
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    // Wait for loading to finish and fallback message to appear
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    // Should not show error message
    expect(screen.queryByText('Error: Property not found')).not.toBeInTheDocument();
    
    // Should show the fallback message
    expect(screen.getByText('No property data')).toBeInTheDocument();
  });
}); 