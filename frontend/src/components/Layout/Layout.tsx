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
    <div className="min-h-screen bg-[#f7f7f7] p-0">
      <div className="container mx-auto">
        <div className="bg-white text-[#00deb6] rounded-lg px-4 py-2 flex justify-between items-center">
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

      <div className="container mx-auto">
        <div className="mt-4">
          {children}
        </div>
      </div>
    </div>
  );
} 