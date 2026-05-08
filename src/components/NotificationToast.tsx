import { useNotification } from '../contexts/NotificationContext';

export function NotificationToast() {
  const { toastNotification, closeToast } = useNotification();

  if (!toastNotification) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-fade-in-up">
      <div className="bg-white dark:bg-gray-800 border-l-4 border-blue-500 dark:border-blue-400 rounded-lg shadow-xl p-4 flex flex-col gap-2">
        <div className="flex justify-between items-start gap-4">
          <h4 className="font-bold text-gray-800 dark:text-gray-100 text-sm">
            {toastNotification.tytul}
          </h4>
          <button 
            onClick={closeToast}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-xs line-clamp-2">
          {toastNotification.tresc}
        </p>
      </div>
    </div>
  );
}