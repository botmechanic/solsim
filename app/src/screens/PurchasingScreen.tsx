import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PublicKey } from '@solana/web3.js';
import { getPlanById } from '../data/plansCatalog';
import { colors, fonts, radius, space, type } from '../theme/tokens';
import { formatLamportsAsSol } from '../lib/format';
import { isDemoSignature, solscanTxUrl } from '../lib/explorer';
import { destinationFor } from '../theme/destinations';
import { useWallet } from '../wallet/WalletContext';
import { useOwnership } from '../ownership/OwnershipContext';
import {
  purchaseEsim,
  purchaseEsimDemo,
  type PurchaseStep,
} from '../purchase/purchaseEsim';
import { Button } from '../components/ui/Button';
import { Screen } from '../components/ui/Screen';
import type { PlansStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<PlansStackParamList, 'Purchasing'>;

const STEPS: { id: PurchaseStep; label: string }[] = [
  { id: 'authorizing', label: 'Authorize wallet' },
  { id: 'signing', label: 'Sign payment' },
  { id: 'confirming', label: 'Confirm on-chain' },
  { id: 'provisioning', label: 'Provision profile' },
  { id: 'complete', label: 'Ready' },
];

function stepIndex(step: PurchaseStep | null): number {
  if (!step) {
    return -1;
  }
  return STEPS.findIndex(item => item.id === step);
}

export function PurchasingScreen({ navigation, route }: Props) {
  const plan = getPlanById(route.params.planId);
  const demoMode = Boolean(route.params.demoMode);
  const { publicKey, authToken, setSession, refreshBalance } = useWallet();
  const { addOwned } = useOwnership();
  const [step, setStep] = useState<PurchaseStep | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mint, setMint] = useState<string | null>(null);
  const [paymentSignature, setPaymentSignature] = useState<string | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!plan || started.current) {
      return;
    }
    started.current = true;

    (async () => {
      try {
        if (demoMode) {
          if (!publicKey) {
            throw new Error('Connect a wallet before running demo mode.');
          }
          const esim = await purchaseEsimDemo({
            plan,
            owner: publicKey.toBase58(),
            onProgress: setStep,
          });
          await addOwned(esim);
          setMint(esim.mint);
          setPaymentSignature(esim.paymentSignature);
          return;
        }

        const result = await purchaseEsim({
          plan,
          authToken,
          onProgress: setStep,
        });
        await setSession(new PublicKey(result.esim.owner), result.authToken);
        await addOwned(result.esim);
        await refreshBalance();
        setMint(result.esim.mint);
        setPaymentSignature(result.paymentSignature);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Purchase failed. Try again.';
        setError(message);
      }
    })();
  }, [
    plan,
    demoMode,
    publicKey,
    authToken,
    addOwned,
    setSession,
    refreshBalance,
  ]);

  if (!plan) {
    return (
      <Screen>
        <Text style={styles.error}>Plan not found.</Text>
      </Screen>
    );
  }

  const activeIdx = stepIndex(step);
  const done = Boolean(mint);
  const dest = destinationFor(plan.country);

  return (
    <Screen>
      <Text style={styles.kicker}>
        {demoMode ? 'Demo mode' : 'Live purchase'}
      </Text>
      <Text style={styles.title}>{dest.name}</Text>
      <Text style={styles.meta}>{formatLamportsAsSol(plan.priceLamports)}</Text>

      <View style={styles.panel}>
        {STEPS.map((item, index) => {
          const complete = done || index < activeIdx;
          const current = !done && index === activeIdx;
          return (
            <View key={item.id} style={styles.stepRow}>
              <View
                style={[
                  styles.dot,
                  complete && styles.dotDone,
                  current && styles.dotCurrent,
                ]}>
                {current ? (
                  <ActivityIndicator size="small" color={colors.accentText} />
                ) : (
                  <Text
                    style={[styles.dotText, complete && styles.dotTextDone]}>
                    {complete ? '✓' : index + 1}
                  </Text>
                )}
              </View>
              <Text
                style={[
                  styles.stepLabel,
                  (complete || current) && styles.stepLabelActive,
                ]}>
                {item.label}
              </Text>
            </View>
          );
        })}
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.error}>{error}</Text>
          <Text style={styles.hint}>
            Top up via the Solana faucet, then retry — or use Demo mode from the
            plan screen.
          </Text>
          <Button
            label="Open faucet"
            variant="secondary"
            onPress={() => Linking.openURL('https://faucet.solana.com')}
            style={styles.btnGap}
          />
          <Button
            label="Back"
            variant="ghost"
            onPress={() => navigation.goBack()}
          />
        </View>
      ) : null}

      {done ? (
        <View style={styles.successBox}>
          <Text style={styles.successTitle}>You’re the owner</Text>
          <Text style={styles.successBody}>
            Payment settled. Your QR is gated to this wallet — never written to
            public NFT metadata.
          </Text>
          <Button
            label="Reveal QR"
            onPress={() => {
              navigation.getParent()?.navigate('MyEsims', {
                screen: 'EsimQr',
                params: { mint },
              });
            }}
          />
          {paymentSignature && !isDemoSignature(paymentSignature) ? (
            <Button
              label="View payment on Solscan"
              variant="secondary"
              onPress={() => Linking.openURL(solscanTxUrl(paymentSignature))}
              style={styles.btnGap}
            />
          ) : null}
          <Button
            label="My eSIMs"
            variant="secondary"
            onPress={() =>
              navigation.getParent()?.navigate('MyEsims', {
                screen: 'MyEsimsList',
              })
            }
            style={styles.btnGap}
          />
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: {
    ...type.label,
    color: colors.accent,
    marginBottom: space.sm,
  },
  title: {
    ...type.title,
    color: colors.text,
  },
  meta: {
    ...type.body,
    color: colors.textSecondary,
    marginBottom: space.xl,
    marginTop: space.sm,
  },
  panel: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: space.xl,
    gap: space.lg,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotDone: {
    backgroundColor: colors.accentMuted,
    borderColor: colors.accent,
  },
  dotCurrent: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  dotText: {
    color: colors.textTertiary,
    fontFamily: fonts.bodySemi,
    fontSize: 11,
  },
  dotTextDone: {
    color: colors.accent,
  },
  stepLabel: {
    ...type.body,
    color: colors.textTertiary,
  },
  stepLabelActive: {
    color: colors.text,
    fontFamily: fonts.bodySemi,
  },
  errorBox: {
    marginTop: space.xl,
    gap: space.md,
  },
  error: {
    color: colors.danger,
    ...type.bodyStrong,
  },
  hint: {
    ...type.caption,
    color: colors.textSecondary,
  },
  successBox: {
    marginTop: space.xl,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: space.xl,
    gap: space.md,
  },
  successTitle: {
    ...type.headline,
    color: colors.accent,
  },
  successBody: {
    ...type.caption,
    color: colors.textSecondary,
    marginBottom: space.sm,
  },
  btnGap: {
    marginTop: space.sm,
  },
});
