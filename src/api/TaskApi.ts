import type { Task } from '../types/Task';

const STORAGE_KEY = 'mock_tasks';

const getTasksFromStorage = (): Task[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const saveToStorage = (tasks: Task[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

export const TaskApi = {
  getByStory: async (storyId: string): Promise<Task[]> => {
    return getTasksFromStorage().filter(t => t.historyjkaId === storyId);
  },

  create: async (taskData: Omit<Task, 'id' | 'dataDodania' | 'stan'>): Promise<Task> => {
    const tasks = getTasksFromStorage();
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      dataDodania: new Date().toISOString(),
      stan: 'todo',
    };
    tasks.push(newTask);
    saveToStorage(tasks);
    return newTask;
  },

  update: async (id: string, updates: Partial<Task>): Promise<Task> => {
    const tasks = getTasksFromStorage();
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');
    
    tasks[index] = { ...tasks[index], ...updates };
    saveToStorage(tasks);
    return tasks[index];
  },

  delete: async (id: string): Promise<void> => {
    let tasks = getTasksFromStorage();
    tasks = tasks.filter(t => t.id !== id);
    saveToStorage(tasks);
  }
};