import { StyleSheet, Text, View } from 'react-native';
import { ConnectWalletButton } from '../components/ConnectWalletButton';
import { colors } from '../theme/colors';
import { useWallet } from '../wallet/WalletContext';

export function MyEsimsScreen() {
  const { publicKey } = useWallet();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My eSIMs</Text>
      {!publicKey ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Connect to see ownership</Text>
          <Text style={styles.emptyBody}>
            On-chain NFT ownership is the source of truth. Connect a wallet to
            load your Solsim eSIMs.
          </Text>
          <ConnectWalletButton />
        </View>
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No eSIMs yet</Text>
          <Text style={styles.emptyBody}>
            After a purchase, minted Solsim NFTs for this wallet will appear
            here. QR reveal comes next.
          </Text>
        </View>
      )}
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
    marginBottom: 20,
  },
  empty: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    gap: 12,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  emptyBody: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
});
