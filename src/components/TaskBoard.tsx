import { useEffect, useState } from 'react';
import { TaskApi } from '../api/TaskApi';
import { TaskDetails } from './TaskDetails';
import type { Task, TaskPriority, TaskStatus } from '../types/Task';

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

  const fetchTasks = async () => {
    const data = await TaskApi.getByStory(storyId);
    setTasks(data);
    
    if (selectedTask) {
      const updated = data.find(t => t.id === selectedTask.id);
      setSelectedTask(updated || null);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [storyId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nazwa.trim()) return;

    await TaskApi.create({
      nazwa, opis, priorytet,
      historyjkaId: storyId,
      przewidywanyCzas: czas
    });

    setNazwa(''); setOpis(''); setCzas(1); setPriorytet('średni');
    fetchTasks();
    onRefreshParent(); 
  };

  const handleDelete = async (id: string) => {
    await TaskApi.delete(id);
    fetchTasks();
  };

  const renderTaskColumn = (title: string, status: TaskStatus) => {
    const colTasks = tasks.filter(t => t.stan === status);
    
    return (
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col h-full">
        <h4 className="font-bold text-gray-700 mb-3 border-b pb-2 flex justify-between items-center">
          {title} <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs">{colTasks.length}</span>
        </h4>
        <ul className="space-y-3 flex-1">
          {colTasks.map(task => (
            <li key={task.id} className="bg-white p-3 rounded border shadow-sm cursor-pointer hover:border-blue-300 transition flex flex-col h-full"
                onClick={() => setSelectedTask(task)}>
              <div className="font-semibold text-gray-800 text-sm break-words">{task.nazwa}</div>
              <div className="text-xs text-gray-500 mt-1 flex justify-between items-center">
                <span>{task.przewidywanyCzas}h</span>
                <span className={`px-1.5 py-0.5 rounded font-medium ${task.priorytet === 'wysoki' ? 'text-red-700 bg-red-50' : 'text-gray-600 bg-gray-100'}`}>
                  {task.priorytet}
                </span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); handleDelete(task.id); }}
                className="text-red-500 hover:text-red-700 text-[10px] mt-3 block w-full text-right font-medium"
              >
                Usuń
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="mt-4 bg-white p-4 sm:p-6 border-2 border-blue-200 rounded-lg shadow-md relative">
      <div className="flex justify-between items-center mb-6 gap-2">
        <h3 className="text-xl font-bold text-blue-800">Zadania Historyjki</h3>
        <button onClick={onClose} className="bg-gray-100 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-200 whitespace-nowrap">
          Wróć
        </button>
      </div>

      <form onSubmit={handleCreate} className="mb-6 flex flex-col sm:flex-row flex-wrap gap-3">
        <input type="text" placeholder="Nazwa zadania" required value={nazwa} onChange={e => setNazwa(e.target.value)} className="px-3 py-2 border rounded text-sm flex-1 min-w-[140px]" />
        <input type="text" placeholder="Opis" value={opis} onChange={e => setOpis(e.target.value)} className="px-3 py-2 border rounded text-sm flex-1 min-w-[140px]" />
        <div className="flex gap-3 flex-1 sm:flex-none">
          <input type="number" min="1" placeholder="Czas (h)" required value={czas} onChange={e => setCzas(Number(e.target.value))} className="px-3 py-2 border rounded text-sm w-full sm:w-24" />
          <select value={priorytet} onChange={e => setPriorytet(e.target.value as TaskPriority)} className="px-3 py-2 border rounded text-sm bg-white w-full sm:w-auto">
            <option value="niski">Niski</option>
            <option value="średni">Średni</option>
            <option value="wysoki">Wysoki</option>
          </select>
        </div>
        <button type="submit" className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700">Dodaj Zadanie</button>
      </form>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {renderTaskColumn('Do zrobienia', 'todo')}
        {renderTaskColumn('W trakcie', 'doing')}
        {renderTaskColumn('Zrobione', 'done')}
      </div>

      {selectedTask && (
        <TaskDetails 
          task={selectedTask} 
          onClose={() => setSelectedTask(null)} 
          onRefresh={() => { fetchTasks(); onRefreshParent(); }} 
        />
      )}
    </div>
  );
}