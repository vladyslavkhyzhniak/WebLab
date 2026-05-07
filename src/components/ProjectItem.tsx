import type { Project } from '../types/Project';

interface ProjectItemProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
  isSelected: boolean;
}

export function ProjectItem({ project, onEdit, onDelete, onSelect, isSelected }: ProjectItemProps) {
  return (
    <li className={`border p-6 rounded-xl shadow-sm transition-all ${
      isSelected 
        ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-50/40 dark:bg-blue-900/20' 
        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md'
    }`}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100 break-words">
          {project.nazwa}
          {isSelected && <span className="ml-3 align-middle text-xs font-bold text-blue-600 dark:text-blue-400 uppercase bg-blue-100 dark:bg-blue-900/40 px-2.5 py-1 rounded-md">Aktywny</span>}
        </h3>
      </div>
      
      <p className="text-base text-gray-600 dark:text-gray-400 mb-6 whitespace-pre-wrap">{project.opis}</p>
      
      <div className="flex flex-wrap gap-3 justify-between items-center border-t border-gray-100 dark:border-gray-700 pt-4">
        <div className="flex gap-3">
          <button 
            onClick={() => onEdit(project)}
            className="px-4 py-2 text-sm bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
          >
            Edytuj
          </button>
          <button 
            onClick={() => onDelete(project.id)} 
            className="px-4 py-2 text-sm bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-bold rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
          >
            Usuń
          </button>
        </div>
        
        <button 
          onClick={() => onSelect(project.id)}
          className={`px-6 py-2 text-sm font-bold rounded-lg transition-colors shadow-sm ${
            isSelected 
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600' 
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isSelected ? 'Odznacz' : 'Wybierz projekt'}
        </button>
      </div>
    </li>
  );
}