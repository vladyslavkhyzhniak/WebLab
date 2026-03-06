import type { Project } from '../types/Project';

interface ProjectItemProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

export function ProjectItem({ project, onEdit, onDelete }: ProjectItemProps) {
  return (
    <li className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-xl font-bold text-gray-800 mb-2">{project.nazwa}</h3>
      <p className="text-gray-600 mb-4 whitespace-pre-wrap">{project.opis}</p>
      <div className="flex gap-3">
        <button 
          onClick={() => onEdit(project)}
          className="px-4 py-1.5 text-sm bg-indigo-50 text-indigo-600 font-medium rounded hover:bg-indigo-100 transition-colors"
        >
          Edytuj
        </button>
        <button 
          onClick={() => onDelete(project.id)} 
          className="px-4 py-1.5 text-sm bg-red-50 text-red-600 font-medium rounded hover:bg-red-100 transition-colors"
        >
          Usuń
        </button>
      </div>
    </li>
  );
}