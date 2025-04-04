import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Filter from './Filter';

describe('Filter Component', () => {
  const mockOnFilterChange = jest.fn();
  const defaultFilters = {
    address: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    page: 0,
    size: 10
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders filter fields correctly', () => {
    render(<Filter onFilterChange={mockOnFilterChange} />);
    
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/min price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/max price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/bedrooms/i)).toBeInTheDocument();
  });

  test('updates field values when user types', () => {
    render(<Filter onFilterChange={mockOnFilterChange} />);
    
    const addressInput = screen.getByLabelText(/address/i);
    fireEvent.change(addressInput, { target: { value: '123 Test Street' } });
    expect(addressInput).toHaveValue('123 Test Street');
    
    const minPriceInput = screen.getByLabelText(/min price/i);
    fireEvent.change(minPriceInput, { target: { value: '100000' } });
    expect(minPriceInput).toHaveValue(100000);
  });

  test('calls onFilterChange after debounce when user types', async () => {
    render(<Filter onFilterChange={mockOnFilterChange} />);
    
    const addressInput = screen.getByLabelText(/address/i);
    fireEvent.change(addressInput, { target: { name: 'address', value: '123 Test Street' } });
    
    // Verify that callback isn't called immediately
    expect(mockOnFilterChange).not.toHaveBeenCalled();
    
    // Fast-forward timers
    jest.advanceTimersByTime(500);
    
    // Verify callback is called with correct parameters
    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...defaultFilters,
      address: '123 Test Street'
    });
  });

  test('renders with initial filters when provided', () => {
    const initialFilters = {
      address: 'Initial Address',
      minPrice: '200000',
      maxPrice: '500000',
      bedrooms: '3',
      page: 1,
      size: 20
    };
    
    render(<Filter onFilterChange={mockOnFilterChange} initialFilters={initialFilters} />);
    
    expect(screen.getByLabelText(/address/i)).toHaveValue('Initial Address');
    expect(screen.getByLabelText(/min price/i)).toHaveValue(200000);
    expect(screen.getByLabelText(/max price/i)).toHaveValue(500000);
    expect(screen.getByLabelText(/bedrooms/i)).toHaveValue(3);
  });
  
  test('resets page to 0 when filter changes', () => {
    const initialFilters = {
      address: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      page: 2,
      size: 10
    };
    
    render(<Filter onFilterChange={mockOnFilterChange} initialFilters={initialFilters} />);
    
    const addressInput = screen.getByLabelText(/address/i);
    fireEvent.change(addressInput, { target: { name: 'address', value: 'New Address' } });
    
    jest.advanceTimersByTime(500);
    
    expect(mockOnFilterChange).toHaveBeenCalledWith(expect.objectContaining({
      address: 'New Address',
      page: 0
    }));
  });
}); 