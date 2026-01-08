import AsyncStorage from '@react-native-async-storage/async-storage';
import type {Credentials, CredentialsConfig} from './types';

const STORAGE_KEY = '@appstoreconnect_credentials';

export async function saveCredentialsConfig(
  config: CredentialsConfig,
): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export async function loadCredentialsConfig(): Promise<CredentialsConfig | null> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (!data) {
      return null;
    }
    return JSON.parse(data) as CredentialsConfig;
  } catch {
    return null;
  }
}

// For this simplified version, we store the private key directly in the config
export async function savePrivateKey(
  keyContent: string,
  _keyId: string,
): Promise<string> {
  // Return the key content as-is, we'll store it in the config
  return keyContent;
}

export async function loadCredentials(): Promise<Credentials | null> {
  const config = await loadCredentialsConfig();
  if (!config) {
    return null;
  }

  return {
    apiKeyId: config.apiKeyId,
    issuerId: config.issuerId,
    privateKey: config.privateKeyPath, // privateKeyPath now stores the actual key content
  };
}

export async function clearCredentials(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

export async function hasCredentials(): Promise<boolean> {
  const creds = await loadCredentials();
  return creds !== null;
}
