import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
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

// Mock @tanstack/react-query
jest.mock('@tanstack/react-query', () => {
  const originalModule = jest.requireActual('@tanstack/react-query');
  return {
    ...originalModule,
    useQuery: jest.fn(),
    useMutation: jest.fn(),
    useQueryClient: jest.fn()
  };
});

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

jest.mock('../Button', () => ({
  Button: ({ onClick, children, variant }: { onClick: () => void; children: React.ReactNode; variant?: string }) => (
    <button onClick={onClick} data-testid={`mock-button-${variant || 'default'}`}>{children}</button>
  )
}));

// Import useQuery for mocking
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Mock window.confirm
const originalConfirm = window.confirm;

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
  const mockMutate = jest.fn();
  const mockInvalidateQueries = jest.fn();
  const mockGetQueryData = jest.fn();
  
  beforeEach(() => {
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useAuth as jest.Mock).mockReturnValue({ isAdmin: true });
    
    // Reset useQuery and useMutation mocks
    (useQuery as jest.Mock).mockReset();
    (useMutation as jest.Mock).mockReset();
    (useQueryClient as jest.Mock).mockReset();
    
    // Mock useQueryClient
    (useQueryClient as jest.Mock).mockReturnValue({
      invalidateQueries: mockInvalidateQueries,
      getQueryData: mockGetQueryData
    });
    
    // Mock useMutation to return a mock mutate function
    (useMutation as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isLoading: false
    });
    
    jest.clearAllMocks();
    window.confirm = jest.fn();
  });

  afterEach(() => {
    window.confirm = originalConfirm;
  });

  it('renders loading state initially', () => {
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: true,
      error: null,
      data: null
    });
    
    renderWithQueryClient(<PropertyDetails />);
    expect(screen.getByTestId('mock-layout')).toBeInTheDocument();
    const spinner = screen.getByTestId('mock-layout').querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('renders error state when property is not found', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      error: new Error('Property not found'),
      data: null
    });
    
    // Suppress console errors
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    renderWithQueryClient(<PropertyDetails />);
    
    // Check for error message
    expect(screen.getByText(/error loading property details/i)).toBeInTheDocument();
    
    // Clean up the mock
    (console.error as jest.Mock).mockRestore();
  });

  it('renders property details correctly', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      error: null,
      data: mockProperty
    });
    
    renderWithQueryClient(<PropertyDetails />);

    // Check price and address
    expect(screen.getByText('£250,000')).toBeInTheDocument();
    expect(screen.getByText('123 Test Street')).toBeInTheDocument();

    // Check property features using more specific queries
    expect(screen.getByRole('heading', { name: /property details/i })).toBeInTheDocument();
    
    // Check bedroom value
    expect(screen.getByText('3', { selector: '.text-lg' })).toBeInTheDocument();
    
    // Check bathroom value
    expect(screen.getByText('2', { selector: '.text-lg' })).toBeInTheDocument();
    
    // Check square footage value
    expect(screen.getByText(/1500 sq ft/i)).toBeInTheDocument();
    
    // Check square meters value (approx conversion)
    expect(screen.getByText(/139 sq m/i)).toBeInTheDocument();

    // Check description
    expect(screen.getByText('A beautiful test property with details')).toBeInTheDocument();

    // Check image slider
    expect(screen.getByTestId('mock-image-slider')).toHaveTextContent('1 images mocked');
  });

  it('uses cached property data when available', () => {
    // Set up the ID in params
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    
    // Mock cached property data
    const cachedProperties = {
      content: [
        {
          id: 1,
          price: 500000,
          address: '123 Test Street',
          description: 'A lovely test home',
          bedrooms: 3,
          bathrooms: 2,
          squareFootage: 1500,
          images: []
        }
      ]
    };
    
    mockGetQueryData.mockReturnValue(cachedProperties);
    
    let initialDataFn: Function | undefined;
    
    (useQuery as jest.Mock).mockImplementation(({ queryKey, initialData }) => {
      // Capture the initialData function
      initialDataFn = initialData;
      
      // Return a loading state
      return {
        isLoading: true,
        error: null,
        data: initialData ? initialData() : null
      };
    });
    
    renderWithQueryClient(<PropertyDetails />);
    
    // Check that the loading state is shown
    expect(screen.getByTestId('mock-layout')).toBeInTheDocument();
    expect(screen.getByTestId('mock-layout').querySelector('.animate-spin')).toBeInTheDocument();
    
    // Verify that getQueryData was called with the right key
    expect(mockGetQueryData).toHaveBeenCalledWith(['properties']);
    
    // Verify the initialData function works correctly
    const result = initialDataFn && initialDataFn();
    expect(result).toEqual(cachedProperties.content[0]);
  });

  it('handles retry configuration correctly', () => {
    let queryConfig: any = {};
    
    // Capture the query configuration
    (useQuery as jest.Mock).mockImplementation((config) => {
      queryConfig = config;
      return {
        isLoading: false,
        error: null,
        data: mockProperty
      };
    });
    
    renderWithQueryClient(<PropertyDetails />);
    
    // Verify the retry configuration
    expect(queryConfig.retry).toBe(2);
    expect(queryConfig.retryDelay).toBe(1000);
    expect(queryConfig.enabled).toBe(true);
  });
  
  it('shows empty state correctly when no property ID is provided', () => {
    // Set empty ID
    (useParams as jest.Mock).mockReturnValue({ id: undefined });
    
    (useQuery as jest.Mock).mockImplementation((config) => {
      // Verify that enabled is false when no ID is provided
      expect(config.enabled).toBe(false);
      
      return {
        isLoading: false,
        error: null,
        data: null
      };
    });
    
    renderWithQueryClient(<PropertyDetails />);
    
    // Verify empty state is shown
    expect(screen.getByText(/property not found/i)).toBeInTheDocument();
  });

  it('navigates to edit page when edit button is clicked', () => {
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      error: null,
      data: mockProperty
    });
    
    renderWithQueryClient(<PropertyDetails />);

    // Find and click the edit button
    const editButton = screen.getByTestId('mock-button-primary');
    expect(editButton).toHaveTextContent('Edit property');
    fireEvent.click(editButton);

    // Check that navigation was called with the correct path
    expect(mockNavigate).toHaveBeenCalledWith(`/properties/${mockProperty.id}/edit`);
  });

  it('deletes property when delete is confirmed', () => {
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      error: null,
      data: mockProperty
    });
    
    (window.confirm as jest.Mock).mockReturnValue(true);
    
    renderWithQueryClient(<PropertyDetails />);

    // Find and click the delete button
    const deleteButton = screen.getByTestId('mock-button-danger');
    expect(deleteButton).toHaveTextContent('Delete');
    fireEvent.click(deleteButton);

    // Check that confirmation was shown
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this property?');
    
    // Check that mutate was called with the property ID
    expect(mockMutate).toHaveBeenCalledWith(1);
  });

  it('verifies delete mutation callbacks directly', () => {
    // Mock the useQuery implementation to return data
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      error: null,
      data: mockProperty
    });
    
    // Mock the useMutation implementation to capture the onSuccess callback
    let successCallback: Function | undefined;
    
    (useMutation as jest.Mock).mockImplementation(({ onSuccess }) => {
      successCallback = onSuccess;
      return {
        mutate: mockMutate,
        isLoading: false
      };
    });
    
    // Render component to set up the mutation
    renderWithQueryClient(<PropertyDetails />);
    
    // Ensure callback was captured
    expect(successCallback).toBeDefined();
    
    // Directly call the success handler
    if (successCallback) {
      successCallback();
      
      // Verify the correct actions were taken
      expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['properties'] });
      expect(mockNavigate).toHaveBeenCalledWith('/');
    }
  });

  it('does not delete property when delete is canceled', () => {
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      error: null,
      data: mockProperty
    });
    
    (window.confirm as jest.Mock).mockReturnValue(false);
    
    renderWithQueryClient(<PropertyDetails />);

    // Find and click the delete button
    const deleteButton = screen.getByTestId('mock-button-danger');
    fireEvent.click(deleteButton);

    // Check that confirmation was shown
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this property?');
    
    // Check that delete API was NOT called
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('does not show edit/delete buttons for non-admin users', () => {
    (useAuth as jest.Mock).mockReturnValue({ isAdmin: false });
    
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      error: null,
      data: mockProperty
    });
    
    renderWithQueryClient(<PropertyDetails />);

    // Check that edit and delete buttons are not shown
    expect(screen.queryByTestId('mock-button-primary')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mock-button-danger')).not.toBeInTheDocument();
  });

  it('handles property with missing data gracefully', () => {
    const propertyWithMissingData = {
      ...mockProperty,
      description: undefined,
      squareFootage: 0,
      images: []
    };
    
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      error: null,
      data: propertyWithMissingData
    });
    
    renderWithQueryClient(<PropertyDetails />);

    // Should show 0 for square footage
    expect(screen.getByText(/0 sq ft/i)).toBeInTheDocument();
    expect(screen.getByText(/0 sq m/i)).toBeInTheDocument();

    // Should show "No description available" for missing description
    expect(screen.getByText(/no description available/i)).toBeInTheDocument();

    // Should handle empty images array
    expect(screen.getByTestId('mock-image-slider')).toHaveTextContent('0 images mocked');
  });

  it('shows error message when property id is invalid', () => {
    // Set an invalid ID
    (useParams as jest.Mock).mockReturnValue({ id: 'invalid' });
    
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      error: new Error('Invalid property ID'),
      data: null
    });
    
    // Suppress console errors
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    renderWithQueryClient(<PropertyDetails />);
    
    const errorElement = screen.getByText(/error loading property details/i);
    expect(errorElement).toBeInTheDocument();
    
    // Restore console
    (console.error as jest.Mock).mockRestore();
  });

  it('renders button to navigate back to home when property is null', () => {
    // Return null property (property not found)
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      error: null,
      data: null
    });
    
    renderWithQueryClient(<PropertyDetails />);
    
    // Check for property not found message
    expect(screen.getByText(/property not found/i)).toBeInTheDocument();
    
    // Find and click the go back button
    const goBackButton = screen.getByTestId('mock-button-default');
    expect(goBackButton).toHaveTextContent('Go back to properties');
    
    fireEvent.click(goBackButton);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('shows loading state when data is loading', () => {
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: true,
      error: null,
      data: null
    });
    
    renderWithQueryClient(<PropertyDetails />);
    
    // Verify loading spinner is shown
    expect(screen.getByTestId('mock-layout').querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('calls query function with correct property ID', () => {
    // Mock property ID in URL parameters
    (useParams as jest.Mock).mockReturnValue({ id: '42' });
    
    // Create a mock for the query function
    const mockQueryFn = jest.fn();
    let capturedQueryFn: Function | undefined;
    
    // Mock useQuery to capture the queryFn
    (useQuery as jest.Mock).mockImplementation(({ queryKey, queryFn }) => {
      capturedQueryFn = queryFn;
      return {
        isLoading: false,
        error: null,
        data: mockProperty
      };
    });
    
    // Mock propertyService.getById
    (propertyService.getById as jest.Mock).mockImplementation(mockQueryFn);
    
    renderWithQueryClient(<PropertyDetails />);
    
    // Ensure query function was captured
    expect(capturedQueryFn).toBeDefined();
    
    // Call the query function and verify it calls propertyService.getById with the correct ID
    if (capturedQueryFn) {
      capturedQueryFn();
      expect(mockQueryFn).toHaveBeenCalledWith(42);
    }
  });
}); 