import type { User } from '../../types/User';

const STORAGE_KEY = 'system_users';

export const UserApiLocal = {
  async getAll(): Promise<User[]> {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  async getByEmail(email: string): Promise<User | undefined> {
    const users = await this.getAll();
    return users.find(u => u.email === email);
  },

  async create(user: User): Promise<void> {
    const users = await this.getAll();
    users.push(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  },

  async update(id: string, updates: Partial<User>): Promise<void> {
    const users = await this.getAll();
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }
  }
};