import { Share } from 'react-native';

/** Share sheet doubles as copy on most Android OEMs. */
export async function shareText(message: string, title?: string): Promise<void> {
  try {
    await Share.share({ message, title });
  } catch {
    // user dismissed
  }
}
