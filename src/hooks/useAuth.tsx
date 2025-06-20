import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data pour la démo avec des UUIDs valides et les vrais noms
const MOCK_USERS: User[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    email: 'admin@premunia.fr',
    name: 'Hamdi Mekni',
    role: 'admin'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    email: 'manager@premunia.fr',
    name: 'Marie Leblanc',
    role: 'manager'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    email: 'commercial1@premunia.fr',
    name: 'Snoussi Zouhair',
    role: 'commercial'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    email: 'commercial2@premunia.fr',
    name: 'Dahmani Mouna',
    role: 'commercial'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    email: 'commercial3@premunia.fr',
    name: 'Maatoug Radhia',
    role: 'commercial'
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier la session existante
    const savedUser = localStorage.getItem('premunia_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Authentification mock - dans une vraie app, ce serait Supabase
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
