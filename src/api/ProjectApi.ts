import { getStorageMode } from '../config/storage';
import { ProjectApiLocal } from './local/ProjectApiLocal';
import { ProjectApiFirebase } from './firebase/ProjectApiFirebase';

export const ProjectApi = getStorageMode() === 'firebase' ? ProjectApiFirebase : ProjectApiLocal;