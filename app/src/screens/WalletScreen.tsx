import { useCallback } from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ConnectWalletButton } from '../components/ConnectWalletButton';
import { colors } from '../theme/colors';
import { truncatePubkey } from '../lib/format';
import { useWallet } from '../wallet/WalletContext';
import { SOLANA_CHAIN } from '../config/identity';
import { RPC_ENDPOINT } from '../config/solana';

export function WalletScreen() {
  const { publicKey, balanceLamports, refreshBalance, connecting } =
    useWallet();

  const onRefresh = useCallback(() => {
    refreshBalance().catch(() => undefined);
  }, [refreshBalance]);

  const sol =
    balanceLamports === null ? '—' : `${(balanceLamports / 1e9).toFixed(4)} SOL`;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={connecting}
          onRefresh={onRefresh}
          tintColor={colors.accent}
        />
      }>
      <Text style={styles.title}>Wallet</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Status</Text>
        <Text style={styles.value}>
          {publicKey ? 'Connected via MWA' : 'Not connected'}
        </Text>
        {publicKey ? (
          <>
            <Text style={[styles.label, styles.spaced]}>Address</Text>
            <Text style={styles.mono}>{truncatePubkey(publicKey.toBase58(), 8, 8)}</Text>
            <Text style={styles.full}>{publicKey.toBase58()}</Text>
            <Text style={[styles.label, styles.spaced]}>Balance</Text>
            <Text style={styles.value}>{sol}</Text>
            <Pressable style={styles.refresh} onPress={onRefresh}>
              <Text style={styles.refreshLabel}>Refresh balance</Text>
            </Pressable>
          </>
        ) : null}
        <View style={styles.cta}>
          <ConnectWalletButton />
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Cluster</Text>
        <Text style={styles.value}>{SOLANA_CHAIN}</Text>
        <Text style={[styles.label, styles.spaced]}>RPC</Text>
        <Text style={styles.full}>{RPC_ENDPOINT}</Text>
        <Text style={[styles.hint, styles.spaced]}>
          Uses Mobile Wallet Adapter
          (@solana-mobile/mobile-wallet-adapter-protocol-web3js). Install Phantom
          or the Solana Mobile mock wallet on the emulator to test connect.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  label: {
    color: colors.textMuted,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  spaced: {
    marginTop: 16,
  },
  value: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
  },
  mono: {
    color: colors.accent,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 4,
  },
  full: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 6,
  },
  hint: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
  },
  cta: {
    marginTop: 20,
  },
  refresh: {
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  refreshLabel: {
    color: colors.accent,
    fontWeight: '600',
  },
});
