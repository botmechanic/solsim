import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { OwnedEsim } from '../../../shared/types';
import { colors, radius, space, type } from '../theme/tokens';
import { destinationFor } from '../theme/destinations';
import { isDemoSignature } from '../lib/explorer';
import { formatDataMb, truncatePubkey } from '../lib/format';

type Props = {
  esim: OwnedEsim;
  onPress: () => void;
};

export function EsimCard({ esim, onPress }: Props) {
  const dest = destinationFor(esim.country);
  const isDemo = isDemoSignature(esim.paymentSignature);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={styles.top}>
        <Text style={styles.country}>{dest.name}</Text>
        <Text style={[styles.badge, isDemo ? styles.badgeDemo : styles.badgeLive]}>
          {isDemo ? 'Demo' : 'NFT'}
        </Text>
      </View>
      <Text style={styles.meta}>
        {formatDataMb(esim.dataMb)} · until{' '}
        {new Date(esim.validUntil).toLocaleDateString()}
      </Text>
      <View style={styles.footer}>
        <Text style={styles.mint}>{truncatePubkey(esim.mint, 6, 6)}</Text>
        <Text style={styles.reveal}>Reveal QR</Text>
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
  mint: {
    ...type.caption,
    color: colors.textTertiary,
  },
  reveal: {
    ...type.bodyStrong,
    color: colors.accent,
    fontSize: 13,
  },
});
