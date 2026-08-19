import { createMMKV } from 'react-native-mmkv';
import { Platform } from 'react-native';

const encryptionKey =
  Platform.OS === 'web' // bcz it not supported on web
    ? undefined
    : '2470d3b7df645c0de88e9985aa2f4e7b2e78b3fd8df1145fe291a217202f04e0';

const config: { id: string; encryptionKey?: string } = {
  id: 'plie-redux-storage',
};

if (encryptionKey) {
  config.encryptionKey = encryptionKey;
}

export const storage = createMMKV(config);

export const reduxPersistStorage = {
  setItem: (key: string, value: string) => {
    storage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: (key: string) => {
    const value = storage.getString(key);
    return Promise.resolve(value ?? null);
  },
  removeItem: (key: string) => {
    storage.remove(key);
    return Promise.resolve(true);
  },
  getAllKeys: () => {
    return Promise.resolve(storage.getAllKeys());
  },
};

export default storage;
