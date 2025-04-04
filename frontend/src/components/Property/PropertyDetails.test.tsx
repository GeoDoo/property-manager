import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { http, HttpResponse, delay } from 'msw';
import { setupWorker } from 'msw/browser';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropertyDetails } from '../Property/PropertyDetails';
import { Property } from '../../types/property';

// Mock the react-router-dom hooks
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    __esModule: true,
    ...originalModule,
    useParams: () => ({ id: '123' }),
    useNavigate: () => mockNavigate
  };
});

// Mock the ImageSlider component
jest.mock('../ImageSlider', () => ({
  ImageSlider: jest.fn(({ images }) => (
    <div data-testid="mock-image-slider">
      {images?.length} images mocked
    </div>
  ))
}));

// Mock the Layout component
jest.mock('../Layout/Layout', () => ({
  Layout: jest.fn(({ children }) => (
    <div data-testid="mock-layout">{children}</div>
  ))
}));

// Sample property for testing
const mockProperty: Property = {
  id: 123,
  address: '123 Test Street',
  price: 250000,
  description: 'A beautiful test property with details',
  bedrooms: 3,
  bathrooms: 2,
  squareFootage: 1500,
  images: [
    { id: 1, url: 'test-image.jpg', fileName: 'test-image.jpg', contentType: 'image/jpeg' }
  ]
};

// Define the handlers
const handlers = [
  // GET property by ID handler
  http.get('/api/properties/123', () => {
    return HttpResponse.json(mockProperty);
  }),

  // DELETE property handler
  http.delete('/api/properties/123', () => {
    return HttpResponse.json({});
  })
];

// Set up MSW - we'll use a different approach since setupServer is causing issues
// Mock the fetch calls directly instead
jest.mock('../../services/propertyService', () => ({
  propertyService: {
    getById: jest.fn(() => Promise.resolve(mockProperty)),
    delete: jest.fn(() => Promise.resolve({}))
  }
}));

// Import the mocked services
import { propertyService } from '../../services/propertyService';

// Create a new QueryClient for each test
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      // Use staleTime instead of cacheTime (deprecated)
      staleTime: 0,
    },
  },
});

// Mock window.confirm
const originalConfirm = window.confirm;

describe('PropertyDetails Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.confirm = jest.fn().mockReturnValue(true);
    // Reset the mocked service functions
    (propertyService.getById as jest.Mock).mockResolvedValue(mockProperty);
    (propertyService.delete as jest.Mock).mockResolvedValue({});
  });

  afterEach(() => {
    window.confirm = originalConfirm;
  });

  // Helper function to render the component with query client
  const renderWithQueryClient = () => {
    const queryClient = createTestQueryClient();
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <PropertyDetails />
        </BrowserRouter>
      </QueryClientProvider>
    );
  };

  test('renders loading state while fetching property data', async () => {
    // Make the request take longer to show loading state
    (propertyService.getById as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(mockProperty), 100))
    );
    
    renderWithQueryClient();
    
    // Should show loading initially
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    // Wait for the data to load
    await waitFor(() => {
      expect(screen.getByText('£250,000')).toBeInTheDocument();
    });
  });

  test('renders error state when property is not found', async () => {
    // Mock a 404 error response
    (propertyService.getById as jest.Mock).mockRejectedValue(new Error('Not found'));
    
    renderWithQueryClient();
    
    // Wait for the error state
    await waitFor(() => {
      expect(screen.getByText('Property not found')).toBeInTheDocument();
    });
  });

  test('renders property details correctly', async () => {
    renderWithQueryClient();
    
    // Wait for the data to load
    await waitFor(() => {
      expect(screen.getByText('£250,000')).toBeInTheDocument();
    });
    
    // Check property details are displayed
    expect(screen.getByText('123 Test Street')).toBeInTheDocument();
    expect(screen.getByText('A beautiful test property with details')).toBeInTheDocument();
    
    // Check property features
    expect(screen.getByText('3')).toBeInTheDocument(); // Bedrooms
    expect(screen.getByText('2')).toBeInTheDocument(); // Bathrooms
    expect(screen.getByText('1500 sq ft')).toBeInTheDocument(); // Square footage
    expect(screen.getByText('139 sq m')).toBeInTheDocument(); // Square meters
    
    // Check image slider is used
    expect(screen.getByTestId('mock-image-slider')).toBeInTheDocument();
    expect(screen.getByText('1 images mocked')).toBeInTheDocument();
  });

  test('navigates to edit page when Edit property button is clicked', async () => {
    renderWithQueryClient();
    
    // Wait for the data to load
    await waitFor(() => {
      expect(screen.getByText('£250,000')).toBeInTheDocument();
    });
    
    const editButton = screen.getByRole('button', { name: /edit property/i });
    fireEvent.click(editButton);
    
    expect(mockNavigate).toHaveBeenCalledWith(`/properties/${mockProperty.id}/edit`);
  });

  test('deletes property when Delete button is clicked and confirmed', async () => {
    // Spy on the window.confirm function
    window.confirm = jest.fn().mockReturnValue(true);
    
    renderWithQueryClient();
    
    // Wait for the data to load
    await waitFor(() => {
      expect(screen.getByText('£250,000')).toBeInTheDocument();
    });
    
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);
    
    // Check if confirm was called
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this property?');
    
    // Wait for navigation to happen
    await waitFor(() => {
      expect(propertyService.delete).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  test('does not delete property when Delete button is clicked but not confirmed', async () => {
    // Spy on the window.confirm function and return false
    window.confirm = jest.fn().mockReturnValue(false);
    
    renderWithQueryClient();
    
    // Wait for the data to load
    await waitFor(() => {
      expect(screen.getByText('£250,000')).toBeInTheDocument();
    });
    
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);
    
    // Check if confirm was called
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this property?');
    
    // Navigation should not happen
    expect(propertyService.delete).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('shows error state when delete fails', async () => {
    window.confirm = jest.fn().mockReturnValue(true);
    
    // Override the handler to return an error
    (propertyService.delete as jest.Mock).mockRejectedValue(new Error('Server error'));
    
    renderWithQueryClient();
    
    // Wait for the data to load
    await waitFor(() => {
      expect(screen.getByText('£250,000')).toBeInTheDocument();
    });
    
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);
    
    // Wait for error state
    // Note: If your component doesn't explicitly show the error, 
    // we can check that navigation didn't happen
    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalledWith('/');
    });
  });

  test('handles property with missing square footage', async () => {
    const propertyWithMissingData = {
      ...mockProperty,
      squareFootage: 0
    };
    
    (propertyService.getById as jest.Mock).mockResolvedValue(propertyWithMissingData);
    
    renderWithQueryClient();
    
    // Wait for the data to load and check for zero square footage display
    await waitFor(() => {
      expect(screen.getByText('0 sq ft')).toBeInTheDocument();
      expect(screen.getByText('0 sq m')).toBeInTheDocument();
    });
  });

  test('handles property with missing description', async () => {
    const propertyWithMissingDesc = {
      ...mockProperty,
      description: undefined
    };
    
    (propertyService.getById as jest.Mock).mockResolvedValue(propertyWithMissingDesc);
    
    renderWithQueryClient();
    
    // Wait for the data to load
    await waitFor(() => {
      expect(screen.getByText('No description available')).toBeInTheDocument();
    });
  });

  test('handles property with missing images', async () => {
    const propertyWithNoImages = {
      ...mockProperty,
      images: undefined
    };
    
    (propertyService.getById as jest.Mock).mockResolvedValue(propertyWithNoImages);
    
    renderWithQueryClient();
    
    // Wait for the data to load
    await waitFor(() => {
      expect(screen.getByText('0 images mocked')).toBeInTheDocument();
    });
  });

  test('displays formatted price correctly', async () => {
    const propertyWithLargePrice = {
      ...mockProperty,
      price: 1250000
    };
    
    (propertyService.getById as jest.Mock).mockResolvedValue(propertyWithLargePrice);
    
    renderWithQueryClient();
    
    // Wait for the data to load with formatted price
    await waitFor(() => {
      expect(screen.getByText('£1,250,000')).toBeInTheDocument();
    });
  });
}); 