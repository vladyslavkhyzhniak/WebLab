import { useAuth } from '../contexts/AuthContext';

export function GuestPage() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-10 text-center">
        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">Oczekiwanie na zatwierdzenie</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Twoje konto zostało utworzone i posiada status <strong>Gość</strong>. Administrator musi przypisać Ci odpowiednią rolę, abyś mógł korzystać z systemu.
        </p>
        <button onClick={logout} className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
          Wyloguj się
        </button>
      </div>
    </div>
  );
}