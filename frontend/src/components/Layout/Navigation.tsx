import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import { useAuth } from '../../context/AuthContext';

export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };

  return (
    <div className="flex justify-between items-center py-4">
      <Link to={ROUTES.HOME} className="text-2xl font-bold text-[#00deb6]">
        Property Manager
      </Link>
      <div className="flex items-center gap-2">
        {isAdmin && (
          <Link
            to={ROUTES.PROPERTIES.NEW}
            className="bg-white text-[#00deb6] border-2 border-[#00deb6] hover:border-[#00c5a0] hover:text-[#00c5a0] px-4 py-2 rounded-xl transition-colors"
          >
            Add Property
          </Link>
        )}
        {user ? (
          <button
            onClick={handleLogout}
            className="bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400 px-4 py-2 rounded-xl transition-colors"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="bg-[#00deb6] text-white border-2 border-[#00deb6] hover:bg-[#00c5a0] hover:border-[#00c5a0] px-4 py-2 rounded-xl transition-colors"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
} 