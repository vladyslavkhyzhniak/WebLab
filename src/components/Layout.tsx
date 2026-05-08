import { Navbar } from './Navbar';
import {NotificationToast} from './NotificationToast';

interface LayoutProps {
  children: React.ReactNode;
  onViewChange?: (view: 'projects' | 'notifications') => void;
}

export function Layout({ children, onViewChange }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Navbar onViewChange={onViewChange} />
      <main>
        {children}
        <NotificationToast />
      </main>
    </div>
  );
}