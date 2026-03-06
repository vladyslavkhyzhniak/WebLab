import type { User } from '../types/User';

export function Navbar() {
  const currentUser: User = {
    id: 'user-1',
    imie: 'test1',
    nazwisko: 'test',
    email: 'test@example.com'
  };

  return (
    <header className="bg-white shadow-sm px-6 py-4 mb-8">
      <div className="max-w-3xl mx-auto flex justify-between items-center">
        <span className="font-extrabold text-2xl text-blue-600">
          ManageMe
        </span>
        <div className="text-gray-600 text-sm">
          Zalogowany jako:{' '}
          <span className="font-semibold text-gray-800">
            {currentUser.imie} {currentUser.nazwisko}
          </span>
        </div>
      </div>
    </header>
  );
}