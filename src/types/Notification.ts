export type  NotificationPriority = 'niski' | 'średni' | 'wysoki';

export interface Notification {
  id: string;
  tytul: string;
  tresc: string;
  priorytet: NotificationPriority;
  dataUtworzenia: string;
  przeczytana: boolean;
  odbiorcaId: string;
}