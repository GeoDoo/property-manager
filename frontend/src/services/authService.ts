import { api } from '../config/apiClient';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  isAdmin: boolean;
}

export const login = async (credentials: { username: string; password: string }): Promise<boolean> => {
  try {
    // Use api instance directly for /auth/login
    const response = await api.post(`/auth/login`, credentials);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        username: response.data.username,
        isAdmin: response.data.isAdmin
      }));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
};

export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = (): { username: string; isAdmin: boolean } | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    logout();
    return null;
  }
};

export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return !!user?.isAdmin;
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const authHeader = (): Record<string, string> => {
  const token = getToken();
  
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
};

// Create a default export with all the auth service functions
const authService = {
  login,
  logout,
  getCurrentUser,
  isAdmin,
  getToken,
  authHeader
};

export default authService; 