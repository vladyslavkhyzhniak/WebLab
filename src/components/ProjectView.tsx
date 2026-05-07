import type { Project } from '../types/Project';
import { StoryBoard } from './StoryBoard';

interface ProjectViewProps {
  project?: Project;
}

export function ProjectView({ project }: ProjectViewProps) {
  if (!project) {
    return (
      <div className="bg-white dark:bg-gray-800 p-12 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 h-full flex flex-col items-center justify-center text-center transition-colors">
        <svg className="w-20 h-20 text-gray-300 dark:text-gray-600 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-300">Brak wybranego projektu</h3>
        <p className="text-gray-400 dark:text-gray-500 mt-3 text-lg">Wybierz projekt z listy po lewej stronie, aby zobaczyć i zarządzać jego historyjkami.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-md h-full flex flex-col transition-colors border border-transparent dark:border-gray-700">
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100">{project.nazwa}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-base">{project.opis}</p>
          </div>
          <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-sm font-bold px-4 py-1.5 rounded-lg uppercase tracking-wide">
            Aktywny projekt
          </span>
        </div>
      </div>
      <StoryBoard projectId={project.id} />
    </div>
  );
}