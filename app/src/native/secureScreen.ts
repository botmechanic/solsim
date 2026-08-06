import { NativeModules, Platform } from 'react-native';

type SecureScreenNative = {
  setSecure: (enabled: boolean) => void;
};

const native: SecureScreenNative | undefined = NativeModules.SecureScreen;

/** Blocks screenshots / screen recording on Android while the QR is visible. */
export function setSecureScreen(enabled: boolean): void {
  if (Platform.OS !== 'android' || !native?.setSecure) {
    return;
  }
  native.setSecure(enabled);
}
