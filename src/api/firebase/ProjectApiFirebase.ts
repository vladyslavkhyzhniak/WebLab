import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { Project } from '../../types/Project';

const COLLECTION_NAME = 'projects';
const CURRENT_PROJECT_KEY = 'currentProjectId';
const projectsRef = collection(db, COLLECTION_NAME);

export const ProjectApiFirebase = {
  async getAll(): Promise<Project[]> {
    const snapshot = await getDocs(projectsRef);
    return snapshot.docs.map(doc => doc.data() as Project);
  },

  async getById(id: string): Promise<Project | null> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? (snapshot.data() as Project) : null;
  },

  async create(project: Omit<Project, 'id'>): Promise<Project> {
    const newProject: Project = { 
      ...project, 
      id: crypto.randomUUID() 
    };
    await setDoc(doc(db, COLLECTION_NAME, newProject.id), newProject);
    return newProject;
  },

  async update(id: string, updatedData: Partial<Project>): Promise<Project | null> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, updatedData);
    
    const updatedSnap = await getDoc(docRef);
    return updatedSnap.exists() ? (updatedSnap.data() as Project) : null;
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    
    const current = await this.getCurrent();
    if (current === id) {
      await this.setCurrent(null);
    }
  },

  async setCurrent(id: string | null): Promise<void> {
    if (id) {
      localStorage.setItem(CURRENT_PROJECT_KEY, id);
    } else {
      localStorage.removeItem(CURRENT_PROJECT_KEY);
    }
  },

  async getCurrent(): Promise<string | null> {
    return localStorage.getItem(CURRENT_PROJECT_KEY);
  }
};