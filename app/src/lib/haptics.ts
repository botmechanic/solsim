import { Platform, Vibration } from 'react-native';

/** Short success buzz — never throw (missing VIBRATE must not kill the buy flow). */
export function hapticSuccess(): void {
  try {
    if (Platform.OS === 'android') {
      Vibration.vibrate(40);
      return;
    }
    Vibration.vibrate(10);
  } catch {
    // Ignore — haptics are optional.
  }
}

export function hapticError(): void {
  try {
    if (Platform.OS === 'android') {
      Vibration.vibrate([0, 40, 60, 40]);
      return;
    }
    Vibration.vibrate(40);
  } catch {
    // Ignore — haptics are optional.
  }
}
