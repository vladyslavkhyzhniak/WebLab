import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, query, where, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { Story, StoryStatus } from '../../types/Story';

const COLLECTION_NAME = 'stories';
const storiesRef = collection(db, COLLECTION_NAME);

export const StoryApiFirebase = {
  getByProject: async (projectId: string): Promise<Story[]> => {
    const q = query(storiesRef, where("projektId", "==", projectId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Story);
  },

  getById: async (id: string): Promise<Story | undefined> => {
    const docRef = doc(db, COLLECTION_NAME, id);
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? (snapshot.data() as Story) : undefined;
  },

  create: async (storyData: Omit<Story, 'id' | 'dataUtworzenia'>): Promise<Story> => {
    const newStory: Story = {
      ...storyData,
      id: crypto.randomUUID(),
      dataUtworzenia: new Date().toISOString(),
    };
    await setDoc(doc(db, COLLECTION_NAME, newStory.id), newStory);
    return newStory;
  },

  updateStatus: async (id: string, newStatus: StoryStatus): Promise<Story> => {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, { stan: newStatus });
    
    const updatedSnap = await getDoc(docRef);
    if (!updatedSnap.exists()) throw new Error('Story not found');
    return updatedSnap.data() as Story;
  },

  delete: async (id: string): Promise<void> => {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  }
};