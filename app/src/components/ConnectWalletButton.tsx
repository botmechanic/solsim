import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors, fonts, radius, space } from '../theme/tokens';
import { useWallet } from '../wallet/WalletContext';
import { truncatePubkey } from '../lib/format';

type Props = {
  compact?: boolean;
};

export function ConnectWalletButton({ compact = false }: Props) {
  const { publicKey, connecting, connect, disconnect } = useWallet();

  if (connecting) {
    return (
      <Pressable
        style={[styles.button, compact && styles.compact]}
        disabled>
        <ActivityIndicator color={colors.accentText} />
      </Pressable>
    );
  }

  if (publicKey) {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.button,
          styles.connected,
          compact && styles.compact,
          pressed && styles.pressed,
        ]}
        onPress={disconnect}>
        <Text style={[styles.label, styles.connectedLabel]}>
          {truncatePubkey(publicKey.toBase58())}
        </Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        compact && styles.compact,
        pressed && styles.pressed,
      ]}
      onPress={connect}>
      <Text style={styles.label}>{compact ? 'Connect' : 'Connect wallet'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  compact: {
    paddingVertical: space.sm,
    paddingHorizontal: space.md,
    minHeight: 34,
  },
  connected: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    fontFamily: fonts.bodySemi,
    color: colors.accentText,
    fontSize: 13,
  },
  connectedLabel: {
    color: colors.text,
  },
});
