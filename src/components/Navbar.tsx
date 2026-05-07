import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export function Navbar() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm px-6 sm:px-10 py-5 border-b dark:border-gray-700 transition-colors duration-200">
      <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4">
        
        <span className="font-extrabold text-3xl tracking-tight text-blue-600 dark:text-blue-400">
          ManageMe
        </span>
        
        <div className="flex items-center gap-6 text-base">
          <div className="text-gray-600 dark:text-gray-300">
            Zalogowany jako:{' '}
            <span className="font-bold text-gray-800 dark:text-gray-100 text-lg ml-1">
              {user.imie} {user.nazwisko} <span className="text-blue-500 dark:text-blue-400 text-base font-medium">({user.rola})</span>
            </span>
          </div>
          
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