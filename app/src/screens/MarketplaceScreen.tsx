import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { MarketplaceListing } from '../../../shared/types';
import { ConnectWalletButton } from '../components/ConnectWalletButton';
import { ListingCard } from '../components/ListingCard';
import { fetchListings } from '../marketplace/api';
import { colors, space, type } from '../theme/tokens';
import type { MarketplaceStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<MarketplaceStackParamList, 'MarketplaceList'>;

export function MarketplaceScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setListings(await fetchListings());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load listings');
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh().catch(() => undefined);
    }, [refresh]),
  );

  return (
    <View
      style={[
        styles.container,
        { paddingTop: Math.max(insets.top, space.lg) },
      ]}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.brand}>Solsim</Text>
          <ConnectWalletButton compact />
        </View>
        <Text style={styles.hero}>
          You can’t lose money on data you didn’t use.
        </Text>
        <Text style={styles.tagline}>
          Leftover eSIM data, listed by travelers leaving soon. Buy at a
          discount — ownership transfers as an NFT.
        </Text>
      </View>

      <Text style={styles.section}>
        Marketplace · {listings.length} listing{listings.length === 1 ? '' : 's'}
      </Text>

      {loading && listings.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : (
        <FlatList
          data={listings}
          keyExtractor={item => item.listingId}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => refresh()}
              tintColor={colors.accent}
            />
          }
          contentContainerStyle={[
            styles.list,
            listings.length === 0 && styles.flexGrow,
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>
                {error ? 'Marketplace offline' : 'No leftovers yet'}
              </Text>
              <Text style={styles.emptyBody}>
                {error
                  ? `${error} Start the API and pull to refresh.`
                  : 'Buy a plan, use some data, then Sell leftover from My eSIMs.'}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <ListingCard
              listing={item}
              onPress={() =>
                navigation.navigate('ListingDetail', {
                  listingId: item.listingId,
                })
              }
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    paddingHorizontal: space.xl,
    paddingBottom: space.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: space.md,
  },
  brand: {
    ...type.brand,
    color: colors.text,
  },
  hero: {
    ...type.title,
    color: colors.text,
    marginBottom: space.sm,
  },
  tagline: {
    ...type.body,
    color: colors.textSecondary,
    maxWidth: 360,
  },
  section: {
    ...type.label,
    color: colors.textTertiary,
    paddingHorizontal: space.xl,
    paddingTop: space.xl,
    paddingBottom: space.md,
  },
  list: {
    paddingHorizontal: space.xl,
    paddingBottom: space.xxxl,
  },
  flexGrow: {
    flexGrow: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    paddingVertical: space.xl,
  },
  emptyTitle: {
    ...type.headline,
    color: colors.text,
    marginBottom: space.sm,
  },
  emptyBody: {
    ...type.caption,
    color: colors.textSecondary,
  },
});
