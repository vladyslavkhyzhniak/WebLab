import { useEffect, useState } from 'react';
import { StoryApi } from '../api/StoryApi';
import type { Story, StoryPriority, StoryStatus } from '../types/Story';
import { useAuth } from '../contexts/AuthContext'; 

interface StoryBoardProps {
  projectId: string;
}

export function StoryBoard({ projectId }: StoryBoardProps) {
  const [stories, setStories] = useState<Story[]>([]);
  const [nazwa, setNazwa] = useState('');
  const [opis, setOpis] = useState('');
  const [priorytet, setPriorytet] = useState<StoryPriority>('średni');
  
  const { user } = useAuth(); 

  const fetchStories = async () => {
    const data = await StoryApi.getByProject(projectId);
    setStories(data);
  };

  useEffect(() => {
    fetchStories();
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
      <div className="flex-1 bg-gray-50 p-4 rounded-lg min-w-[280px] border border-gray-200">
        <h3 className="font-bold text-gray-700 mb-4 flex justify-between items-center border-b border-gray-200 pb-2">
          {title} 
          <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">{filteredStories.length}</span>
        </h3>
        
        <ul className="space-y-3">
          {filteredStories.map(story => (
            <li key={story.id} className="bg-white p-4 rounded shadow-sm border border-gray-200 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-800">{story.nazwa}</h4>
                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${
                  story.priorytet === 'wysoki' ? 'bg-red-100 text-red-700' : 
                  story.priorytet === 'średni' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                }`}>
                  {story.priorytet}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-4 flex-1">{story.opis}</p>
              
              <div className="bg-gray-50 p-2 rounded text-[11px] text-gray-500 mb-3 space-y-1 border border-gray-100">
                <div className="flex justify-between">
                  <span className="font-medium">ID:</span>
                  <span>{story.id.split('-')[0]}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Utworzono:</span>
                  <span>{new Date(story.dataUtworzenia).toLocaleString('pl-PL', { 
                    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                  })}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Właściciel:</span>
                  {/* Красиво отображаем владельца */}
                  <span className="text-blue-600 font-medium">
                    {story.wlascicielId === user.id ? `${user.imie} ${user.nazwisko}` : story.wlascicielId}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2 text-xs border-t pt-3 mt-auto border-gray-100">
                {status !== 'todo' && <button onClick={() => handleStatusChange(story.id, 'todo')} className="text-blue-600 font-medium hover:text-blue-800 transition-colors">Do ToDo</button>}
                {status !== 'doing' && <button onClick={() => handleStatusChange(story.id, 'doing')} className="text-blue-600 font-medium hover:text-blue-800 transition-colors">Do Doing</button>}
                {status !== 'done' && <button onClick={() => handleStatusChange(story.id, 'done')} className="text-blue-600 font-medium hover:text-blue-800 transition-colors">Do Done</button>}
                <button onClick={() => handleDelete(story.id)} className="text-red-500 font-medium hover:text-red-700 transition-colors ml-auto">Usuń</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="mt-6 flex flex-col gap-6 h-full">
      {/* Секция формы создания задачи остается такой же, как в предыдущем сообщении */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="font-semibold mb-3 text-gray-700">Dodaj historyjkę</h3>
        <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3">
          <input 
            type="text" placeholder="Nazwa" required value={nazwa} onChange={e => setNazwa(e.target.value)}
            className="flex-1 px-3 py-2 border rounded text-sm"
          />
          <input 
            type="text" placeholder="Opis" value={opis} onChange={e => setOpis(e.target.value)}
            className="flex-1 px-3 py-2 border rounded text-sm"
          />
          <select 
            value={priorytet} onChange={e => setPriorytet(e.target.value as StoryPriority)}
            className="px-3 py-2 border rounded text-sm bg-white"
          >
            <option value="niski">Niski</option>
            <option value="średni">Średni</option>
            <option value="wysoki">Wysoki</option>
          </select>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-medium rounded text-sm hover:bg-blue-700">
            Dodaj
          </button>
        </form>
      </div>

      <div className="flex flex-col xl:flex-row gap-4 flex-1 overflow-x-auto pb-4">
        {renderColumn('Do zrobienia (ToDo)', 'todo')}
        {renderColumn('W trakcie (Doing)', 'doing')}
        {renderColumn('Zrobione (Done)', 'done')}
      </div>
    </div>
  );
}