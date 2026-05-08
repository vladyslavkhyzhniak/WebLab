import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNotification } from '../contexts/NotificationContext';

export function Navbar({ onViewChange }: { onViewChange?: (view: 'projects' | 'notifications') => void }) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { unreadCount } = useNotification();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm px-6 sm:px-10 py-5 border-b dark:border-gray-700 transition-colors duration-200">
      <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4">
        
        <button 
          onClick={() => onViewChange?.('projects')}
          className="font-extrabold text-3xl tracking-tight text-blue-600 dark:text-blue-400 hover:opacity-80 transition-opacity"
        >
          ManageMe
        </button>
        
        <div className="flex items-center gap-6 text-base">
          <div className="text-gray-600 dark:text-gray-300">
            Zalogowany jako:{' '}
            <span className="font-bold text-gray-800 dark:text-gray-100 text-lg ml-1">
              {user.imie} {user.nazwisko} <span className="text-blue-500 dark:text-blue-400 text-base font-medium">({user.rola})</span>
            </span>
          </div>
          
          <button 
            onClick={() => onViewChange?.('notifications')}
            className="relative p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            🔔
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm border-2 border-white dark:border-gray-800">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={toggleTheme}
            className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-xl"
            title={theme === 'light' ? 'Włącz tryb ciemny' : 'Włącz tryb jasny'}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>

      </div>
    </header>
  );
}