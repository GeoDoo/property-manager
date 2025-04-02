import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../Button';
import { ROUTES } from '../../config/routes';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === ROUTES.HOME;

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <div className="bg-[#00deb6] text-white">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {!isHomePage ? (
            <Button
              variant="outline"
              onClick={() => navigate(ROUTES.HOME)}
              className="bg-white hover:bg-gray-50"
            >
              Back to properties
            </Button>
          ) : (
            <>
              <h1 className="text-2xl font-bold">Properties</h1>
              <Button 
                onClick={() => navigate(ROUTES.PROPERTIES.NEW)}
                variant="outline"
                className="bg-white hover:bg-gray-50"
              >
                Add Property
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="container mx-auto p-4">
        {children}
      </div>
    </div>
  );
} 