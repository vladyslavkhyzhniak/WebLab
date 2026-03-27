import { createContext, useContext } from 'react';

interface CurrentProjectContextType {
  currentProjectId: string | null;
  setCurrentProject: (id: string | null) => Promise<void>;
  isLoading: boolean;
}

export const CurrentProjectContext = createContext<CurrentProjectContextType | undefined>(undefined);

export function useCurrentProjectContext() {
  const context = useContext(CurrentProjectContext);
  if (!context) {
    throw new Error('useCurrentProjectContext must be used within a CurrentProjectProvider');
  }
  return context;
}
