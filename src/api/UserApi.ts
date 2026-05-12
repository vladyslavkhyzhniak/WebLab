import type { User } from '../types/User';

const STORAGE_KEY = 'system_users';

export const UserApi = {
  getAll: (): User[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  getByEmail: (email: string): User | undefined => {
    return UserApi.getAll().find(u => u.email === email);
  },

  create: (user: User): void => {
    const users = UserApi.getAll();
    users.push(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  },

  update: (id: string, updates: Partial<User>): void => {
    const users = UserApi.getAll();
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }
  }
};