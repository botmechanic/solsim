import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getPlanById } from '../data/plansCatalog';
import { colors, space, type } from '../theme/tokens';
import { destinationFor } from '../theme/destinations';
import {
  formatDataMb,
  formatLamportsAsSol,
} from '../lib/format';
import { useWallet } from '../wallet/WalletContext';
import { Button } from '../components/ui/Button';
import { Screen } from '../components/ui/Screen';
import type { PlansStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<PlansStackParamList, 'PlanDetail'>;

const FEE_BUFFER_LAMPORTS = 5000;

export function PlanDetailScreen({ navigation, route }: Props) {
  const plan = getPlanById(route.params.planId);
  const { publicKey, connect, balanceLamports } = useWallet();
  const [busy, setBusy] = useState(false);

  if (!plan) {
    return (
      <Screen>
        <Text style={styles.error}>Plan not found.</Text>
      </Screen>
    );
  }

  const dest = destinationFor(plan.country);
  const price = Number(plan.priceLamports);
  const canAfford =
    balanceLamports !== null
      ? balanceLamports >= price + FEE_BUFFER_LAMPORTS
      : true;

  const ensureWallet = async (): Promise<boolean> => {
    if (publicKey) {
      return true;
    }
    setBusy(true);
    try {
      return await connect();
    } finally {
      setBusy(false);
    }
  };

  const onBuy = async () => {
    const ok = await ensureWallet();
    if (!ok) {
      return;
    }
    if (balanceLamports !== null && !canAfford) {
      Alert.alert(
        'Need more SOL',
        'Top up devnet SOL for purchase + fees, or use Demo mode.',
      );
      return;
    }
    navigation.navigate('Purchasing', { planId: plan.planId });
  };

  const onDemo = async () => {
    if (!publicKey) {
      Alert.alert(
        'Connect wallet',
        'Demo mode still binds the eSIM to a wallet.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Connect', onPress: () => connect() },
        ],
      );
      return;
    }
    navigation.navigate('Purchasing', { planId: plan.planId, demoMode: true });
  };

  return (
    <Screen style={styles.flex}>
      <View style={styles.codeBox}>
        <Text style={styles.code}>{plan.country}</Text>
      </View>
      <Text style={styles.title}>{dest.name}</Text>
      <Text style={styles.meta}>
        {formatDataMb(plan.dataMb)} · {plan.validityDays}-day validity
      </Text>

      <View style={styles.priceBlock}>
        <Text style={styles.priceLabel}>Total before you sign</Text>
        <Text style={styles.price}>
          {formatLamportsAsSol(plan.priceLamports)}
        </Text>

        <View style={styles.breakdown}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Plan (to treasury)</Text>
            <Text style={styles.rowValue}>
              {formatLamportsAsSol(plan.priceLamports)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Network fee (estimate)</Text>
            <Text style={styles.rowValue}>
              ~{formatLamportsAsSol(String(FEE_BUFFER_LAMPORTS))}
            </Text>
          </View>
          <View style={[styles.row, styles.rowTotal]}>
            <Text style={styles.totalLabel}>You authorize</Text>
            <Text style={styles.totalValue}>
              {formatLamportsAsSol(plan.priceLamports)} + fees
            </Text>
          </View>
        </View>

        <Text style={styles.note}>
          Sign with Mobile Wallet Adapter. The profile QR stays off-chain —
          only this wallet can reveal it.
        </Text>
      </View>

      <View style={styles.spacer} />

      <Button
        label={publicKey ? 'Buy with SOL' : 'Connect & buy'}
        onPress={onBuy}
        loading={busy}
      />
      <Button
        label="Demo mode"
        variant="secondary"
        onPress={onDemo}
        style={styles.demo}
      />
      <Text style={styles.fine}>
        Demo still needs a connected wallet, then skips payment/mint. Prefer
        Buy with SOL when faucet + API are healthy.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  codeBox: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space.lg,
  },
  code: {
    ...type.label,
    color: colors.text,
  },
  title: {
    ...type.hero,
    color: colors.text,
  },
  meta: {
    ...type.body,
    color: colors.textSecondary,
    marginTop: space.sm,
    marginBottom: space.xxl,
  },
  priceBlock: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    paddingVertical: space.xl,
  },
  priceLabel: {
    ...type.label,
    color: colors.textTertiary,
    marginBottom: space.sm,
  },
  price: {
    ...type.hero,
    color: colors.text,
    marginBottom: space.lg,
  },
  breakdown: {
    marginBottom: space.lg,
    gap: space.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowTotal: {
    marginTop: space.sm,
    paddingTop: space.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  rowLabel: {
    ...type.caption,
    color: colors.textSecondary,
  },
  rowValue: {
    ...type.caption,
    color: colors.text,
    fontFamily: type.bodyStrong.fontFamily,
  },
  totalLabel: {
    ...type.bodyStrong,
    color: colors.text,
  },
  totalValue: {
    ...type.bodyStrong,
    color: colors.accent,
  },
  note: {
    ...type.caption,
    color: colors.textSecondary,
  },
  spacer: {
    flex: 1,
    minHeight: space.xxl,
  },
  demo: {
    marginTop: space.md,
  },
  fine: {
    ...type.caption,
    color: colors.textTertiary,
    marginTop: space.lg,
    textAlign: 'center',
  },
  error: {
    color: colors.danger,
    ...type.body,
  },
});
