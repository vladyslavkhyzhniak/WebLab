import { getStorageMode } from '../config/storage';
import { UserApiLocal } from './local/UserApiLocal';
import { UserApiFirebase } from './firebase/UserApiFirebase';

export const UserApi = getStorageMode() === 'firebase' ? UserApiFirebase : UserApiLocal;