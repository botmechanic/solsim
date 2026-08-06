import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { EsimPlan } from '../../../shared/types';
import { colors, radius, space, type } from '../theme/tokens';
import { destinationFor } from '../theme/destinations';
import {
  formatDataMb,
  formatLamportsAsSol,
} from '../lib/format';

type Props = {
  plan: EsimPlan;
  onPress: () => void;
};

export function PlanCard({ plan, onPress }: Props) {
  const dest = destinationFor(plan.country);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={styles.codeBox}>
        <Text style={styles.code}>{plan.country}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.country}>{dest.name}</Text>
        <Text style={styles.meta}>
          {formatDataMb(plan.dataMb)} · {plan.validityDays} days
        </Text>
      </View>
      <Text style={styles.price}>
        {formatLamportsAsSol(plan.priceLamports)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingVertical: space.lg,
    paddingHorizontal: space.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: space.sm,
  },
  pressed: {
    backgroundColor: colors.surfaceHover,
  },
  codeBox: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  code: {
    ...type.label,
    color: colors.text,
  },
  body: {
    flex: 1,
  },
  country: {
    ...type.headline,
    color: colors.text,
  },
  meta: {
    ...type.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  price: {
    ...type.bodyStrong,
    color: colors.accent,
  },
});
