import type { Project } from '../types/Project';
import { StoryBoard } from './StoryBoard';

interface ProjectViewProps {
  project?: Project;
}

export function ProjectView({ project }: ProjectViewProps) {
  if (!project) {
    return (
      <div className="bg-white p-10 rounded-lg shadow-sm border border-gray-200 h-full flex flex-col items-center justify-center text-center">
        <p className="text-gray-500 font-medium">Proszę wybrać projekt z listy po lewej stronie.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
      <div className="border-b border-gray-200 pb-4 mb-2">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{project.nazwa}</h1>
            <p className="text-gray-500 mt-1 text-sm">{project.opis}</p>
          </div>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full uppercase">
            Aktywny projekt
          </span>
        </div>
      </div>
      <StoryBoard projectId={project.id} />
    </div>
  );
}