import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AuthService, { User } from '../services/AuthService';

// Auth context interface
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
  isCurrentUser: (userId?: string) => boolean;
  isAuthDisabled: boolean;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  error: null,
  login: async () => {},
  logout: () => {},
  isAdmin: () => false,
  isCurrentUser: (userId?: string) => false,
  isAuthDisabled: false,
});

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthDisabled, setIsAuthDisabled] = useState<boolean>(false);

  // Initialize auth on component mount
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        AuthService.initAuth();
        const currentUser = await AuthService.getCurrentUser();
        if (isMounted && currentUser) {
          setUser(currentUser);
          setIsAuthDisabled(!AuthService.isAuthenticated());
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        if (isMounted) {
          AuthService.logout();
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array since this should only run once on mount

  // Login function
  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await AuthService.login(username, password);
      // Ensure we have all user data including access key
      if (!response.user.accessKey) {
        // If access key is missing, fetch complete user data
        const completeUser = await AuthService.getCurrentUser();
        setUser(completeUser);
      } else {
        setUser(response.user);
      }
    } catch (err) {
      console.log(err);
      setError('Invalid username or password');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  // Check if user is admin
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isCurrentUser = (userId?: string) => {
    return !!userId && user?.id === userId;
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAdmin,
    isAuthDisabled,
    isCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
