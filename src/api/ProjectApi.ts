import type { Project } from '../types/Project';

const STORAGE_KEY = 'projects';

export const ProjectApi = {

  async getAll(): Promise<Project[]> {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },


  async create(project: Omit<Project, 'id'>): Promise<Project> {
    const projects = await this.getAll();
    
    const newProject: Project = { 
      ...project, 
      id: crypto.randomUUID() 
    };
    
    projects.push(newProject);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    
    return newProject;
  },


  async update(id: string, updatedData: Partial<Project>): Promise<Project | null> {
    const projects = await this.getAll();
    const index = projects.findIndex(p => p.id === id);
    
    if (index === -1) return null;
    
    projects[index] = { ...projects[index], ...updatedData };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    
    return projects[index];
  },

  async delete(id: string): Promise<void> {
    const projects = await this.getAll();
    const filteredProjects = projects.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredProjects));
  }
};