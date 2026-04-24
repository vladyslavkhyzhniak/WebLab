import { useState } from 'react';
import type { Task } from '../types/Task';
import { TaskApi } from '../api/TaskApi';
import { StoryApi } from '../api/StoryApi';
import { useAuth } from '../contexts/AuthContext';

interface TaskDetailsProps {
  task: Task;
  onClose: () => void;
  onRefresh: () => void;
}

export function TaskDetails({ task, onClose, onRefresh }: TaskDetailsProps) {
  const { users } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState('');

  const availableWorkers = users.filter(u => u.rola === 'devops' || u.rola === 'developer');
  const assignedUser = users.find(u => u.id === task.przypisanyUzytkownikId);

  const getWorkedHours = () => {
    if (!task.dataStartu) return 0;
    const start = new Date(task.dataStartu).getTime();
    const end = task.dataZakonczenia ? new Date(task.dataZakonczenia).getTime() : new Date().getTime();
    return ((end - start) / (1000 * 60 * 60)).toFixed(1);
  };

  const handleAssign = async () => {
    if (!selectedUserId) return;
    
    await TaskApi.update(task.id, {
      przypisanyUzytkownikId: selectedUserId,
      stan: 'doing',
      dataStartu: new Date().toISOString()
    });

    const story = await StoryApi.getById(task.historyjkaId);
    if (story && story.stan === 'todo') {
      await StoryApi.updateStatus(story.id, 'doing');
    }

    onRefresh();
  };

  const handleComplete = async () => {
    await TaskApi.update(task.id, {
      stan: 'done',
      dataZakonczenia: new Date().toISOString()
    });

    const storyTasks = await TaskApi.getByStory(task.historyjkaId);
    const allDone = storyTasks.every(t => t.stan === 'done');
    
    if (allDone) {
      await StoryApi.updateStatus(task.historyjkaId, 'done');
    }

    onRefresh();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          ✕
        </button>
        
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">{task.nazwa}</h2>
          <span className="text-xs font-semibold text-blue-600 uppercase bg-blue-50 px-2 py-1 rounded">
            Stan: {task.stan}
          </span>
        </div>

        <p className="text-gray-600 mb-6">{task.opis}</p>

        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div className="bg-gray-50 p-3 rounded border">
            <span className="block text-gray-500 font-medium">Priorytet:</span>
            <span className="font-semibold">{task.priorytet}</span>
          </div>
          <div className="bg-gray-50 p-3 rounded border">
            <span className="block text-gray-500 font-medium">Estymacja:</span>
            <span className="font-semibold">{task.przewidywanyCzas} godz.</span>
          </div>
          <div className="bg-gray-50 p-3 rounded border">
            <span className="block text-gray-500 font-medium">Data Startu:</span>
            <span className="font-semibold">{task.dataStartu ? new Date(task.dataStartu).toLocaleString() : '-'}</span>
          </div>
          <div className="bg-gray-50 p-3 rounded border">
            <span className="block text-gray-500 font-medium">Roboczogodziny:</span>
            <span className="font-semibold">{getWorkedHours()} godz.</span>
          </div>
        </div>

        <div className="border-t pt-4 flex items-center justify-between">
          <div className="flex-1">
            <span className="block text-sm font-medium text-gray-700 mb-1">Przypisana osoba:</span>
            {assignedUser ? (
              <span className="font-semibold text-gray-800">{assignedUser.imie} {assignedUser.nazwisko} ({assignedUser.rola})</span>
            ) : (
              <div className="flex gap-2">
                <select 
                  className="border rounded px-3 py-1.5 text-sm w-full max-w-xs"
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
                  className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-blue-700"
                >
                  Przypisz i Rozpocznij
                </button>
              </div>
            )}
          </div>

          <div className="ml-4">
            {task.stan === 'doing' && (
              <button 
                onClick={handleComplete}
                className="bg-green-600 text-white px-5 py-2 rounded text-sm font-bold hover:bg-green-700 shadow"
              >
                ✓ Zakończ zadanie
              </button>
            )}
            {task.stan === 'done' && (
              <div className="text-sm">
                <span className="block text-gray-500">Zakończono:</span>
                <span className="font-medium text-green-700">{task.dataZakonczenia ? new Date(task.dataZakonczenia).toLocaleString() : ''}</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}