import { useAuth } from '../contexts/AuthContext';

export function BlockedPage() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-red-200 dark:border-red-900/50 p-10 text-center">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">Konto zablokowane</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Twój dostęp do aplikacji został zablokowany przez administratora. Skontaktuj się z obsługą, jeśli uważasz, że to błąd.
        </p>
        <button onClick={logout} className="text-red-600 dark:text-red-400 font-bold hover:underline">
          Wyloguj się
        </button>
      </div>
    </div>
  );
}