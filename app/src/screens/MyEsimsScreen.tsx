import { useCallback } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ConnectWalletButton } from '../components/ConnectWalletButton';
import { EsimCard } from '../components/EsimCard';
import { Button } from '../components/ui/Button';
import { colors, radius, space, type } from '../theme/tokens';
import { useWallet } from '../wallet/WalletContext';
import { useOwnership } from '../ownership/OwnershipContext';
import type { MyEsimsStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<MyEsimsStackParamList, 'MyEsimsList'>;

export function MyEsimsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { publicKey } = useWallet();
  const { esims, loading, refresh } = useOwnership();

  const onRefresh = useCallback(() => {
    refresh().catch(() => undefined);
  }, [refresh]);

  return (
    <View
      style={[
        styles.container,
        { paddingTop: Math.max(insets.top, space.lg) },
      ]}>
      <Text style={styles.title}>My eSIMs</Text>
      <Text style={styles.subtitle}>
        Wallet-bound ownership. QR never appears in public metadata.
      </Text>
      <Button
        label="How to install"
        variant="ghost"
        onPress={() => navigation.navigate('InstallGuide')}
        style={styles.guide}
      />

      {!publicKey ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Connect to continue</Text>
          <Text style={styles.emptyBody}>
            Purchases for the connected wallet appear here.
          </Text>
          <ConnectWalletButton />
        </View>
      ) : (
        <FlatList
          data={esims}
          keyExtractor={item => item.mint}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={onRefresh}
              tintColor={colors.accent}
            />
          }
          contentContainerStyle={[
            styles.list,
            esims.length === 0 && styles.flexGrow,
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No eSIMs yet</Text>
              <Text style={styles.emptyBody}>
                Buy a plan — your owned profile will show here for QR reveal.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <EsimCard
              esim={item}
              onPress={() =>
                navigation.navigate('EsimQr', { mint: item.mint })
              }
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: space.xl,
  },
  title: {
    ...type.title,
    color: colors.text,
    marginBottom: space.sm,
  },
  subtitle: {
    ...type.caption,
    color: colors.textSecondary,
    marginBottom: space.sm,
  },
  guide: {
    alignSelf: 'flex-start',
    marginBottom: space.lg,
  },
  list: {
    paddingBottom: space.xxxl,
  },
  flexGrow: {
    flexGrow: 1,
  },
  empty: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: space.xl,
    gap: space.md,
  },
  emptyTitle: {
    ...type.headline,
    color: colors.text,
  },
  emptyBody: {
    ...type.caption,
    color: colors.textSecondary,
    marginBottom: space.sm,
  },
});
