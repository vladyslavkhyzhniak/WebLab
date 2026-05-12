import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNotification } from '../contexts/NotificationContext';

export function Navbar({ onViewChange }: { onViewChange?: (view: 'projects' | 'notifications' | 'users') => void }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { unreadCount } = useNotification();
  if (!user) return null;

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm px-6 sm:px-10 py-5 border-b dark:border-gray-700 transition-colors duration-200">
      <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4">
        
        <div className="flex items-center gap-6">
          <button 
            onClick={() => onViewChange?.('projects')}
            className="font-extrabold text-3xl tracking-tight text-blue-600 dark:text-blue-400 hover:opacity-80 transition-opacity"
          >
            ManageMe
          </button>
          
          {user.rola === 'admin' && (
            <button 
              onClick={() => onViewChange?.('users')}
              className="text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              👥 Użytkownicy
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-6 text-base">
          <div className="text-gray-600 dark:text-gray-300">
            Zalogowany jako:{' '}
            <span className="font-bold text-gray-800 dark:text-gray-100 text-lg ml-1">
              {user.imie} {user.nazwisko} <span className="text-blue-500 dark:text-blue-400 text-base font-medium">({user.rola})</span>
            </span>
          </div>
          
          <div className="flex items-center gap-3">
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

            <button
              onClick={logout}
              className="p-3 rounded-xl text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
              title="Wyloguj się"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}