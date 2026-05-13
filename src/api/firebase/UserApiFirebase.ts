import { collection, getDocs, doc, setDoc, updateDoc, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { User } from '../../types/User';

const COLLECTION_NAME = 'users';
const usersRef = collection(db, COLLECTION_NAME);

export const UserApiFirebase = {
  async getAll(): Promise<User[]> {
    const snapshot = await getDocs(usersRef);
    return snapshot.docs.map(doc => doc.data() as User);
  },

  async getByEmail(email: string): Promise<User | undefined> {
    const q = query(usersRef, where("email", "==", email));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return undefined;
    return snapshot.docs[0].data() as User;
  },

  async create(user: User): Promise<void> {
    await setDoc(doc(db, COLLECTION_NAME, user.id), user);
  },

  async update(id: string, updates: Partial<User>): Promise<void> {
    const userDocRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(userDocRef, updates);
  }
};