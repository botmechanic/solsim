import { useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../components/ui/Button';
import { listLeftover } from '../marketplace/listLeftover';
import { useOwnership } from '../ownership/OwnershipContext';
import { destinationFor } from '../theme/destinations';
import { colors, radius, space, type } from '../theme/tokens';
import {
  formatDataMb,
  formatLamportsAsSol,
} from '../lib/format';
import { isDemoSignature } from '../lib/explorer';
import { useWallet } from '../wallet/WalletContext';
import type { MyEsimsStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<MyEsimsStackParamList, 'SellLeftover'>;

export function SellLeftoverScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { mint } = route.params;
  const { getByMint, markAsListed } = useOwnership();
  const { authToken, publicKey } = useWallet();
  const esim = getByMint(mint);
  const [busy, setBusy] = useState(false);

  const priceLamports = useMemo(() => {
    if (!esim) {
      return '1000000';
    }
    // Recover ~60% of unused share against a 0.01 SOL reference plan price.
    const base = 10_000_000;
    return String(
      Math.max(
        1_000_000,
        Math.round(base * (esim.dataRemainingMb / esim.dataMb) * 0.6),
      ),
    );
  }, [esim]);

  if (!esim) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + space.lg }]}>
        <Text style={styles.title}>eSIM not found</Text>
        <Button label="Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const dest = destinationFor(esim.country);
  const demo = isDemoSignature(esim.paymentSignature);
  const leftover = formatDataMb(esim.dataRemainingMb);
  const used = formatDataMb(esim.dataMb - esim.dataRemainingMb);

  const onList = async () => {
    if (!publicKey || publicKey.toBase58() !== esim.owner) {
      Alert.alert('Connect the owner wallet', 'Switch to the wallet that owns this eSIM.');
      return;
    }
    setBusy(true);
    try {
      const result = await listLeftover({
        esim,
        priceLamports,
        authToken,
      });
      await markAsListed(esim.mint, result.listingId);
      Alert.alert(
        'Listed',
        `${leftover} listed on Marketplace for ${formatLamportsAsSol(priceLamports)}.`,
        [
          {
            text: 'View Marketplace',
            onPress: () => navigation.getParent()?.navigate('Marketplace'),
          },
        ],
      );
    } catch (err) {
      Alert.alert(
        'Could not list',
        err instanceof Error ? err.message : 'Try again.',
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: Math.max(insets.top, space.lg) },
      ]}>
      <Text style={styles.kicker}>Recover unused data</Text>
      <Text style={styles.title}>
        You used {used} of {formatDataMb(esim.dataMb)} in {dest.name}
      </Text>
      <Text style={styles.body}>
        List the remaining {leftover} instead of watching it expire. A traveler
        landing soon buys at a discount — you get SOL back.
      </Text>

      <View style={styles.card}>
        <Text style={styles.rowLabel}>Leftover</Text>
        <Text style={styles.rowValue}>{leftover}</Text>
        <Text style={[styles.rowLabel, styles.gap]}>Ask price</Text>
        <Text style={styles.rowValue}>{formatLamportsAsSol(priceLamports)}</Text>
        <Text style={styles.hint}>
          ~60% of the unused share — pitched recovery, not full refund.
        </Text>
      </View>

      <Button
        label={demo ? 'List on Marketplace (Demo)' : 'Deposit NFT & list'}
        onPress={() => {
          onList().catch(() => undefined);
        }}
        loading={busy}
      />
      <Text style={styles.footnote}>
        {demo
          ? 'Demo mint — soft listing (no on-chain escrow).'
          : 'Live path: NFT moves to Solsim escrow until a buyer pays you.'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: space.xl,
  },
  kicker: {
    ...type.label,
    color: colors.accent,
    marginBottom: space.sm,
  },
  title: {
    ...type.title,
    color: colors.text,
    marginBottom: space.md,
  },
  body: {
    ...type.body,
    color: colors.textSecondary,
    marginBottom: space.xl,
  },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: space.xl,
    marginBottom: space.xl,
  },
  rowLabel: {
    ...type.caption,
    color: colors.textTertiary,
  },
  rowValue: {
    ...type.headline,
    color: colors.text,
    marginTop: space.xs,
  },
  gap: {
    marginTop: space.lg,
  },
  hint: {
    ...type.caption,
    color: colors.textSecondary,
    marginTop: space.md,
  },
  footnote: {
    ...type.caption,
    color: colors.textTertiary,
    marginTop: space.md,
  },
});
