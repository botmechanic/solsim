import { useCallback } from 'react';
import {
  Linking,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ConnectWalletButton } from '../components/ConnectWalletButton';
import { colors, radius, space, type } from '../theme/tokens';
import { truncatePubkey } from '../lib/format';
import { solscanAddressUrl } from '../lib/explorer';
import { shareText } from '../lib/shareText';
import { useWallet } from '../wallet/WalletContext';
import { SOLANA_CHAIN } from '../config/identity';

export function WalletScreen() {
  const insets = useSafeAreaInsets();
  const { publicKey, balanceLamports, refreshBalance, connecting } =
    useWallet();

  const onRefresh = useCallback(() => {
    refreshBalance().catch(() => undefined);
  }, [refreshBalance]);

  useFocusEffect(
    useCallback(() => {
      if (publicKey) {
        refreshBalance().catch(() => undefined);
      }
    }, [publicKey, refreshBalance]),
  );

  const sol =
    balanceLamports === null
      ? '—'
      : `${(balanceLamports / 1e9).toFixed(4)} SOL`;

  const address = publicKey?.toBase58();

  const onShareAddress = () => {
    if (!address) {
      return;
    }
    shareText(address, 'Solsim wallet').catch(() => undefined);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: Math.max(insets.top, space.lg) },
      ]}
      refreshControl={
        <RefreshControl
          refreshing={connecting}
          onRefresh={onRefresh}
          tintColor={colors.accent}
        />
      }
      showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Wallet</Text>
      <Text style={styles.subtitle}>
        Keys stay in your wallet app via Mobile Wallet Adapter.
      </Text>

      <View style={styles.panel}>
        <Text style={styles.label}>Status</Text>
        <Text style={styles.value}>
          {publicKey ? 'Connected' : 'Not connected'}
        </Text>

        {address ? (
          <>
            <Text style={[styles.label, styles.spaced]}>Address</Text>
            <Text style={styles.mono}>{truncatePubkey(address, 6, 6)}</Text>
            <Text style={styles.full} selectable>
              {address}
            </Text>
            <Pressable onPress={onShareAddress} hitSlop={8}>
              <Text style={styles.link}>Share address</Text>
            </Pressable>
            <Pressable
              onPress={() => Linking.openURL(solscanAddressUrl(address))}
              hitSlop={8}>
              <Text style={styles.link}>View on Solscan</Text>
            </Pressable>

            <Text style={[styles.label, styles.spaced]}>Balance</Text>
            <Text style={styles.value}>{sol}</Text>
            <Pressable onPress={onRefresh} hitSlop={8}>
              <Text style={styles.link}>Refresh</Text>
            </Pressable>
          </>
        ) : null}

        <View style={styles.cta}>
          <ConnectWalletButton />
        </View>
      </View>

      <View style={styles.metaPanel}>
        <Text style={styles.label}>Network</Text>
        <Text style={styles.metaValue}>Solana Devnet</Text>
        <Text style={[styles.label, styles.spaced]}>Chain</Text>
        <Text style={styles.metaValue}>{SOLANA_CHAIN}</Text>
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
    paddingHorizontal: space.xl,
    paddingBottom: space.xxxl,
  },
  title: {
    ...type.title,
    color: colors.text,
  },
  subtitle: {
    ...type.caption,
    color: colors.textSecondary,
    marginTop: space.sm,
    marginBottom: space.xl,
  },
  panel: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: space.xl,
  },
  metaPanel: {
    marginTop: space.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgElevated,
    padding: space.xl,
  },
  label: {
    ...type.label,
    color: colors.textTertiary,
  },
  spaced: {
    marginTop: space.xl,
  },
  value: {
    ...type.headline,
    color: colors.text,
    marginTop: space.sm,
  },
  mono: {
    ...type.headline,
    color: colors.accent,
    marginTop: space.sm,
  },
  full: {
    ...type.caption,
    color: colors.textTertiary,
    marginTop: space.sm,
  },
  metaValue: {
    ...type.bodyStrong,
    color: colors.text,
    marginTop: space.sm,
  },
  link: {
    ...type.bodyStrong,
    color: colors.accent,
    fontSize: 13,
    marginTop: space.md,
  },
  cta: {
    marginTop: space.xl,
  },
});
