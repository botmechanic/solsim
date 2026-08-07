import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { EsimPlan } from '../../../shared/types';
import { PlanCard } from '../components/PlanCard';
import { ConnectWalletButton } from '../components/ConnectWalletButton';
import { loadPlans } from '../data/plansCatalog';
import { colors, space, type } from '../theme/tokens';
import type { PlansStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<PlansStackParamList, 'PlansList'>;

export function PlansScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [plans, setPlans] = useState<EsimPlan[]>([]);
  const [source, setSource] = useState<'api' | 'mock' | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async (force = false) => {
    setLoading(true);
    try {
      const result = await loadPlans(force);
      setPlans(result.plans);
      setSource(result.source);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh(false).catch(() => undefined);
    }, [refresh]),
  );

  return (
    <View
      style={[
        styles.container,
        { paddingTop: Math.max(insets.top, space.lg) },
      ]}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.brand}>Solsim</Text>
          <ConnectWalletButton compact />
        </View>
        <Text style={styles.tagline}>
          Travel eSIMs you own on Solana. Pay with your wallet. Reveal the QR
          only while you hold it.
        </Text>
        {source ? (
          <View
            style={[
              styles.sourcePill,
              source === 'api' ? styles.sourceLive : styles.sourceOffline,
            ]}>
            <View
              style={[
                styles.sourceDot,
                source === 'api' ? styles.dotLive : styles.dotOffline,
              ]}
            />
            <Text style={styles.sourceText}>
              {source === 'api' ? 'Live API' : 'Offline catalog'} · Devnet
            </Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.section}>Plans</Text>

      {loading && plans.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : (
        <FlatList
          data={plans}
          keyExtractor={item => item.planId}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => refresh(true)}
              tintColor={colors.accent}
            />
          }
          contentContainerStyle={[
            styles.list,
            plans.length === 0 && styles.flexGrow,
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No plans</Text>
              <Text style={styles.emptyBody}>
                Pull to refresh, or start the API (`cd api && npm run dev`).
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <PlanCard
              plan={item}
              onPress={() =>
                navigation.navigate('PlanDetail', { planId: item.planId })
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
  },
  header: {
    paddingHorizontal: space.xl,
    paddingBottom: space.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: space.md,
  },
  brand: {
    ...type.brand,
    color: colors.text,
  },
  tagline: {
    ...type.body,
    color: colors.textSecondary,
    maxWidth: 340,
  },
  sourcePill: {
    marginTop: space.md,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: 999,
    borderWidth: 1,
  },
  sourceLive: {
    backgroundColor: colors.accentMuted,
    borderColor: colors.accentDim,
  },
  sourceOffline: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  sourceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotLive: {
    backgroundColor: colors.accent,
  },
  dotOffline: {
    backgroundColor: colors.textTertiary,
  },
  sourceText: {
    ...type.caption,
    color: colors.textSecondary,
  },
  section: {
    ...type.label,
    color: colors.textTertiary,
    paddingHorizontal: space.xl,
    paddingTop: space.xl,
    paddingBottom: space.md,
  },
  list: {
    paddingHorizontal: space.xl,
    paddingBottom: space.xxxl,
  },
  flexGrow: {
    flexGrow: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    paddingVertical: space.xl,
  },
  emptyTitle: {
    ...type.headline,
    color: colors.text,
    marginBottom: space.sm,
  },
  emptyBody: {
    ...type.caption,
    color: colors.textSecondary,
  },
});
