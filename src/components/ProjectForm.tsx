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

  // Wypełnij formularz danymi, jeśli jesteśmy w trybie edycji
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
    
    // Wyczyść formularz po dodaniu (jeśli to nie była edycja)
    if (!initialData) {
      setNazwa('');
      setOpis('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input 
        type="text" 
        placeholder="Nazwa projektu" 
        value={nazwa}
        onChange={(e) => setNazwa(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      />
      <textarea 
        placeholder="Opis projektu" 
        value={opis}
        rows={3}
        onChange={(e) => setOpis(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      />
      <div className="flex gap-3">
        <button 
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          {initialData ? 'Zapisz zmiany' : 'Dodaj projekt'}
        </button>
        {initialData && onCancel && (
          <button 
            type="button" 
            onClick={onCancel}
            className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition-colors"
          >
            Anuluj
          </button>
        )}
      </div>
    </form>
  );
}