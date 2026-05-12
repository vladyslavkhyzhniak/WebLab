import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../types/User';

export function UserPage() {
  const { users, user: currentUser, updateUserRole, toggleUserBlock } = useAuth();

  const handleRoleChange = (id: string, newRole: UserRole) => {
    updateUserRole(id, newRole);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100">
          Zarządzanie użytkownikami
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Zmieniaj role i zarządzaj dostępem pracowników do systemu.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-xs uppercase font-bold tracking-wider">
                <th className="p-4">Użytkownik</th>
                <th className="p-4">Email</th>
                <th className="p-4">Rola</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Akcje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-gray-800 dark:text-gray-100">
                      {u.imie} {u.nazwisko}
                      {u.id === currentUser?.id && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-2 py-0.5 rounded-full">Ty</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-400 text-sm">{u.email}</td>
                  <td className="p-4">
                    <select
                      value={u.rola}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                      disabled={u.id === currentUser?.id} 
                      className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 disabled:opacity-50"
                    >
                      <option value="gość">Gość</option>
                      <option value="developer">Developer</option>
                      <option value="devops">DevOps</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="p-4">
                    {u.czyZablokowany ? (
                      <span className="bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 text-xs font-bold px-3 py-1 rounded-full uppercase">Zablokowany</span>
                    ) : (
                      <span className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 text-xs font-bold px-3 py-1 rounded-full uppercase">Aktywny</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => toggleUserBlock(u.id)}
                      disabled={u.id === currentUser?.id} 
                      className={`text-sm font-bold px-4 py-2 rounded-lg transition-colors disabled:opacity-30 ${
                        u.czyZablokowany 
                          ? 'bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/40' 
                          : 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40'
                      }`}
                    >
                      {u.czyZablokowany ? 'Odblokuj' : 'Zablokuj'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}