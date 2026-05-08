import { useState } from 'react';
import type { Task } from '../types/Task';
import { TaskApi } from '../api/TaskApi';
import { StoryApi } from '../api/StoryApi';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext'; 

interface TaskDetailsProps {
  task: Task;
  onClose: () => void;
  onRefresh: () => void;
}

export function TaskDetails({ task, onClose, onRefresh }: TaskDetailsProps) {
  const { users } = useAuth();
  const { sendNotification } = useNotification(); 
  const [selectedUserId, setSelectedUserId] = useState('');

  const availableWorkers = users;
  const assignedUser = users.find(u => u.id === task.przypisanyUzytkownikId);

  const getWorkedHours = () => {
    if (!task.dataStartu) return 0;
    const start = new Date(task.dataStartu).getTime();
    const end = task.dataZakonczenia ? new Date(task.dataZakonczenia).getTime() : new Date().getTime();
    return ((end - start) / (1000 * 60 * 60)).toFixed(1);
  };

  const handleAssign = async () => {
    if (!selectedUserId) return;
    await TaskApi.update(task.id, { przypisanyUzytkownikId: selectedUserId, stan: 'doing', dataStartu: new Date().toISOString() });
    sendNotification({
      tytul: 'Nowe zadanie!',
      tresc: `Zostałeś przypisany do zadania: "${task.nazwa}".`,
      priorytet: 'wysoki',
      odbiorcaId: selectedUserId
    });

    const story = await StoryApi.getById(task.historyjkaId);
    if (story) {
      if (story.stan === 'todo') {
        await StoryApi.updateStatus(story.id, 'doing');
      }
      sendNotification({
        tytul: 'Zmiana statusu zadania',
        tresc: `Zadanie "${task.nazwa}" przeszło w stan Doing.`,
        priorytet: 'niski',
        odbiorcaId: story.wlascicielId
      });
    }
    
    onRefresh();
  };

  const handleComplete = async () => {
    await TaskApi.update(task.id, { stan: 'done', dataZakonczenia: new Date().toISOString() });
    
    const storyTasks = await TaskApi.getByStory(task.historyjkaId);
    const allDone = storyTasks.every(t => t.stan === 'done');
    
    const story = await StoryApi.getById(task.historyjkaId);
    if (story) {
      if (allDone) {
        await StoryApi.updateStatus(task.historyjkaId, 'done');
      }
      sendNotification({
        tytul: 'Zadanie ukończone',
        tresc: `Zadanie "${task.nazwa}" zostało oznaczone jako Zrobione.`,
        priorytet: 'średni',
        odbiorcaId: story.wlascicielId
      });
    }

    onRefresh();
  };
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl p-8 relative border dark:border-gray-700">
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-lg"
        >
          ✕
        </button>
        
        <div className="mb-8 pr-12">
          <h2 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 mb-3">{task.nazwa}</h2>
          <span className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg tracking-wide">
            Stan: {task.stan}
          </span>
        </div>

        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 whitespace-pre-wrap">{task.opis}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-base">
          {[
            { label: 'Priorytet', value: task.priorytet },
            { label: 'Estymacja', value: `${task.przewidywanyCzas} godz.` },
            { label: 'Data Startu', value: task.dataStartu ? new Date(task.dataStartu).toLocaleString() : '-' },
            { label: 'Roboczogodziny', value: `${getWorkedHours()} godz.` }
          ].map((item, idx) => (
            <div key={idx} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border dark:border-gray-600 flex flex-col justify-center">
              <span className="block text-gray-500 dark:text-gray-400 font-bold text-sm mb-1 uppercase tracking-wider">{item.label}</span>
              <span className="font-extrabold text-gray-800 dark:text-gray-100 text-lg">{item.value}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex-1 w-full">
            <span className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Przypisana osoba:</span>
            {assignedUser ? (
              <span className="inline-block bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg font-bold text-gray-800 dark:text-gray-100 text-lg">
                {assignedUser.imie} {assignedUser.nazwisko} <span className="text-gray-500 dark:text-gray-400 text-base font-medium">({assignedUser.rola})</span>
              </span>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <select 
                  className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded-lg px-4 py-3 text-base w-full sm:max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                >
                  <option value="">-- Wybierz pracownika --</option>
                  {availableWorkers.map(u => (
                    <option key={u.id} value={u.id}>{u.imie} {u.nazwisko} ({u.rola})</option>
                  ))}
                </select>
                <button 
                  onClick={handleAssign}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg text-base font-bold hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap"
                >
                  Przypisz i Rozpocznij
                </button>
              </div>
            )}
          </div>

          <div className="w-full sm:w-auto">
            {task.stan === 'doing' && (
              <button 
                onClick={handleComplete}
                className="w-full sm:w-auto bg-green-600 text-white px-8 py-3 rounded-lg text-base font-extrabold hover:bg-green-700 shadow-md transition-all hover:-translate-y-0.5"
              >
                ✓ Zakończ zadanie
              </button>
            )}
            {task.stan === 'done' && (
              <div className="text-right bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-100 dark:border-green-800/50 inline-block w-full sm:w-auto">
                <span className="block text-xs font-bold text-green-600 dark:text-green-500 uppercase tracking-wider mb-1">Zakończono</span>
                <span className="font-bold text-green-700 dark:text-green-400 text-sm">{task.dataZakonczenia ? new Date(task.dataZakonczenia).toLocaleString() : ''}</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}