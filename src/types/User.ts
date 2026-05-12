export type UserRole = 'admin' | 'devops' | 'developer' | "guest";

export interface User {
  id:  string;
  imie: string;
  nazwisko: string;
  email: string;
  rola: UserRole;
  czyZablokowany: boolean;
}