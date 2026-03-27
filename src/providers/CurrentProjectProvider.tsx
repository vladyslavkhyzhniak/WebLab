import { CurrentProjectContext } from '../contexts/CurrentProjectContext';
import { useCurrentProject } from '../hooks/useCurrentProject';

interface CurrentProjectProviderProps {
  children: React.ReactNode;
}

export function CurrentProjectProvider({ children }: CurrentProjectProviderProps) {
  const { currentProjectId, setCurrentProject, isLoading } = useCurrentProject();

  return (
    <CurrentProjectContext.Provider value={{ currentProjectId, setCurrentProject, isLoading }}>
      {children}
    </CurrentProjectContext.Provider>
  );
}
