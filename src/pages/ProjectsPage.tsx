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
    <div className="max-w-7xl mx-auto p-6 mt-10 flex flex-col lg:flex-row gap-8">
      
      {/* ЛЕВАЯ КОЛОНКА: Форма и список проектов */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            {editingProject ? 'Edytuj projekt' : 'Dodaj nowy projekt'}
          </h2>
          <ProjectForm 
            onSubmit={handleFormSubmit} 
            initialData={editingProject} 
            onCancel={() => setEditingProject(null)} 
          />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Twoje projekty</h2>
          
          {loading ? (
            <div className="flex justify-center p-8">
              <p className="text-gray-500 animate-pulse">Ładowanie...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
              Brak projektów
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

      {/* ПРАВАЯ КОЛОНКА: Детали проекта */}
      <div className="w-full lg:w-2/3">
        {currentProjectId ? (
          <ProjectView project={activeProject} />
        ) : (
          <div className="bg-white p-10 rounded-lg shadow-sm border border-gray-200 h-full flex flex-col items-center justify-center text-center">
            <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-xl font-medium text-gray-600">Wybierz projekt</h3>
            <p className="text-gray-400 mt-2">Wybierz projekt z listy po lewej stronie, aby zobaczyć jego szczegóły i historyjki.</p>
          </div>
        )}
      </div>

    </div>
  );
}