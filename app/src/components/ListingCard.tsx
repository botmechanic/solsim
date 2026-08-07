import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { MarketplaceListing } from '../../../shared/types';
import { destinationFor } from '../theme/destinations';
import { colors, radius, space, type } from '../theme/tokens';
import { formatDataMb, formatLamportsAsSol, truncatePubkey } from '../lib/format';

type Props = {
  listing: MarketplaceListing;
  onPress: () => void;
};

export function ListingCard({ listing, onPress }: Props) {
  const dest = destinationFor(listing.country);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={styles.top}>
        <Text style={styles.country}>{dest.name}</Text>
        <Text style={[styles.badge, listing.demo ? styles.badgeDemo : styles.badgeLive]}>
          {listing.demo ? 'Demo' : 'Live'}
        </Text>
      </View>
      <Text style={styles.meta}>
        {formatDataMb(listing.dataRemainingMb)} left of{' '}
        {formatDataMb(listing.dataMb)} · until{' '}
        {new Date(listing.validUntil).toLocaleDateString()}
      </Text>
      <View style={styles.footer}>
        <Text style={styles.seller}>{truncatePubkey(listing.seller, 4, 4)}</Text>
        <Text style={styles.price}>{formatLamportsAsSol(listing.priceLamports)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    padding: space.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: space.sm,
  },
  pressed: {
    backgroundColor: colors.surfaceHover,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: space.sm,
  },
  country: {
    ...type.headline,
    color: colors.text,
  },
  badge: {
    ...type.label,
    fontSize: 11,
  },
  badgeLive: {
    color: colors.accent,
  },
  badgeDemo: {
    color: colors.warning,
  },
  meta: {
    ...type.caption,
    color: colors.textSecondary,
    marginBottom: space.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: space.md,
  },
  seller: {
    ...type.caption,
    color: colors.textTertiary,
  },
  price: {
    ...type.bodyStrong,
    color: colors.accent,
  },
});
