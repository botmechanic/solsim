import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import type { OwnedEsim } from '../../../shared/types';

const KEY = 'solsim.owned.esims.v1';

async function migrateFromAsyncStorage(): Promise<OwnedEsim[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as OwnedEsim[];
    const esims = Array.isArray(parsed) ? parsed : [];
    if (esims.length > 0) {
      await EncryptedStorage.setItem(KEY, JSON.stringify(esims));
      await AsyncStorage.removeItem(KEY);
    }
    return esims;
  } catch {
    return [];
  }
}

export async function loadAllOwned(): Promise<OwnedEsim[]> {
  try {
    const raw = await EncryptedStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as OwnedEsim[];
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch {
    // fall through
  }
  return migrateFromAsyncStorage();
}

export async function saveAllOwned(esims: OwnedEsim[]): Promise<void> {
  await EncryptedStorage.setItem(KEY, JSON.stringify(esims));
  await AsyncStorage.removeItem(KEY).catch(() => undefined);
}

export async function upsertOwned(esim: OwnedEsim): Promise<OwnedEsim[]> {
  const all = await loadAllOwned();
  const next = [esim, ...all.filter(item => item.mint !== esim.mint)];
  await saveAllOwned(next);
  return next;
}
