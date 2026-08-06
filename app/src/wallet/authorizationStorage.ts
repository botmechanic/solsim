import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';

const AUTH_TOKEN_KEY = 'solsim.mwa.authToken';
const PUBKEY_KEY = 'solsim.mwa.pubkey';

export type StoredAuthorization = {
  authToken: string;
  publicKey: string;
};

async function migrateFromAsyncStorage(): Promise<StoredAuthorization | null> {
  const [authToken, publicKey] = await Promise.all([
    AsyncStorage.getItem(AUTH_TOKEN_KEY),
    AsyncStorage.getItem(PUBKEY_KEY),
  ]);
  if (!authToken || !publicKey) {
    return null;
  }
  const auth = { authToken, publicKey };
  await saveAuthorization(auth);
  await Promise.all([
    AsyncStorage.removeItem(AUTH_TOKEN_KEY),
    AsyncStorage.removeItem(PUBKEY_KEY),
  ]);
  return auth;
}

export async function loadAuthorization(): Promise<StoredAuthorization | null> {
  try {
    const [authToken, publicKey] = await Promise.all([
      EncryptedStorage.getItem(AUTH_TOKEN_KEY),
      EncryptedStorage.getItem(PUBKEY_KEY),
    ]);
    if (authToken && publicKey) {
      return { authToken, publicKey };
    }
  } catch {
    // fall through to legacy AsyncStorage
  }
  return migrateFromAsyncStorage();
}

export async function saveAuthorization(
  auth: StoredAuthorization,
): Promise<void> {
  await Promise.all([
    EncryptedStorage.setItem(AUTH_TOKEN_KEY, auth.authToken),
    EncryptedStorage.setItem(PUBKEY_KEY, auth.publicKey),
  ]);
}

export async function clearAuthorization(): Promise<void> {
  await Promise.all([
    EncryptedStorage.removeItem(AUTH_TOKEN_KEY).catch(() => undefined),
    EncryptedStorage.removeItem(PUBKEY_KEY).catch(() => undefined),
    AsyncStorage.removeItem(AUTH_TOKEN_KEY),
    AsyncStorage.removeItem(PUBKEY_KEY),
  ]);
}
