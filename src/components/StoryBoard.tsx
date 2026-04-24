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
    if (!nazwa.trim()) return;

    await StoryApi.create({
      nazwa,
      opis,
      priorytet,
      stan: 'todo',
      projektId: projectId,
      wlascicielId: user.id, 
    });

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

  const renderColumn = (title: string, status: StoryStatus) => {
    const filteredStories = stories.filter(s => s.stan === status);
    
    return (
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col h-full">
        <h3 className="font-bold text-gray-700 mb-4 flex justify-between items-center border-b border-gray-200 pb-2">
          {title} 
          <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">{filteredStories.length}</span>
        </h3>
        
        <ul className="space-y-3 flex-1">
          {filteredStories.map(story => (
            <li key={story.id} className="bg-white p-4 rounded shadow-sm border border-gray-200 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-800 break-words pr-2">{story.nazwa}</h4>
                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded whitespace-nowrap ${
                  story.priorytet === 'wysoki' ? 'bg-red-100 text-red-700' : 
                  story.priorytet === 'średni' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                }`}>
                  {story.priorytet}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-4 flex-1 break-words">{story.opis}</p>
              
              <div className="flex gap-2 mb-3 mt-auto">
                <button 
                  onClick={() => setActiveTaskStoryId(story.id)}
                  className="w-full bg-blue-50 text-blue-700 py-1.5 rounded text-sm font-semibold hover:bg-blue-100 transition border border-blue-200"
                >
                  Zarządzaj Zadaniami
                </button>
              </div>

              <div className="flex flex-wrap gap-2 text-xs border-t pt-3 border-gray-100">
                {status !== 'todo' && <button onClick={() => handleStatusChange(story.id, 'todo')} className="text-gray-600 font-medium hover:text-gray-800 transition-colors">Do ToDo</button>}
                {status !== 'doing' && <button onClick={() => handleStatusChange(story.id, 'doing')} className="text-gray-600 font-medium hover:text-gray-800 transition-colors">Do Doing</button>}
                {status !== 'done' && <button onClick={() => handleStatusChange(story.id, 'done')} className="text-gray-600 font-medium hover:text-gray-800 transition-colors">Do Done</button>}
                <button onClick={() => handleDelete(story.id)} className="text-red-500 font-medium hover:text-red-700 transition-colors ml-auto">Usuń</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  if (activeTaskStoryId) {
    return (
      <TaskBoard 
        storyId={activeTaskStoryId} 
        onClose={() => setActiveTaskStoryId(null)} 
        onRefreshParent={fetchStories} 
      />
    );
  }

  return (
    <div className="mt-6 flex flex-col gap-6 h-full">
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="font-semibold mb-3 text-gray-700">Dodaj historyjkę</h3>
        <form onSubmit={handleCreate} className="flex flex-col md:flex-row flex-wrap gap-3">
          <input type="text" placeholder="Nazwa" required value={nazwa} onChange={e => setNazwa(e.target.value)} className="flex-1 min-w-[150px] px-3 py-2 border rounded text-sm"/>
          <input type="text" placeholder="Opis" value={opis} onChange={e => setOpis(e.target.value)} className="flex-1 min-w-[150px] px-3 py-2 border rounded text-sm"/>
          <select value={priorytet} onChange={e => setPriorytet(e.target.value as StoryPriority)} className="w-full md:w-auto px-3 py-2 border rounded text-sm bg-white">
            <option value="niski">Niski</option>
            <option value="średni">Średni</option>
            <option value="wysoki">Wysoki</option>
          </select>
          <button type="submit" className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white font-medium rounded text-sm hover:bg-blue-700">Dodaj</button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 flex-1 items-start">
        {renderColumn('Do zrobienia (ToDo)', 'todo')}
        {renderColumn('W trakcie (Doing)', 'doing')}
        {renderColumn('Zrobione (Done)', 'done')}
      </div>
    </div>
  );
}