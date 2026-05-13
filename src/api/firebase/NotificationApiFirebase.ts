import { collection, getDocs, doc, setDoc, updateDoc, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { Notification } from '../../types/Notification';

const COLLECTION_NAME = 'notifications';
const notificationsRef = collection(db, COLLECTION_NAME);

export const NotificationApiFirebase = {
  async getAll(): Promise<Notification[]> {
    const snapshot = await getDocs(notificationsRef);
    return snapshot.docs.map(doc => doc.data() as Notification);
  },

  async getByUser(userId: string): Promise<Notification[]> {
    const q = query(notificationsRef, where("odbiorcaId", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Notification);
  },

  async create(notification: Omit<Notification, 'id' | 'dataUtworzenia' | 'przeczytana'>): Promise<Notification> {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      dataUtworzenia: new Date().toISOString(),
      przeczytana: false
    };
    await setDoc(doc(db, COLLECTION_NAME, newNotification.id), newNotification);
    return newNotification;
  },

  async markAsRead(id: string): Promise<Notification | null> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, { przeczytana: true });
    
    const all = await this.getAll();
    return all.find(n => n.id === id) || null;
  }
};