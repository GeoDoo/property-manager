import { render, screen, waitFor } from '@testing-library/react';
import { useParams, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropertyDetails } from './PropertyDetails';
import { propertyService } from '../../services/propertyService';
import { useAuth } from '../../context/AuthContext';

// Mock dependencies
jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
  useNavigate: jest.fn(() => jest.fn())
}));

jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn()
}));

jest.mock('../../services/propertyService', () => ({
  propertyService: {
    getById: jest.fn(),
    delete: jest.fn()
  }
}));

jest.mock('../Layout/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-layout">{children}</div>
  )
}));

jest.mock('../ImageSlider', () => ({
  ImageSlider: ({ images }: { images: any[] }) => (
    <div data-testid="mock-image-slider">{images.length} images mocked</div>
  )
}));

const mockProperty = {
  id: 1,
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

const renderWithQueryClient = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  });
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
};

describe('PropertyDetails Component', () => {
  const mockNavigate = jest.fn();
  
  beforeEach(() => {
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useAuth as jest.Mock).mockReturnValue({ user: { username: 'admin', isAdmin: true } });
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    (propertyService.getById as jest.Mock).mockReturnValue(new Promise(() => {}));
    renderWithQueryClient(<PropertyDetails />);
    expect(screen.getByTestId('mock-layout')).toBeInTheDocument();
    const spinner = screen.getByTestId('mock-layout').querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('renders error state when property is not found', async () => {
    (propertyService.getById as jest.Mock).mockRejectedValue(new Error('Property not found'));
    
    // We need to mock how the component renders errors by overriding the implementation
    jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console errors
    
    renderWithQueryClient(<PropertyDetails />);
    
    // Use a longer timeout for this test
    await waitFor(() => {
      // The rejected Promise should eventually show an error message
      const errorTextRegex = /error|not found|loading property details/i;
      // Query the entire document body's text content to find the error message
      expect(document.body.textContent).toMatch(errorTextRegex);
    }, { timeout: 3000 });
    
    // Clean up the mock
    (console.error as jest.Mock).mockRestore();
  });

  it('renders property details correctly', async () => {
    (propertyService.getById as jest.Mock).mockResolvedValue(mockProperty);
    renderWithQueryClient(<PropertyDetails />);

    // Check price and address
    await waitFor(() => {
      expect(screen.getByText('£250,000')).toBeInTheDocument();
    });
    expect(screen.getByText('123 Test Street')).toBeInTheDocument();

    // Check property features using more specific queries
    expect(screen.getByRole('heading', { name: /property details/i })).toBeInTheDocument();
    
    const bedroomValue = screen.getByText('3', { selector: '.text-lg' });
    const bathroomValue = screen.getByText('2', { selector: '.text-lg' });
    const squareFootageValue = screen.getByText(/1500 sq ft/i);
    const squareMetersValue = screen.getByText(/139 sq m/i);

    expect(bedroomValue).toBeInTheDocument();
    expect(bathroomValue).toBeInTheDocument();
    expect(squareFootageValue).toBeInTheDocument();
    expect(squareMetersValue).toBeInTheDocument();

    // Check description
    expect(screen.getByText('A beautiful test property with details')).toBeInTheDocument();

    // Check image slider
    expect(screen.getByTestId('mock-image-slider')).toHaveTextContent('1 images mocked');
  });

  it('handles property with missing data gracefully', async () => {
    const propertyWithMissingData = {
      ...mockProperty,
      description: undefined,
      squareFootage: 0,
      images: []
    };
    
    (propertyService.getById as jest.Mock).mockResolvedValue(propertyWithMissingData);
    renderWithQueryClient(<PropertyDetails />);

    // Wait for property to load
    await waitFor(() => {
      expect(screen.getByText('£250,000')).toBeInTheDocument();
    });

    // Should show 0 for square footage
    expect(screen.getByText(/0 sq ft/i)).toBeInTheDocument();
    expect(screen.getByText(/0 sq m/i)).toBeInTheDocument();

    // Should show "No description available" for missing description
    expect(screen.getByText(/no description available/i)).toBeInTheDocument();

    // Should handle empty images array
    expect(screen.getByTestId('mock-image-slider')).toHaveTextContent('0 images mocked');
  });

  it('shows error message when property id is invalid', async () => {
    // Set an invalid ID
    (useParams as jest.Mock).mockReturnValue({ id: 'invalid' });
    (propertyService.getById as jest.Mock).mockRejectedValue(new Error('Invalid property ID'));
    
    // Suppress console errors
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    renderWithQueryClient(<PropertyDetails />);
    
    await waitFor(() => {
      const errorElement = screen.getByText(/error loading property details/i);
      expect(errorElement).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Restore console
    (console.error as jest.Mock).mockRestore();
  });
}); 