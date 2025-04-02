import React, { useEffect, useRef } from 'react';

interface FilterProps {
  onFilterChange: (filters: {
    address: string;
    minPrice: string;
    maxPrice: string;
    bedrooms: string;
    page: number;
    size: number;
  }) => void;
  initialFilters?: {
    address: string;
    minPrice: string;
    maxPrice: string;
    bedrooms: string;
    page: number;
    size: number;
  };
}

// Validation functions
const validateNumber = (value: string): string => {
  // Only allow digits and limit length
  return value.replace(/\D/g, '').slice(0, 10);
};

const validateAddress = (value: string): string => {
  // Remove HTML tags and limit length
  return value.replace(/<[^>]*>/g, '').slice(0, 100);
};

const Filter: React.FC<FilterProps> = ({ onFilterChange, initialFilters = {
  address: '',
  minPrice: '',
  maxPrice: '',
  bedrooms: '',
  page: 0,
  size: 10
} }) => {
  const [filters, setFilters] = React.useState(initialFilters);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value, page: 0 }; // Reset to first page when filters change
    setFilters(newFilters);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onFilterChange(newFilters);
    }, 500);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">Filter Properties</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={filters.address}
            onChange={handleChange}
            placeholder="Search by address"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            maxLength={100}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Min Price
          </label>
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleChange}
            placeholder="Min price"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            min="0"
            max="9999999999"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Price
          </label>
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleChange}
            placeholder="Max price"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            min="0"
            max="9999999999"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bedrooms
          </label>
          <input
            type="number"
            name="bedrooms"
            value={filters.bedrooms}
            onChange={handleChange}
            placeholder="Number of bedrooms"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            min="0"
            max="99"
          />
        </div>
      </div>
    </div>
  );
};

export default Filter; 