import { useEffect } from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import QRCode from 'react-native-qrcode-svg';
import { colors, radius, space, type } from '../theme/tokens';
import { destinationFor } from '../theme/destinations';
import { formatDataMb, truncatePubkey } from '../lib/format';
import { isDemoSignature, solscanTokenUrl, solscanTxUrl } from '../lib/explorer';
import { setSecureScreen } from '../native/secureScreen';
import { useWallet } from '../wallet/WalletContext';
import { useOwnership } from '../ownership/OwnershipContext';
import { Button } from '../components/ui/Button';
import type { MyEsimsStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<MyEsimsStackParamList, 'EsimQr'>;

export function EsimQrScreen({ navigation, route }: Props) {
  const { publicKey } = useWallet();
  const { getByMint } = useOwnership();
  const esim = getByMint(route.params.mint);

  useEffect(() => {
    setSecureScreen(true);
    return () => setSecureScreen(false);
  }, []);

  useEffect(() => {
    if (!esim) {
      Alert.alert('Not found', 'This eSIM is not in your vault.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
      return;
    }
    if (!publicKey || publicKey.toBase58() !== esim.owner) {
      Alert.alert('Not the owner', 'QR is only revealed to the owning wallet.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }
  }, [esim, publicKey, navigation]);

  if (!esim || !publicKey || publicKey.toBase58() !== esim.owner) {
    return <View style={styles.root} />;
  }

  const dest = destinationFor(esim.country);

  const onSharePayload = () => {
    Share.share({
      message: esim.qrPayload,
      title: 'Solsim eSIM LPA',
    }).catch(() => undefined);
  };

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <Text style={styles.kicker}>Owner-only</Text>
      <Text style={styles.title}>{dest.name}</Text>
      <Text style={styles.meta}>
        {formatDataMb(esim.dataMb)} · {esim.iccid}
      </Text>

      <View style={styles.qrWrap}>
        <QRCode
          value={esim.qrPayload}
          size={216}
          backgroundColor={colors.white}
          color={colors.bg}
        />
      </View>

      <View style={styles.panel}>
        <Text style={styles.label}>LPA payload</Text>
        <Text style={styles.payload} selectable>
          {esim.qrPayload}
        </Text>
        <Text style={[styles.label, styles.spaced]}>Mint</Text>
        <Text style={styles.mono}>{truncatePubkey(esim.mint, 8, 8)}</Text>
        <Text style={[styles.label, styles.spaced]}>Payment</Text>
        <Text style={styles.mono}>
          {truncatePubkey(esim.paymentSignature, 8, 8)}
        </Text>
      </View>

      <Button
        label="Share LPA string"
        variant="secondary"
        onPress={onSharePayload}
        style={styles.action}
      />
      <Button
        label="Install steps"
        variant="secondary"
        onPress={() => navigation.navigate('InstallGuide')}
        style={styles.action}
      />
      {!isDemoSignature(esim.paymentSignature) ? (
        <>
          <Button
            label="View NFT on Solscan"
            variant="secondary"
            onPress={() => Linking.openURL(solscanTokenUrl(esim.mint))}
            style={styles.action}
          />
          <Button
            label="Payment on Solscan"
            variant="ghost"
            onPress={() => Linking.openURL(solscanTxUrl(esim.paymentSignature))}
            style={styles.action}
          />
        </>
      ) : null}

      <Text style={styles.warning}>
        {isDemoSignature(esim.paymentSignature)
          ? 'Mock profile for demo — same ownership model as production. Not a live cellular install.'
          : 'Mock cellular QR + real NFT on devnet. Check Phantom Collectibles. Not a live cellular install.'}
      </Text>
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
  meta: {
    ...type.caption,
    color: colors.textSecondary,
    marginTop: space.sm,
    marginBottom: space.xxl,
  },
  qrWrap: {
    alignSelf: 'center',
    backgroundColor: colors.white,
    padding: space.lg,
    borderRadius: radius.lg,
    marginBottom: space.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  panel: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: space.xl,
  },
  label: {
    ...type.label,
    color: colors.textTertiary,
  },
  spaced: {
    marginTop: space.lg,
  },
  payload: {
    ...type.bodyStrong,
    color: colors.text,
    marginTop: space.sm,
  },
  mono: {
    ...type.bodyStrong,
    color: colors.accent,
    fontSize: 14,
    marginTop: space.sm,
  },
  action: {
    marginTop: space.md,
  },
  warning: {
    ...type.caption,
    color: colors.warning,
    marginTop: space.xl,
    textAlign: 'center',
  },
});
