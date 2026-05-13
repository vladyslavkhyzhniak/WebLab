import { getStorageMode } from '../config/storage';
import { TaskApiLocal } from './local/TaskApiLocal';
import { TaskApiFirebase } from './firebase/TaskApiFirebase';

export const TaskApi = getStorageMode() === 'firebase' ? TaskApiFirebase : TaskApiLocal;