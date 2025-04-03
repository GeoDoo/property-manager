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
    <div className="min-h-screen bg-[#f7f7f7] pb-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white text-[#00deb6] rounded-lg py-2">
          <div className="flex justify-between items-center">
            {!isHomePage ? (
              <Button
                variant="outline"
                onClick={() => navigate(ROUTES.HOME)}
                className="bg-[#00deb6] hover:bg-[#00deb6]/90 text-white"
              >
                Back to Property Manager
              </Button>
            ) : (
              <>
                <a
                  href={ROUTES.HOME}
                  className="text-2xl font-bold cursor-pointer text-[#00deb6] hover:text-[#00deb6]"
                >
                  <h1>Property Manager</h1>
                </a>
                <Button 
                  onClick={() => navigate(ROUTES.PROPERTIES.NEW)}
                  variant="outline"
                  className="bg-[#00deb6] hover:bg-[#00deb6]/90 text-white"
                >
                  Add Property
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Section */}
      <div className="max-w-7xl mx-auto px-6 mt-4">
        {children}
      </div>
    </div>
  );
} 