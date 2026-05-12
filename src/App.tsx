import { useState } from 'react';
import { CurrentProjectProvider } from './providers/CurrentProjectProvider';
import { useCurrentProjectContext } from './contexts/CurrentProjectContext';
import { Layout } from './components/Layout';
import { ProjectsPage } from './pages/ProjectsPage';
import { NotificationsPage } from './pages/NotificationPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { UserPage } from './pages/UserPage';

import { LoginPage } from './pages/LoginPage';
import { GuestPage } from './pages/GuestPage';
import { BlockedPage } from './pages/BlockedPage';

function AppContent() {
  const { isLoading } = useCurrentProjectContext();
  const [currentView, setCurrentView] = useState<'projects' | 'notifications' | 'users'>('projects');

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen dark:text-white">Loading...</div>;
  }

  return (
    <Layout onViewChange={setCurrentView}>
      {currentView === 'projects' && <ProjectsPage />}
      {currentView === 'notifications' && <NotificationsPage />}
      {currentView === 'users' && <UserPage />}
    </Layout>
  );
}

function AppRouter() {
  const { user } = useAuth();

  if (!user) {
    return <LoginPage />;
  }

  if (user.czyZablokowany) {
    return <BlockedPage />;
  }
  if (user.rola === 'guest') {
    return <GuestPage />;
  }
  return (
    <NotificationProvider>
      <CurrentProjectProvider>
        <AppContent />
      </CurrentProjectProvider>
    </NotificationProvider>
  );
}

function App() {  
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;