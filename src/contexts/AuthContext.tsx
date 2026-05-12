import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, UserRole } from '../types/User';
import { UserApi } from '../api/UserApi';
import { NotificationApi } from '../api/NotificationApi';

interface AuthContextType {
  user: User | null;
  users: User[]; 
  login: (googleData: { email: string; imie: string; nazwisko: string }) => Promise<void>;
  logout: () => void;
  updateUserRole: (userId: string, newRole: UserRole) => void;
  toggleUserBlock: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  const refreshUsers = () => {
    setUsers(UserApi.getAll());
  };

  useEffect(() => {
    refreshUsers();
  }, []);

  const login = async (googleData: { email: string; imie: string; nazwisko: string }) => {
    let existingUser = UserApi.getByEmail(googleData.email);
    const superAdminEmail = import.meta.env.VITE_SUPER_ADMIN_EMAIL;

    if (!existingUser) {
      const isSuperAdmin = googleData.email === superAdminEmail;
      
      const newUser: User = {
        id: crypto.randomUUID(),
        email: googleData.email,
        imie: googleData.imie,
        nazwisko: googleData.nazwisko,
        rola: isSuperAdmin ? 'admin' : 'guest',
        czyZablokowany: false
      };

      UserApi.create(newUser);
      existingUser = newUser;

      if (!isSuperAdmin) {
        const admins = UserApi.getAll().filter(u => u.rola === 'admin');
        for (const admin of admins) {
          await NotificationApi.create({
            tytul: 'Nowe konto w systemie',
            tresc: `Użytkownik ${newUser.imie} ${newUser.nazwisko} zarejestrował się i oczekuje na rolę.`,
            priorytet: 'wysoki',
            odbiorcaId: admin.id
          });
        }
      }
    }

    setUser(existingUser);
    refreshUsers();
  };

  const logout = () => {
    setUser(null);
  };

  const updateUserRole = (userId: string, newRole: UserRole) => {
    UserApi.update(userId, { rola: newRole });
    refreshUsers();
  };

  const toggleUserBlock = (userId: string) => {
    const u = users.find(u => u.id === userId);
    if (u) {
      UserApi.update(userId, { czyZablokowany: !u.czyZablokowany });
      refreshUsers();
    }
  };

  return (
    <AuthContext.Provider value={{ user, users, login, logout, updateUserRole, toggleUserBlock }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth musi być użyte wewnątrz AuthProvider');
  return context;
};