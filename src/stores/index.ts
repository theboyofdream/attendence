import { MMKVLoader } from 'react-native-mmkv-storage';

export const storage = new MMKVLoader().initialize();

export * from './useAuthStore';
export * from './useTypesOfAttendanceStatus'