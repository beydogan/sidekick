import AsyncStorage from '@react-native-async-storage/async-storage';
import type {AICredentials} from './types';

const STORAGE_KEY = '@ai_credentials';

export async function saveAICredentials(
  credentials: AICredentials,
): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
}

export async function loadAICredentials(): Promise<AICredentials | null> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (!data) {
      return null;
    }
    return JSON.parse(data) as AICredentials;
  } catch {
    return null;
  }
}

export async function clearAICredentials(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

export async function hasAICredentials(): Promise<boolean> {
  const creds = await loadAICredentials();
  return creds !== null;
}
