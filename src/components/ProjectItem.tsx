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
    <li className={`bg-white border p-5 rounded-lg shadow-sm transition-all ${
      isSelected ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50/30' : 'border-gray-200 hover:shadow-md'
    }`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-bold text-gray-800">
          {project.nazwa}
          {isSelected && <span className="ml-2 text-xs font-semibold text-blue-600 uppercase">Aktywny</span>}
        </h3>
      </div>
      
      <p className="text-gray-600 mb-4 whitespace-pre-wrap">{project.opis}</p>
      
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <div className="flex gap-2">
          <button 
            onClick={() => onEdit(project)}
            className="px-3 py-1.5 text-sm bg-indigo-50 text-indigo-600 font-medium rounded hover:bg-indigo-100 transition-colors"
          >
            Edytuj
          </button>
          <button 
            onClick={() => onDelete(project.id)} 
            className="px-3 py-1.5 text-sm bg-red-50 text-red-600 font-medium rounded hover:bg-red-100 transition-colors"
          >
            Usuń
          </button>
        </div>
        
        {/* Кнопка выбора/отмены */}
        <button 
          onClick={() => onSelect(project.id)}
          className={`px-4 py-1.5 text-sm font-medium rounded transition-colors ${
            isSelected 
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isSelected ? 'Odznacz' : 'Wybierz'}
        </button>
      </div>
    </li>
  );
}