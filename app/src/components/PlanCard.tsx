import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { EsimPlan } from '../../../shared/types';
import { colors } from '../theme/colors';
import {
  countryLabel,
  formatDataMb,
  formatLamportsAsSol,
} from '../lib/format';

type Props = {
  plan: EsimPlan;
  onPress: () => void;
};

export function PlanCard({ plan, onPress }: Props) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        <Text style={styles.country}>{countryLabel(plan.country)}</Text>
        <Text style={styles.price}>{formatLamportsAsSol(plan.priceLamports)}</Text>
      </View>
      <Text style={styles.meta}>
        {formatDataMb(plan.dataMb)} · {plan.validityDays} days
      </Text>
      <Text style={styles.hint}>Mock provider · devnet</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  country: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  price: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '700',
  },
  meta: {
    color: colors.textMuted,
    fontSize: 14,
    marginBottom: 4,
  },
  hint: {
    color: colors.tabInactive,
    fontSize: 12,
  },
});
