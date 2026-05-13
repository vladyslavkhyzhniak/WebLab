import { getStorageMode } from '../config/storage';
import { NotificationApi as LocalNotificationApi } from './local/NotificationApiLocal'; 
import { NotificationApiFirebase } from './firebase/NotificationApiFirebase';

export const NotificationApi = getStorageMode() === 'firebase' ? NotificationApiFirebase : LocalNotificationApi;