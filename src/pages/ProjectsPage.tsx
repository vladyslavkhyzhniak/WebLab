import { useEffect, useState } from 'react';
import type { Project } from '../types/Project';
import { ProjectApi } from '../api/ProjectApi';
import { ProjectForm } from '../components/ProjectForm';
import { ProjectItem } from '../components/ProjectItem';
import { useCurrentProjectContext } from '../contexts/CurrentProjectContext';
import { ProjectView } from '../components/ProjectView'; 

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const { currentProjectId, setCurrentProject } = useCurrentProjectContext();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const data = await ProjectApi.getAll();
    setProjects(data);
    setLoading(false);
  };

  const handleFormSubmit = async (data: { nazwa: string; opis: string }) => {
    if (editingProject) {
      await ProjectApi.update(editingProject.id, data);
      setEditingProject(null);
    } else {
      await ProjectApi.create(data);
    }
    fetchProjects();
  };

  const handleDelete = async (id: string) => {
    await ProjectApi.delete(id);
    if (id === currentProjectId) {
      setCurrentProject(null);
    }
    fetchProjects();
  };

  const handleSelect = async (id: string) => {
    if (currentProjectId === id) {
      await setCurrentProject(null);
    } else {
      await setCurrentProject(id);
    }
  };

  const activeProject = projects.find(p => p.id === currentProjectId);

  return (
    <div className="w-full px-6 sm:px-10 mt-6 sm:mt-10 flex flex-col lg:flex-row gap-8 pb-10">
      
      <div className="w-full lg:w-1/3 xl:w-1/4 flex flex-col gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border dark:border-gray-700 transition-colors">
          <h2 className="text-xl font-bold mb-5 text-gray-800 dark:text-gray-100">
            {editingProject ? 'Edytuj projekt' : 'Dodaj nowy projekt'}
          </h2>
          <ProjectForm 
            onSubmit={handleFormSubmit} 
            initialData={editingProject} 
            onCancel={() => setEditingProject(null)} 
          />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-5 text-gray-800 dark:text-gray-100">Twoje projekty</h2>
          
          {loading ? (
            <div className="flex justify-center p-8 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 shadow-sm">
              <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">Ładowanie projektów...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-800/50 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center text-gray-500 dark:text-gray-400 font-medium">
              Brak projektów. Dodaj swój pierwszy!
            </div>
          ) : (
            <ul className="space-y-4">
              {projects.map((project) => (
                <ProjectItem 
                  key={project.id} 
                  project={project} 
                  onEdit={setEditingProject} 
                  onDelete={handleDelete}
                  onSelect={handleSelect}
                  isSelected={project.id === currentProjectId}
                />
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="w-full lg:w-2/3 xl:w-3/4">
        {currentProjectId ? (
          <ProjectView project={activeProject} />
        ) : (
          <div className="bg-white dark:bg-gray-800 p-12 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 h-full flex flex-col items-center justify-center text-center transition-colors min-h-[400px]">
            <svg className="w-20 h-20 text-gray-300 dark:text-gray-600 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-300">Brak wybranego projektu</h3>
            <p className="text-gray-400 dark:text-gray-500 mt-3 text-lg">Wybierz projekt z listy po lewej stronie, aby zobaczyć i zarządzać jego historyjkami.</p>
          </div>
        )}
      </div>

    </div>
  );
}