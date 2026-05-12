import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../contexts/AuthContext';

export function LoginPage() {
  const { login } = useAuth();
  
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  const handleSuccess = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      const decoded: any = jwtDecode(credentialResponse.credential);
      
      await login({
        email: decoded.email,
        imie: decoded.given_name || decoded.name || 'Użytkownik',
        nazwisko: decoded.family_name || ''
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-10 text-center border border-gray-200 dark:border-gray-700">
        <h1 className="text-5xl font-extrabold text-blue-600 dark:text-blue-400 mb-3 tracking-tight">ManageMe</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-10 text-lg font-medium">Zaloguj się, aby kontynuować</p>
        
        {clientId ? (
          <GoogleOAuthProvider clientId={clientId}>
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => console.error('Błąd logowania')}
                theme="filled_blue"
                shape="rectangular"
                text="signin_with"
              />
            </div>
          </GoogleOAuthProvider>
        ) : (
          <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800 font-medium text-sm">
            Brak zmiennej <strong>VITE_GOOGLE_CLIENT_ID</strong> w pliku .env!
          </div>
        )}
      </div>
    </div>
  );
}