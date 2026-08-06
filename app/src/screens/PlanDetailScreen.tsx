import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getPlanById } from '../data/mockPlans';
import { colors } from '../theme/colors';
import {
  countryLabel,
  formatDataMb,
  formatLamportsAsSol,
} from '../lib/format';
import { useWallet } from '../wallet/WalletContext';
import type { PlansStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<PlansStackParamList, 'PlanDetail'>;

export function PlanDetailScreen({ route }: Props) {
  const plan = getPlanById(route.params.planId);
  const { publicKey, connect } = useWallet();

  if (!plan) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Plan not found.</Text>
      </View>
    );
  }

  const onBuy = () => {
    if (!publicKey) {
      Alert.alert('Connect wallet', 'Connect Phantom via MWA before buying.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Connect', onPress: () => connect() },
      ]);
      return;
    }
    Alert.alert(
      'Purchase coming next',
      `Wallet ${publicKey.toBase58().slice(0, 8)}… is ready. Devnet payment + mint wires up after the API purchase saga.`,
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{countryLabel(plan.country)}</Text>
      <Text style={styles.meta}>
        {formatDataMb(plan.dataMb)} · {plan.validityDays} days validity
      </Text>
      <View style={styles.panel}>
        <Text style={styles.panelLabel}>Price (devnet)</Text>
        <Text style={styles.price}>{formatLamportsAsSol(plan.priceLamports)}</Text>
        <Text style={styles.note}>
          Mock eSIM profile. Same ownership model as production — QR is never
          public on-chain.
        </Text>
      </View>
      <Pressable style={styles.cta} onPress={onBuy}>
        <Text style={styles.ctaLabel}>Buy with SOL</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 20,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  meta: {
    color: colors.textMuted,
    fontSize: 16,
    marginBottom: 24,
  },
  panel: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 24,
  },
  panelLabel: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: 4,
  },
  price: {
    color: colors.accent,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 12,
  },
  note: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  cta: {
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  ctaLabel: {
    color: colors.bg,
    fontWeight: '800',
    fontSize: 16,
  },
  error: {
    color: colors.danger,
    fontSize: 16,
  },
});
