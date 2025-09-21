import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';

type User = {
  id: string;
  email: string;
  fullName: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          // Verify token with backend
          await api.get('/auth/me', {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          
          // Decode token to get user info
          const decoded = jwtDecode(storedToken) as { sub: string; email: string; fullName: string };
          setUser({
            id: decoded.sub,
            email: decoded.email,
            fullName: decoded.fullName,
          });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { access_token, user: userData } = response.data;
      
      localStorage.setItem('token', access_token);
      setToken(access_token);
      setUser(userData);
      
      toast({
        title: 'Login successful',
        description: 'Welcome back!',
      });
      
      navigate('/trips');
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        title: 'Login failed',
        description: 'Invalid email or password',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const register = async (email: string, password: string, fullName: string) => {
    try {
      await api.post('/auth/register', { email, password, fullName });
      
      toast({
        title: 'Registration successful',
        description: 'You can now log in with your credentials',
      });
      
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      toast({
        title: 'Registration failed',
        description: 'Could not create your account. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
