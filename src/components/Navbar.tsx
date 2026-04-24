import { useAuth } from '../contexts/AuthContext';

export function Navbar() {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm px-6 py-4 mb-8">
      <div className="max-w-3xl mx-auto flex justify-between items-center">
        <span className="font-extrabold text-2xl text-blue-600">
          ManageMe
        </span>
        <div className="text-gray-600 text-sm">
          Zalogowany jako:{' '}
          <span className="font-semibold text-gray-800">
            {user.imie} {user.nazwisko} <span className="text-blue-500"></span>
          </span>
        </div>
      </div>
    </header>
  );
}