import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, radius, space, type } from '../theme/tokens';
import type { MyEsimsStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<MyEsimsStackParamList, 'InstallGuide'>;

const STEPS = [
  {
    title: 'Reveal the QR',
    body: 'Open My eSIMs → your plan → Reveal. Only the owning wallet can see the LPA payload.',
  },
  {
    title: 'Open Android eSIM settings',
    body: 'Settings → Network & internet → SIMs / Mobile network → Download a SIM instead / Add eSIM.',
  },
  {
    title: 'Scan the QR',
    body: 'Use “Scan QR code” and point the camera at Solsim’s owner-only QR.',
  },
  {
    title: 'Enable the line',
    body: 'After download, turn the eSIM on and prefer it for mobile data when traveling.',
  },
];

export function InstallGuideScreen(_props: Props) {
  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <Text style={styles.kicker}>Setup</Text>
      <Text style={styles.title}>Install your eSIM</Text>
      <Text style={styles.lede}>
        Production flow on Android. Tonight’s QR is a mock LPA profile — walk
        judges through the steps; don’t claim live cellular yet.
      </Text>

      {STEPS.map((step, index) => (
        <View key={step.title} style={styles.step}>
          <Text style={styles.num}>{String(index + 1).padStart(2, '0')}</Text>
          <View style={styles.stepBody}>
            <Text style={styles.stepTitle}>{step.title}</Text>
            <Text style={styles.stepText}>{step.body}</Text>
          </View>
        </View>
      ))}

      <View style={styles.callout}>
        <Text style={styles.calloutTitle}>Ownership model</Text>
        <Text style={styles.calloutBody}>
          Transfer the NFT and the new owner is the only wallet that can reveal
          the QR. That’s the product — not the mock activation code.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: space.xl,
    paddingBottom: space.xxxl,
  },
  kicker: {
    ...type.label,
    color: colors.accent,
    marginBottom: space.sm,
  },
  title: {
    ...type.title,
    color: colors.text,
  },
  lede: {
    ...type.body,
    color: colors.textSecondary,
    marginTop: space.sm,
    marginBottom: space.xxl,
  },
  step: {
    flexDirection: 'row',
    gap: space.md,
    marginBottom: space.xl,
  },
  num: {
    ...type.label,
    color: colors.accent,
    width: 28,
    marginTop: 2,
  },
  stepBody: {
    flex: 1,
  },
  stepTitle: {
    ...type.headline,
    color: colors.text,
    marginBottom: space.xs,
  },
  stepText: {
    ...type.caption,
    color: colors.textSecondary,
  },
  callout: {
    marginTop: space.md,
    padding: space.xl,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  calloutTitle: {
    ...type.label,
    color: colors.textTertiary,
    marginBottom: space.sm,
  },
  calloutBody: {
    ...type.caption,
    color: colors.textSecondary,
  },
});
