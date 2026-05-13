export type StorageMode = 'local' | 'firebase';

export const getStorageMode = (): StorageMode => {
  const mode = import.meta.env.VITE_STORAGE_MODE;
  return mode === 'firebase' ? 'firebase' : 'local';
};