import { Platform } from 'react-native';

/**
 * Emulator → host loopback (`10.0.2.2`).
 * On a physical device, change this to your machine LAN IP, e.g.
 * `http://192.168.1.20:8787`.
 */
export const API_BASE_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:8787' : 'http://127.0.0.1:8787';

export const PLANS_PATH = '/v1/plans';
