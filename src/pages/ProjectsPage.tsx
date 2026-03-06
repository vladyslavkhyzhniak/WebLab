import { useEffect, useState } from 'react';
import type { Project } from '../types/Project';
import { ProjectApi } from '../api/ProjectApi.ts';
import { ProjectForm } from '../components/ProjectForm';
import { ProjectItem } from '../components/ProjectItem';

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

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
      fetchProjects();
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10">
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
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
            <p className="text-gray-500 animate-pulse">Ładowanie projektów...</p>
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
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}