import { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import axios from 'axios';

// Define the shape of your user data
interface User {
  id: string;
  displayName: string;
  email: string;
  avatar: string; // URL to the user's Google profile picture
}

// Define the context shape
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the API base URL. Use environment variables for this in a real app.
const SERVER_BASE_URL = 'http://localhost:5000';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null); //use interface User
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This function checks if a user session exists on the backend
    const verifyUser = async () => {
      try {
        const response = await axios.get(`${SERVER_BASE_URL}/api/me`, { //get user info from this route
          withCredentials: true, // IMPORTANT: This is needed to send cookies
        });
        setUser(response.data.user);
      } catch (error) {
        console.log("No active session or verification failed.");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    verifyUser();
  }, []);

  const logout = async () => {
    try {
      await axios.post(`${SERVER_BASE_URL}/auth/logout`, {}, {
        withCredentials: true, // Send cookie to identify the session to destroy
      });
      // Redirect to login or home page after logout
      window.location.href = '/login';
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if backend fails, force a frontend logout
      setUser(null);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to easily access the auth context
//add below line
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};