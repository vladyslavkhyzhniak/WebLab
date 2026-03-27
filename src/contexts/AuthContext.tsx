import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types/User';

const MOCK_CURRENT_USER: User = { 
  id: 'u-123', 
  imie: 'test1', 
  nazwisko: 'test',
  email: 'test@example.com'
};

interface AuthContextType {
  user: User;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <AuthContext.Provider value={{ user: MOCK_CURRENT_USER }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};