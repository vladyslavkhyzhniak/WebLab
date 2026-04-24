export type TaskPriority = 'niski' | 'średni' | 'wysoki';
export type TaskStatus = 'todo' | 'doing' | 'done';

export interface Task {
  id: string;
  nazwa: string;
  opis: string;
  priorytet: TaskPriority;
  historyjkaId: string;
  przewidywanyCzas: number; 
  stan: TaskStatus;
  dataDodania: string;
  dataStartu?: string;
  dataZakonczenia?: string;
  przypisanyUzytkownikId?: string;
}