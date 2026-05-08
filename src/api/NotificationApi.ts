import type { Notification } from '../types/Notification';

const STORAGE_KEY = 'notifications';

export const NotificationApi = {

  async getAll(): Promise<Notification[]> {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  async create(notification: Omit<Notification, 'id' | 'dataUtworzenia' | 'przeczytana'>): Promise<Notification> {
    const notifications = await this.getAll();
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      dataUtworzenia: new Date().toISOString(),
      przeczytana: false
    };
    notifications.push(newNotification);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    return newNotification;
  },

  async markAsRead(id: string): Promise<Notification | null> {
    const notifications = await this.getAll();
    const notification = notifications.find(n => n.id === id);
    if (notification) {
      notification.przeczytana = true;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    }
    return notification || null;
  },
  
  async getByUser(userId: string): Promise<Notification[]> {
    const notifications = await this.getAll();
    return notifications.filter(n => n.odbiorcaId === userId);
  }

};