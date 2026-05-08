import { useEffect, useState } from 'react';
import { TaskApi } from '../api/TaskApi';
import { TaskDetails } from './TaskDetails';
import type { Task, TaskPriority, TaskStatus } from '../types/Task';
import { useNotification } from '../contexts/NotificationContext'; 
import { StoryApi } from '../api/StoryApi'; 

interface TaskBoardProps {
  storyId: string;
  onClose: () => void;
  onRefreshParent: () => void;
}

export function TaskBoard({ storyId, onClose, onRefreshParent }: TaskBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [nazwa, setNazwa] = useState('');
  const [opis, setOpis] = useState('');
  const [priorytet, setPriorytet] = useState<TaskPriority>('średni');
  const [czas, setCzas] = useState(1);
  
  const { sendNotification } = useNotification(); 

  const fetchTasks = async () => {
    const data = await TaskApi.getByStory(storyId);
    setTasks(data);
    if (selectedTask) {
      const updated = data.find(t => t.id === selectedTask.id);
      setSelectedTask(updated || null);
    }
  };

  useEffect(() => { fetchTasks(); }, [storyId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nazwa.trim()) return;
    
    await TaskApi.create({ nazwa, opis, priorytet, historyjkaId: storyId, przewidywanyCzas: czas });

    const story = await StoryApi.getById(storyId);
    if (story) {
      sendNotification({
        tytul: 'Nowe zadanie w historyjce',
        tresc: `Utworzono nowe zadanie "${nazwa}" w Twojej historyjce.`,
        priorytet: 'średni',
        odbiorcaId: story.wlascicielId
      });
    }

    setNazwa(''); setOpis(''); setCzas(1); setPriorytet('średni');
    fetchTasks();
    onRefreshParent(); 
  };

  const handleDelete = async (id: string) => {
    const taskToDelete = tasks.find(t => t.id === id);
    await TaskApi.delete(id);
    if (taskToDelete) {
      const story = await StoryApi.getById(storyId);
      if (story) {
        sendNotification({
          tytul: 'Usunięto zadanie',
          tresc: `Zadanie "${taskToDelete.nazwa}" zostało usunięte z historyjki.`,
          priorytet: 'średni',
          odbiorcaId: story.wlascicielId
        });
      }
    }
    fetchTasks();
  };

  const renderTaskColumn = (title: string, status: TaskStatus) => {
    const colTasks = tasks.filter(t => t.stan === status);
    return (
      <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col h-full transition-colors min-w-[280px]">
        <h4 className="font-bold text-lg text-gray-700 dark:text-gray-200 mb-4 border-b border-gray-200 dark:border-gray-700 pb-3 flex justify-between items-center">
          {title} <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm">{colTasks.length}</span>
        </h4>
        <ul className="space-y-4 flex-1">
          {colTasks.map(task => (
            <li key={task.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-all hover:shadow-md flex flex-col"
                onClick={() => setSelectedTask(task)}>
              <div className="font-bold text-gray-800 dark:text-gray-100 text-base break-words">{task.nazwa}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-3 mb-2 flex justify-between items-center">
                <span className="bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-lg font-bold border border-transparent dark:border-gray-600">{task.przewidywanyCzas}h</span>
                <span className={`px-3 py-1.5 rounded-lg font-bold text-xs uppercase ${
                  task.priorytet === 'wysoki' ? 'text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400 border border-transparent dark:border-red-900/30' : 'text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 border border-transparent dark:border-gray-600'
                }`}>
                  {task.priorytet}
                </span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); handleDelete(task.id); }}
                className="mt-4 w-full py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-xs font-bold hover:bg-red-100 dark:hover:bg-red-900/40 border border-transparent dark:border-red-900/30 transition-colors text-center"
              >
                Usuń zadanie
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const inputClass = "px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm";

  return (
    <div className="mt-4 bg-white dark:bg-gray-800 p-6 sm:p-8 border-2 border-blue-200 dark:border-blue-800 rounded-2xl shadow-lg relative transition-colors">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h3 className="text-2xl font-extrabold text-blue-800 dark:text-blue-400">Zadania Historyjki</h3>
        <button onClick={onClose} className="w-full sm:w-auto bg-gray-100 dark:bg-gray-700 px-5 py-2.5 rounded-lg text-base font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow-sm border border-transparent dark:border-gray-600">
          Wróć do projektów
        </button>
      </div>

      <form onSubmit={handleCreate} className="mb-8 flex flex-col sm:flex-row flex-wrap gap-4">
        <input type="text" placeholder="Nazwa zadania" required value={nazwa} onChange={e => setNazwa(e.target.value)} className={`flex-1 min-w-[180px] ${inputClass}`} />
        <input type="text" placeholder="Krótki opis" value={opis} onChange={e => setOpis(e.target.value)} className={`flex-1 min-w-[180px] ${inputClass}`} />
        <div className="flex gap-4 flex-1 sm:flex-none">
          <label className="text-gray-700 dark:text-gray-300">Czas (h)</label>
          <input type="number" min="1" placeholder="Czas (h)" required value={czas} onChange={e => setCzas(Number(e.target.value))} className={`w-full sm:w-28 ${inputClass}`} />
          <select value={priorytet} onChange={e => setPriorytet(e.target.value as TaskPriority)} className={`w-full sm:w-auto ${inputClass}`}>
            <option value="niski">Niski</option>
            <option value="średni">Średni</option>
            <option value="wysoki">Wysoki</option>
          </select>
        </div>
        <button type="submit" className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-lg text-base font-bold hover:bg-blue-700 transition-colors shadow-sm">Dodaj Zadanie</button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
        {renderTaskColumn('Do zrobienia', 'todo')}
        {renderTaskColumn('W trakcie', 'doing')}
        {renderTaskColumn('Zrobione', 'done')}
      </div>

      {selectedTask && (
        <TaskDetails task={selectedTask} onClose={() => setSelectedTask(null)} onRefresh={() => { fetchTasks(); onRefreshParent(); }} />
      )}
    </div>
  );
}