import { useState, useEffect } from 'react';
import type { Project } from '../types/Project';

interface ProjectFormProps {
  onSubmit: (data: { nazwa: string; opis: string }) => void;
  initialData?: Project | null;
  onCancel?: () => void;
}

export function ProjectForm({ onSubmit, initialData, onCancel }: ProjectFormProps) {
  const [nazwa, setNazwa] = useState('');
  const [opis, setOpis] = useState('');

  useEffect(() => {
    if (initialData) {
      setNazwa(initialData.nazwa);
      setOpis(initialData.opis);
    } else {
      setNazwa('');
      setOpis('');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nazwa.trim() || !opis.trim()) return;
    
    onSubmit({ nazwa, opis });
    
    if (!initialData) {
      setNazwa('');
      setOpis('');
    }
  };

  const inputClass = "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base shadow-sm";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <input 
        type="text" 
        placeholder="Nazwa projektu" 
        value={nazwa}
        onChange={(e) => setNazwa(e.target.value)}
        className={inputClass}
      />
      <textarea 
        placeholder="Opis projektu" 
        value={opis}
        rows={4}
        onChange={(e) => setOpis(e.target.value)}
        className={inputClass}
      />
      <div className="flex gap-4 mt-2">
        <button 
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          {initialData ? 'Zapisz zmiany' : 'Dodaj projekt'}
        </button>
        {initialData && onCancel && (
          <button 
            type="button" 
            onClick={onCancel}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Anuluj
          </button>
        )}
      </div>
    </form>
  );
}