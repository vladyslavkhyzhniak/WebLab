import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types/User';

export const MOCK_USERS: User[] = [
  { id: 'u-1', imie: 'test1', nazwisko: 'TEST1', email: 'test1@example.com', rola: 'admin' },
  { id: 'u-2', imie: 'test2', nazwisko: 'TEST2', email: 'test2@example.com', rola: 'developer' },
  { id: 'u-3', imie: 'test3', nazwisko: 'TEST3', email: 'test3@example.com', rola: 'devops' }
];

interface AuthContextType {
  user: User;
  users: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <AuthContext.Provider value={{ user: MOCK_USERS[0], users: MOCK_USERS }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};