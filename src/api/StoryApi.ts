import type { Story, StoryStatus } from '../types/Story';

const STORAGE_KEY = 'mock_stories';

const getStoriesFromStorage = (): Story[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const saveToStorage = (stories: Story[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
};

export const StoryApi = {
  getByProject: async (projectId: string): Promise<Story[]> => {
    return getStoriesFromStorage().filter(s => s.projektId === projectId);
  },

  create: async (storyData: Omit<Story, 'id' | 'dataUtworzenia'>): Promise<Story> => {
    const stories = getStoriesFromStorage();
    const newStory: Story = {
      ...storyData,
      id: crypto.randomUUID(),
      dataUtworzenia: new Date().toISOString(),
    };
    stories.push(newStory);
    saveToStorage(stories);
    return newStory;
  },

  updateStatus: async (id: string, newStatus: StoryStatus): Promise<Story> => {
    const stories = getStoriesFromStorage();
    const index = stories.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Story not found');
    
    stories[index].stan = newStatus;
    saveToStorage(stories);
    return stories[index];
  },

  delete: async (id: string): Promise<void> => {
    let stories = getStoriesFromStorage();
    stories = stories.filter(s => s.id !== id);
    saveToStorage(stories);
  }
};