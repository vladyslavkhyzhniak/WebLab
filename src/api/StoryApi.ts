import { getStorageMode } from '../config/storage';
import { StoryApiLocal } from './local/StoryApiLocal';
import { StoryApiFirebase } from './firebase/StoryAPiFirebase';

export const StoryApi = getStorageMode() === 'firebase' ? StoryApiFirebase : StoryApiLocal;