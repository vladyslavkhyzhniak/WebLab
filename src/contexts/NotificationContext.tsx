import { createContext, useContext, useEffect, useState, useRef } from 'react';
import type { ReactNode } from 'react';
import { NotificationApi } from '../api/NotificationApi';
import type { Notification } from '../types/Notification';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  toastNotification: Notification | null;
  sendNotification: (data: Omit<Notification, 'id' | 'dataUtworzenia' | 'przeczytana'>) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  closeToast: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toastNotification, setToastNotification] = useState<Notification | null>(null);
  
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;
    const data = await NotificationApi.getByUser(user.id);
    setNotifications(data);
  };

  const sendNotification = async (data: Omit<Notification, 'id' | 'dataUtworzenia' | 'przeczytana'>) => {
    const newNotification = await NotificationApi.create(data);
    if (!user) return;
    if (newNotification.odbiorcaId === user.id) {
      setNotifications(prev => [newNotification, ...prev]);

      if (newNotification.priorytet === 'średni' || newNotification.priorytet === 'wysoki') {
        setToastNotification(newNotification);
        
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => {
          setToastNotification(null);
        }, 5000);
      }
    }
  };

  const markAsRead = async (id: string) => {
    await NotificationApi.markAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, przeczytana: true } : n));
  };

  const closeToast = () => {
    setToastNotification(null);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const unreadCount = notifications.filter(n => !n.przeczytana).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      toastNotification,
      sendNotification,
      markAsRead,
      closeToast
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification musi być użyte wewnątrz NotificationProvider');
  }
  return context;
};