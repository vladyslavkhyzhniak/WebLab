import { CurrentProjectProvider } from './providers/CurrentProjectProvider';
import { useCurrentProjectContext } from './contexts/CurrentProjectContext';
import { Layout } from './components/Layout';
import { ProjectsPage } from './pages/ProjectsPage';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { NotificationsPage } from './pages/NotificationPage';
import { useState } from 'react';

function AppContent() {
  const { isLoading } = useCurrentProjectContext();
  const [currentView, setCurrentView] = useState<'projects' | 'notifications'>('projects');

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen dark:text-white">Loading...</div>;
  }

  return (
    <Layout onViewChange={setCurrentView}>
      {currentView === 'projects' ? <ProjectsPage /> : <NotificationsPage />}
    </Layout>
  );
}

function App() {  
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <CurrentProjectProvider>
            <AppContent />
          </CurrentProjectProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;