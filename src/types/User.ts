export type UserRole = 'admin' | 'devops' | 'developer';

export interface User {
  id: string;
  imie: string;
  nazwisko: string;
  email: string;
  rola: UserRole;
}