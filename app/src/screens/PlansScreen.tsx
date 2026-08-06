import { FlatList, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PlanCard } from '../components/PlanCard';
import { ConnectWalletButton } from '../components/ConnectWalletButton';
import { MOCK_PLANS } from '../data/mockPlans';
import { colors } from '../theme/colors';
import type { PlansStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<PlansStackParamList, 'PlansList'>;

export function PlansScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>Solsim</Text>
          <Text style={styles.subtitle}>eSIM plans on Solana devnet</Text>
        </View>
        <ConnectWalletButton compact />
      </View>
      <FlatList
        data={MOCK_PLANS}
        keyExtractor={item => item.planId}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <PlanCard
            plan={item}
            onPress={() =>
              navigation.navigate('PlanDetail', { planId: item.planId })
            }
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  list: {
    padding: 20,
    paddingTop: 12,
  },
});
