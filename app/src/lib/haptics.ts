import { Platform, Vibration } from 'react-native';

/** Short success buzz — no extra deps. */
export function hapticSuccess(): void {
  if (Platform.OS === 'android') {
    Vibration.vibrate(40);
    return;
  }
  Vibration.vibrate(10);
}

export function hapticError(): void {
  if (Platform.OS === 'android') {
    Vibration.vibrate([0, 40, 60, 40]);
    return;
  }
  Vibration.vibrate(40);
}
