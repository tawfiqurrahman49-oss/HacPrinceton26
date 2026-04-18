import { createContext, useState, useEffect, ReactNode } from 'react';
import { api, User } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, captchaToken: string) => Promise<void>;
  register: (email: string, password: string, role: 'investor' | 'startup', captchaToken: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const userData = await api.getMe();
          setUser(userData);
        } catch (error) {
          console.error('Auth init failed:', error);
          api.clearToken();
          // Fallback to demo user for preview
          const demoUser: User = {
            id: 999,
            email: 'demo@example.com',
            role: 'startup',
            is_active: true,
            created_at: new Date().toISOString()
          };
          setUser(demoUser);
        }
      } else {
        // Create demo user for preview when no token exists
        const demoUser: User = {
          id: 999,
          email: 'demo@example.com',
          role: 'startup',
          is_active: true,
          created_at: new Date().toISOString()
        };
        setUser(demoUser);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string, captchaToken: string) => {
    await api.login(email, password, captchaToken);
    const userData = await api.getMe();
    setUser(userData);
  };

  const register = async (email: string, password: string, role: 'investor' | 'startup', captchaToken: string) => {
    await api.register(email, password, role, captchaToken);
    await login(email, password, captchaToken);
  };

  const logout = () => {
    api.clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
