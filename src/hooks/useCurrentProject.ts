import { useEffect, useState } from 'react';
import { ProjectApi } from '../api/ProjectApi';

export function useCurrentProject() {
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCurrent = async () => {
      setIsLoading(true);
      const projectId = await ProjectApi.getCurrent();
      setCurrentProjectId(projectId);
      setIsLoading(false);
    };
    fetchCurrent();
  }, []);

  const setCurrentProject = async (id: string | null) => {
    await ProjectApi.setCurrent(id);
    setCurrentProjectId(id);
  };

  return { currentProjectId, setCurrentProject, isLoading };
}
