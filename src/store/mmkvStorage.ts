import { MMKV } from 'react-native-mmkv';
import { getOrCreateEncryptionKey } from '../utils/security';

let storageInstance: MMKV | null = null;

/**
 * Lazily initializes the encrypted MMKV instance.
 */
const getStorage = async (): Promise<MMKV> => {
  if (storageInstance) return storageInstance;

  try {
    const encryptionKey = await getOrCreateEncryptionKey();
    storageInstance = new MMKV({
      id: 'legacy-orb-storage',
      encryptionKey,
    });
    return storageInstance;
  } catch (error) {
    // If secure storage fails, we should not proceed with unencrypted storage
    // in a production environment.
    console.error('Failed to initialize encrypted storage:', error);
    throw error;
  }
};

/**
 * Storage adapter for redux-persist that uses encrypted MMKV.
 */
export const mmkvStorage = {
  setItem: async (key: string, value: string) => {
    try {
      const storage = await getStorage();
      storage.set(key, value);
      return true;
    } catch {
      return false;
    }
  },
  getItem: async (key: string) => {
    try {
      const storage = await getStorage();
      const value = storage.getString(key);
      return value ?? null;
    } catch {
      return null;
    }
  },
  removeItem: async (key: string) => {
    try {
      const storage = await getStorage();
      storage.remove(key);
    } catch {
      // Ignore removal errors
    }
  },
};

/**
 * Export the raw instance as a promise for non-redux usage if needed.
 */
export const getMMKVInstance = getStorage;
