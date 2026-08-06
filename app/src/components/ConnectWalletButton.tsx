import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme/colors';
import { useWallet } from '../wallet/WalletContext';
import { truncatePubkey } from '../lib/format';

type Props = {
  compact?: boolean;
};

export function ConnectWalletButton({ compact = false }: Props) {
  const { publicKey, connecting, connect, disconnect } = useWallet();

  if (connecting) {
    return (
      <Pressable style={[styles.button, compact && styles.compact]} disabled>
        <ActivityIndicator color={colors.bg} />
      </Pressable>
    );
  }

  if (publicKey) {
    return (
      <Pressable
        style={[styles.button, styles.connected, compact && styles.compact]}
        onPress={disconnect}>
        <Text style={styles.label}>
          {compact
            ? truncatePubkey(publicKey.toBase58())
            : `Disconnect ${truncatePubkey(publicKey.toBase58())}`}
        </Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      style={[styles.button, compact && styles.compact]}
      onPress={connect}>
      <Text style={styles.label}>Connect wallet</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  compact: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    minHeight: 36,
  },
  connected: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 15,
  },
});
