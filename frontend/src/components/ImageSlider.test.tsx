import { render, screen, fireEvent } from '@testing-library/react';
import { ImageSlider } from './ImageSlider';
import { Image } from '../types/property';
import { getFullImageUrl } from '../config/api';

// Mock getFullImageUrl function
jest.mock('../config/api', () => ({
  getFullImageUrl: jest.fn((url) => `https://mocked-url.com/${url}`)
}));

describe('ImageSlider Component', () => {
  const mockImages: Image[] = [
    { id: 1, url: 'image1.jpg', fileName: 'image1.jpg', contentType: 'image/jpeg' },
    { id: 2, url: 'image2.jpg', fileName: 'image2.jpg', contentType: 'image/jpeg' },
    { id: 3, url: 'image3.jpg', fileName: 'image3.jpg', contentType: 'image/jpeg' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly with images', () => {
    render(<ImageSlider images={mockImages} />);
    
    // Check if the first image is displayed
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'https://mocked-url.com/image1.jpg');
    expect(image).toHaveAttribute('alt', 'Property 1');
    
    // Check if navigation buttons are rendered
    expect(screen.getByLabelText('Previous image')).toBeInTheDocument();
    expect(screen.getByLabelText('Next image')).toBeInTheDocument();
    
    // Check if the image counter shows the correct count
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
  });
  
  test('renders placeholder when no images are provided', () => {
    render(<ImageSlider images={[]} />);
    
    expect(screen.getByText('No Images Available')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
  
  test('renders placeholder when images prop is omitted', () => {
    // @ts-ignore - intentionally omitting the required prop to test default parameter
    render(<ImageSlider />);
    
    expect(screen.getByText('No Images Available')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
  
  test('renders error message when image URL is invalid', () => {
    const imagesWithInvalidUrl = [
      { id: 1, url: '', fileName: 'image1.jpg', contentType: 'image/jpeg' }
    ];
    
    render(<ImageSlider images={imagesWithInvalidUrl} />);
    
    expect(screen.getByText('Invalid Image URL')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
  
  test('navigates to the next image when next button is clicked', () => {
    render(<ImageSlider images={mockImages} />);
    
    // Initial image should be the first one
    let image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'https://mocked-url.com/image1.jpg');
    
    // Click the next button
    fireEvent.click(screen.getByLabelText('Next image'));
    
    // Now the second image should be displayed
    image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'https://mocked-url.com/image2.jpg');
    expect(screen.getByText('2 / 3')).toBeInTheDocument();
  });
  
  test('navigates to the previous image when previous button is clicked', () => {
    render(<ImageSlider images={mockImages} />);
    
    // Go to the second image first
    fireEvent.click(screen.getByLabelText('Next image'));
    
    // Verify we're on the second image
    let image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'https://mocked-url.com/image2.jpg');
    
    // Click the previous button to go back to the first image
    fireEvent.click(screen.getByLabelText('Previous image'));
    
    // Now we should be back on the first image
    image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'https://mocked-url.com/image1.jpg');
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
  });
  
  test('loops to the last image when clicking previous on the first image', () => {
    render(<ImageSlider images={mockImages} />);
    
    // We're on the first image
    let image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'https://mocked-url.com/image1.jpg');
    
    // Click the previous button to go to the last image
    fireEvent.click(screen.getByLabelText('Previous image'));
    
    // Now we should be on the last image
    image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'https://mocked-url.com/image3.jpg');
    expect(screen.getByText('3 / 3')).toBeInTheDocument();
  });
  
  test('loops to the first image when clicking next on the last image', () => {
    render(<ImageSlider images={mockImages} />);
    
    // Go to the last image
    fireEvent.click(screen.getByLabelText('Next image')); // to 2nd
    fireEvent.click(screen.getByLabelText('Next image')); // to 3rd
    
    // Verify we're on the last image
    let image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'https://mocked-url.com/image3.jpg');
    
    // Click next again to loop to the first image
    fireEvent.click(screen.getByLabelText('Next image'));
    
    // Now we should be back on the first image
    image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'https://mocked-url.com/image1.jpg');
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
  });
  
  test('goes to the specific slide when dot indicator is clicked', () => {
    render(<ImageSlider images={mockImages} />);
    
    // Find all dot indicators
    const dots = screen.getAllByRole('button', { name: /Go to image/i });
    expect(dots).toHaveLength(3);
    
    // Click the third dot to go to the third image
    fireEvent.click(dots[2]);
    
    // Verify we're now on the third image
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'https://mocked-url.com/image3.jpg');
    expect(screen.getByText('3 / 3')).toBeInTheDocument();
  });
}); 