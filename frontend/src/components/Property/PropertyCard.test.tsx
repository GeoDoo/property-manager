import { render, screen, fireEvent } from '@testing-library/react';
import PropertyCard from './PropertyCard';
import { Property } from '../../types/property';
import { BrowserRouter } from 'react-router-dom';

// Mock the react-router-dom useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    __esModule: true,
    ...originalModule,
    useNavigate: () => mockNavigate
  };
});

// Mock the getFullImageUrl function
jest.mock('../../config/api', () => ({
  getFullImageUrl: jest.fn((url) => `https://mocked-url.com/${url}`)
}));

// Mock the auth context
jest.mock('../../context/AuthContext', () => {
  const originalModule = jest.requireActual('../../context/AuthContext');
  return {
    ...originalModule,
    useAuth: () => ({
      isAuthenticated: true,
      isAdmin: false, // Default for most tests
      user: { username: 'testuser', isAdmin: false },
      login: jest.fn(),
      logout: jest.fn(),
      loading: false,
      error: null
    }),
    AuthProvider: ({ children }: { children: React.ReactNode }) => children
  };
});

describe('PropertyCard Component', () => {
  const mockProperty: Property = {
    id: 1,
    address: '123 Test Street',
    price: 250000,
    description: 'A beautiful test property',
    bedrooms: 3,
    bathrooms: 2,
    squareFootage: 1500,
    images: [
      { 
        id: 1, 
        url: 'test-image.jpg',
        fileName: 'test-image.jpg',
        contentType: 'image/jpeg'
      }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders property details correctly', () => {
    render(
      <BrowserRouter>
        <PropertyCard property={mockProperty} />
      </BrowserRouter>
    );

    expect(screen.getByText('123 Test Street')).toBeInTheDocument();
    expect(screen.getByText('£250,000')).toBeInTheDocument();
    expect(screen.getByText('A beautiful test property')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument(); // Bedrooms
    expect(screen.getByText('2')).toBeInTheDocument(); // Bathrooms
    expect(screen.getByText('1,500')).toBeInTheDocument(); // Square footage
    
    // Verify image is rendered
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'https://mocked-url.com/test-image.jpg');
    expect(image).toHaveAttribute('alt', '123 Test Street');
  });

  test('displays placeholder when no images', () => {
    const propertyNoImages = {
      ...mockProperty,
      images: []
    };

    render(
      <BrowserRouter>
        <PropertyCard property={propertyNoImages} />
      </BrowserRouter>
    );

    // Check that the FaHome icon container is rendered instead of an image
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByTestId('property-placeholder')).toBeInTheDocument();
  });

  test('navigates to details page when card is clicked', () => {
    render(
      <BrowserRouter>
        <PropertyCard property={mockProperty} />
      </BrowserRouter>
    );

    // Click the card
    const card = screen.getByTestId('property-card');
    fireEvent.click(card);

    // Expect navigation to details page
    expect(mockNavigate).toHaveBeenCalledWith(`/properties/${mockProperty.id}`);
  });

  test('navigates to edit page when edit button is clicked', () => {
    // Override the useAuth mock for this test only
    jest.spyOn(require('../../context/AuthContext'), 'useAuth').mockImplementation(() => ({
      isAuthenticated: true,
      isAdmin: true, // Set admin to true for this test
      user: { username: 'admin', isAdmin: true },
      login: jest.fn(),
      logout: jest.fn(),
      loading: false,
      error: null
    }));

    render(
      <BrowserRouter>
        <PropertyCard property={mockProperty} />
      </BrowserRouter>
    );

    // Click the edit button which is now visible
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    // Expect navigation to edit page and event propagation to be stopped
    expect(mockNavigate).toHaveBeenCalledWith(`/properties/${mockProperty.id}/edit`);
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });
}); 