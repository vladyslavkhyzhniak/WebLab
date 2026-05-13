import { useEffect, useState } from 'react';
import { StoryApi } from '../api/StoryApi';
import type { Story, StoryPriority, StoryStatus } from '../types/Story';
import { useAuth } from '../contexts/AuthContext'; 
import { TaskBoard } from './TaskBoard';

interface StoryBoardProps {
  projectId: string;
}

export function StoryBoard({ projectId }: StoryBoardProps) {
  const [stories, setStories] = useState<Story[]>([]);
  const [nazwa, setNazwa] = useState('');
  const [opis, setOpis] = useState('');
  const [priorytet, setPriorytet] = useState<StoryPriority>('średni');
  const [activeTaskStoryId, setActiveTaskStoryId] = useState<string | null>(null);
  const { user } = useAuth(); 

  const fetchStories = async () => {
    const data = await StoryApi.getByProject(projectId);
    setStories(data);
  };

  useEffect(() => {
    fetchStories();
    setActiveTaskStoryId(null);
  }, [projectId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nazwa.trim() || !user) return;
    await StoryApi.create({ nazwa, opis, priorytet, stan: 'todo', projektId: projectId, wlascicielId: user.id });
    setNazwa(''); setOpis(''); setPriorytet('średni');
    fetchStories();
  };

  const handleStatusChange = async (id: string, stan: StoryStatus) => {
    await StoryApi.updateStatus(id, stan);
    fetchStories();
  };

  const handleDelete = async (id: string) => {
    await StoryApi.delete(id);
    fetchStories();
  };
  const statusBtnClass = "px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors border border-transparent dark:border-gray-600";

  const renderColumn = (title: string, status: StoryStatus) => {
    const filteredStories = stories.filter(s => s.stan === status);
    return (
      <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col h-full transition-colors min-w-[300px]">
        <h3 className="font-bold text-lg text-gray-700 dark:text-gray-200 mb-5 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3">
          {title} 
          <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm px-3 py-1 rounded-full">{filteredStories.length}</span>
        </h3>
        <ul className="space-y-4 flex-1">
          {filteredStories.map(story => (
            <li key={story.id} className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col transition-colors">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-bold text-lg text-gray-800 dark:text-gray-100 break-words pr-2">{story.nazwa}</h4>
                <span className={`text-xs uppercase font-bold px-3 py-1.5 rounded-lg whitespace-nowrap ${
                  story.priorytet === 'wysoki' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 
                  story.priorytet === 'średni' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                }`}>
                  {story.priorytet}
                </span>
              </div>
              <p className="text-base text-gray-600 dark:text-gray-400 mb-5 flex-1 break-words">{story.opis}</p>
              
              <div className="flex gap-2 mb-4 mt-auto">
                <button 
                  onClick={() => setActiveTaskStoryId(story.id)}
                  className="w-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 py-2.5 rounded-lg text-base font-bold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition border border-blue-200 dark:border-blue-800/50 shadow-sm"
                >
                  Zarządzaj Zadaniami
                </button>
              </div>

              <div className="flex flex-wrap gap-2 border-t border-gray-100 dark:border-gray-700 pt-4 items-center">
                {status !== 'todo' && <button onClick={() => handleStatusChange(story.id, 'todo')} className={statusBtnClass}>➔ ToDo</button>}
                {status !== 'doing' && <button onClick={() => handleStatusChange(story.id, 'doing')} className={statusBtnClass}>➔ Doing</button>}
                {status !== 'done' && <button onClick={() => handleStatusChange(story.id, 'done')} className={statusBtnClass}>➔ Done</button>}
                
                <button 
                  onClick={() => handleDelete(story.id)} 
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 border border-transparent dark:border-red-900/30 transition-colors ml-auto"
                >
                  Usuń
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  if (activeTaskStoryId) {
    return <TaskBoard storyId={activeTaskStoryId} onClose={() => setActiveTaskStoryId(null)} onRefreshParent={fetchStories} />;
  }

  const inputClass = "px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm";

  return (
    <div className="mt-8 flex flex-col gap-8 h-full">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
        <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-100">Dodaj nową historyjkę</h3>
        <form onSubmit={handleCreate} className="flex flex-col md:flex-row flex-wrap gap-4">
          <input type="text" placeholder="Nazwa historyjki" required value={nazwa} onChange={e => setNazwa(e.target.value)} className={`flex-1 min-w-[200px] ${inputClass}`}/>
          <input type="text" placeholder="Opis historyjki" value={opis} onChange={e => setOpis(e.target.value)} className={`flex-1 min-w-[200px] ${inputClass}`}/>
          <select value={priorytet} onChange={e => setPriorytet(e.target.value as StoryPriority)} className={`w-full md:w-40 ${inputClass}`}>
            <option value="niski">Niski</option>
            <option value="średni">Średni</option>
            <option value="wysoki">Wysoki</option>
          </select>
          <button type="submit" id="add-story-btn" className="w-full md:w-auto px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg text-base hover:bg-blue-700 transition-colors shadow-sm">
            Dodaj
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 flex-1 items-start">
        {renderColumn('Do zrobienia (ToDo)', 'todo')}
        {renderColumn('W trakcie (Doing)', 'doing')}
        {renderColumn('Zrobione (Done)', 'done')}
      </div>
    </div>
  );
}