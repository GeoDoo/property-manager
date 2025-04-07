import { render, screen, fireEvent } from '@testing-library/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Navigation } from './Navigation';
import { useAuth } from '../../context/AuthContext';

// Mock dependencies
jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
  Link: ({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) => (
    <a href={to} className={className} data-testid="mock-link">
      {children}
    </a>
  )
}));

jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn()
}));

jest.mock('../../config/routes', () => ({
  ROUTES: {
    HOME: '/',
    LOGIN: '/login',
    PROPERTIES: {
      NEW: '/properties/new'
    }
  }
}));

describe('Navigation Component', () => {
  const mockNavigate = jest.fn();
  const mockLogout = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useLocation as jest.Mock).mockReturnValue({ pathname: '/' });
  });

  it('renders logo and login link when user is not authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isAdmin: false,
      logout: mockLogout
    });

    render(<Navigation />);
    
    // Check logo link
    const links = screen.getAllByTestId('mock-link');
    const logoLink = links.find(link => link.textContent === 'Property Manager');
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute('href', '/');
    
    // Check login link
    const loginLink = links.find(link => link.textContent === 'Login');
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/login');
    
    // Ensure Add Property link is not shown
    const addPropertyLink = links.find(link => link.textContent === 'Add Property');
    expect(addPropertyLink).toBeUndefined();
  });

  it('renders logo and logout button when user is authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { username: 'testuser', isAdmin: false },
      isAdmin: false,
      logout: mockLogout
    });

    render(<Navigation />);
    
    // Check logo link
    const links = screen.getAllByTestId('mock-link');
    const logoLink = links.find(link => link.textContent === 'Property Manager');
    expect(logoLink).toBeInTheDocument();
    
    // Check logout button
    const logoutButton = screen.getByText('Logout');
    expect(logoutButton).toBeInTheDocument();
    
    // Click logout button and check if logout function is called
    fireEvent.click(logoutButton);
    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('renders Add Property link when user is admin', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { username: 'admin', isAdmin: true },
      isAdmin: true,
      logout: mockLogout
    });
    
    render(<Navigation />);
    
    // Check Add Property link is shown
    const links = screen.getAllByTestId('mock-link');
    const addPropertyLink = links.find(link => link.textContent === 'Add Property');
    expect(addPropertyLink).toBeInTheDocument();
    expect(addPropertyLink).toHaveAttribute('href', '/properties/new');
  });

  it('renders Add Property link when user is admin on any page', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { username: 'admin', isAdmin: true },
      isAdmin: true,
      logout: mockLogout
    });
    
    // Set a non-home page path
    (useLocation as jest.Mock).mockReturnValue({ pathname: '/properties/1' });

    render(<Navigation />);
    
    // Check Add Property link is shown even on non-home pages
    const links = screen.getAllByTestId('mock-link');
    const addPropertyLink = links.find(link => link.textContent === 'Add Property');
    expect(addPropertyLink).toBeInTheDocument();
    expect(addPropertyLink).toHaveAttribute('href', '/properties/new');
  });
}); 