import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_TOKEN_KEY = 'solsim.mwa.authToken';
const PUBKEY_KEY = 'solsim.mwa.pubkey';

export type StoredAuthorization = {
  authToken: string;
  publicKey: string;
};

export async function loadAuthorization(): Promise<StoredAuthorization | null> {
  const [authToken, publicKey] = await Promise.all([
    AsyncStorage.getItem(AUTH_TOKEN_KEY),
    AsyncStorage.getItem(PUBKEY_KEY),
  ]);
  if (!authToken || !publicKey) {
    return null;
  }
  return { authToken, publicKey };
}

export async function saveAuthorization(
  auth: StoredAuthorization,
): Promise<void> {
  await Promise.all([
    AsyncStorage.setItem(AUTH_TOKEN_KEY, auth.authToken),
    AsyncStorage.setItem(PUBKEY_KEY, auth.publicKey),
  ]);
}

export async function clearAuthorization(): Promise<void> {
  await Promise.all([
    AsyncStorage.removeItem(AUTH_TOKEN_KEY),
    AsyncStorage.removeItem(PUBKEY_KEY),
  ]);
}
