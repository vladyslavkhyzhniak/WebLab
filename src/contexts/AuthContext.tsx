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
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('manageme_session');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [users, setUsers] = useState<User[]>([]);

  const refreshUsers = async () => {
    setUsers(await UserApi.getAll());
  };

  useEffect(() => {
    refreshUsers();
  }, []);

  const login = async (googleData: { email: string; imie: string; nazwisko: string }) => {
    let existingUser = await UserApi.getByEmail(googleData.email);
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

      await UserApi.create(newUser);
      existingUser = newUser;

      if (!isSuperAdmin) {
        const admins = (await UserApi.getAll()).filter(u => u.rola === 'admin');
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
    localStorage.setItem('manageme_session', JSON.stringify(existingUser)); 
    await refreshUsers();
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('manageme_session');
  };

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    await UserApi.update(userId, { rola: newRole });
    await refreshUsers();
  };

  const toggleUserBlock = async (userId: string) => {
    const u = users.find(u => u.id === userId);
    if (u) {
      await UserApi.update(userId, { czyZablokowany: !u.czyZablokowany });
      await refreshUsers();
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