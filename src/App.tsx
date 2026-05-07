import { CurrentProjectProvider } from './providers/CurrentProjectProvider';
import { useCurrentProjectContext } from './contexts/CurrentProjectContext';
import { Layout } from './components/Layout';
import { ProjectsPage } from './pages/ProjectsPage';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

function AppContent() {
  const { isLoading } = useCurrentProjectContext();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <Layout>
      <ProjectsPage />
    </Layout>
  );
}

function App() {  
  return (
    <ThemeProvider>
    <AuthProvider>
    <CurrentProjectProvider>
      <AppContent />
    </CurrentProjectProvider>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;