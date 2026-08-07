import { useCallback, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MarketplaceListing } from '../../../shared/types';
import { Button } from '../components/ui/Button';
import { ConnectWalletButton } from '../components/ConnectWalletButton';
import { fetchListings } from '../marketplace/api';
import { buyListingDemo, buyListingLive } from '../marketplace/buyListing';
import { useOwnership } from '../ownership/OwnershipContext';
import { useWallet } from '../wallet/WalletContext';
import { destinationFor } from '../theme/destinations';
import { colors, radius, space, type } from '../theme/tokens';
import {
  formatDataMb,
  formatLamportsAsSol,
  truncatePubkey,
} from '../lib/format';
import type { MarketplaceStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<MarketplaceStackParamList, 'ListingDetail'>;

export function ListingDetailScreen({ navigation, route }: Props) {
  const { listingId } = route.params;
  const { publicKey, authToken, connect } = useWallet();
  const { addOwned } = useOwnership();
  const [listing, setListing] = useState<MarketplaceListing | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const all = await fetchListings();
    setListing(all.find(item => item.listingId === listingId) ?? null);
  }, [listingId]);

  useFocusEffect(
    useCallback(() => {
      load().catch(() => setListing(null));
    }, [load]),
  );

  if (!listing) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Listing gone</Text>
        <Text style={styles.body}>
          It may have sold. Pull Marketplace to refresh.
        </Text>
        <Button label="Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const dest = destinationFor(listing.country);

  const afterBuy = async (
    esim: Awaited<ReturnType<typeof buyListingDemo>>,
  ) => {
    await addOwned(esim);
    Alert.alert(
      'You own this leftover',
      `${formatDataMb(listing.dataRemainingMb)} for ${dest.name} is in My eSIMs.`,
      [
        {
          text: 'My eSIMs',
          onPress: () => navigation.getParent()?.navigate('MyEsims'),
        },
      ],
    );
  };

  const ensureWallet = async (): Promise<boolean> => {
    if (publicKey) {
      return true;
    }
    return connect();
  };

  const onDemoBuy = async () => {
    const ready = await ensureWallet();
    if (!ready || !publicKey) {
      if (ready && !publicKey) {
        Alert.alert('Connected', 'Tap Buy leftover again.');
      }
      return;
    }
    if (publicKey.toBase58() === listing.seller) {
      Alert.alert(
        'That’s your listing',
        'Switch wallet to buy as the inbound traveler.',
      );
      return;
    }
    setBusy(true);
    try {
      const esim = await buyListingDemo(listing, publicKey.toBase58());
      await afterBuy(esim);
    } catch (err) {
      Alert.alert(
        'Buy failed',
        err instanceof Error ? err.message : 'Try again',
      );
    } finally {
      setBusy(false);
    }
  };

  const onLiveBuy = async () => {
    const ready = await ensureWallet();
    if (!ready || !publicKey) {
      if (ready && !publicKey) {
        Alert.alert('Connected', 'Tap Buy with SOL again.');
      }
      return;
    }
    if (publicKey.toBase58() === listing.seller) {
      Alert.alert(
        'That’s your listing',
        'Switch wallet to buy as the inbound traveler.',
      );
      return;
    }
    setBusy(true);
    try {
      const { esim } = await buyListingLive({ listing, authToken });
      await afterBuy(esim);
    } catch (err) {
      Alert.alert(
        'Buy failed',
        err instanceof Error ? err.message : 'Try again',
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.kicker}>Secondhand data</Text>
      <Text style={styles.title}>
        {formatDataMb(listing.dataRemainingMb)} left in {dest.name}
      </Text>
      <Text style={styles.body}>
        Seller overbought and is flying home. Pay them directly — the NFT (and
        install QR) transfer to your wallet.
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Price</Text>
        <Text style={styles.value}>
          {formatLamportsAsSol(listing.priceLamports)}
        </Text>
        <Text style={[styles.label, styles.gap]}>Original plan</Text>
        <Text style={styles.value}>{formatDataMb(listing.dataMb)}</Text>
        <Text style={[styles.label, styles.gap]}>Seller</Text>
        <Text style={styles.mono}>{truncatePubkey(listing.seller, 6, 6)}</Text>
      </View>

      {!publicKey ? (
        <View style={styles.connectWrap}>
          <Text style={styles.connectText}>Connect a wallet to buy.</Text>
          <ConnectWalletButton />
        </View>
      ) : null}

      {listing.demo ? (
        <Button
          label="Buy leftover (Demo)"
          loading={busy}
          onPress={() => {
            onDemoBuy().catch(() => undefined);
          }}
        />
      ) : (
        <Button
          label="Buy with SOL"
          loading={busy}
          onPress={() => {
            onLiveBuy().catch(() => undefined);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: space.xl,
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
  label: {
    ...type.caption,
    color: colors.textTertiary,
  },
  value: {
    ...type.headline,
    color: colors.text,
    marginTop: space.xs,
  },
  mono: {
    ...type.caption,
    color: colors.text,
    marginTop: space.xs,
  },
  gap: {
    marginTop: space.lg,
  },
  connectWrap: {
    marginBottom: space.lg,
    gap: space.md,
  },
  connectText: {
    ...type.caption,
    color: colors.textSecondary,
  },
});
