import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, query, where, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { Task } from '../../types/Task';

const COLLECTION_NAME = 'tasks';
const tasksRef = collection(db, COLLECTION_NAME);

export const TaskApiFirebase = {
  getByStory: async (storyId: string): Promise<Task[]> => {
    const q = query(tasksRef, where("historyjkaId", "==", storyId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Task);
  },

  create: async (taskData: Omit<Task, 'id' | 'dataDodania' | 'stan'>): Promise<Task> => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      dataDodania: new Date().toISOString(),
      stan: 'todo',
    };
    await setDoc(doc(db, COLLECTION_NAME, newTask.id), newTask);
    return newTask;
  },

  update: async (id: string, updates: Partial<Task>): Promise<Task> => {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, updates);
    
    const updatedSnap = await getDoc(docRef);
    if (!updatedSnap.exists()) throw new Error('Task not found');
    return updatedSnap.data() as Task;
  },

  delete: async (id: string): Promise<void> => {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  }
};