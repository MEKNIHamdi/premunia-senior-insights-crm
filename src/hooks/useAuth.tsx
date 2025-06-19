
import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demo
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'admin@premunia.fr',
    name: 'Jean Dupont',
    role: 'admin'
  },
  {
    id: '2',
    email: 'manager@premunia.fr',
    name: 'Marie Leblanc',
    role: 'manager'
  },
  {
    id: '3',
    email: 'commercial@premunia.fr',
    name: 'Pierre Martin',
    role: 'commercial'
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('premunia_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Mock authentication - in real app, this would be Supabase
    const mockUser = MOCK_USERS.find(u => u.email === email);
    if (mockUser && password === 'demo123') {
      setUser(mockUser);
      localStorage.setItem('premunia_user', JSON.stringify(mockUser));
    } else {
      throw new Error('Identifiants incorrects');
    }
    
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('premunia_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
