import { useState } from 'react';
import { useNotification } from '../contexts/NotificationContext';

export function NotificationsPage() {
  const { notifications, markAsRead } = useNotification();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggle = (id: string, isRead: boolean) => {
    if (expandedId !== id) {
      setExpandedId(id);
      if (!isRead) {
        markAsRead(id);
      }
    } else {
      setExpandedId(null);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'wysoki': return 'text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800/50';
      case 'średni': return 'text-yellow-700 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/50';
      default: return 'text-blue-700 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800/50';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 w-full">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100">
          Twoje powiadomienia
        </h2>
        <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 font-bold px-4 py-1.5 rounded-lg">
          Razem: {notifications.length}
        </span>
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-12 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 text-center transition-colors">
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">Brak powiadomień. Twoja skrzynka jest pusta!</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {notifications.map(notification => {
            const isExpanded = expandedId === notification.id;
            
            return (
              <li 
                key={notification.id} 
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border transition-all cursor-pointer hover:shadow-md ${
                  !notification.przeczytana 
                    ? 'border-blue-300 dark:border-blue-600 border-l-4' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}
                onClick={() => handleToggle(notification.id, notification.przeczytana)}
              >
                <div className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    {!notification.przeczytana ? (
                      <span className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0 animate-pulse"></span>
                    ) : (
                      <span className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full flex-shrink-0"></span>
                    )}
                    
                    <div>
                      <h4 className={`text-lg ${!notification.przeczytana ? 'font-extrabold text-gray-900 dark:text-white' : 'font-semibold text-gray-700 dark:text-gray-300'}`}>
                        {notification.tytul}
                      </h4>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1 block">
                        {new Date(notification.dataUtworzenia).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase border ${getPriorityColor(notification.priorytet)}`}>
                    {notification.priorytet}
                  </span>
                </div>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-gray-100 dark:border-gray-700 mt-2 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl">
                    <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed mt-4">
                      {notification.tresc}
                    </p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}