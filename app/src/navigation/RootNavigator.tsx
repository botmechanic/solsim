import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';
import { PlansScreen } from '../screens/PlansScreen';
import { PlanDetailScreen } from '../screens/PlanDetailScreen';
import { MyEsimsScreen } from '../screens/MyEsimsScreen';
import { WalletScreen } from '../screens/WalletScreen';
import { colors } from '../theme/colors';
import type { PlansStackParamList, RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();
const PlansStack = createNativeStackNavigator<PlansStackParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    primary: colors.accent,
  },
};

function PlansStackNavigator() {
  return (
    <PlansStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        contentStyle: { backgroundColor: colors.bg },
      }}>
      <PlansStack.Screen
        name="PlansList"
        component={PlansScreen}
        options={{ headerShown: false }}
      />
      <PlansStack.Screen
        name="PlanDetail"
        component={PlanDetailScreen}
        options={{ title: 'Plan' }}
      />
    </PlansStack.Navigator>
  );
}

function TabLabel({
  label,
  focused,
}: {
  label: string;
  focused: boolean;
}) {
  return (
    <Text
      style={{
        color: focused ? colors.accent : colors.tabInactive,
        fontSize: 12,
        fontWeight: focused ? '700' : '500',
      }}>
      {label}
    </Text>
  );
}

export function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
          },
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.tabInactive,
        }}>
        <Tab.Screen
          name="Plans"
          component={PlansStackNavigator}
          options={{
            tabBarLabel: ({ focused }) => (
              <TabLabel label="Plans" focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="MyEsims"
          component={MyEsimsScreen}
          options={{
            title: 'My eSIMs',
            tabBarLabel: ({ focused }) => (
              <TabLabel label="My eSIMs" focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="Wallet"
          component={WalletScreen}
          options={{
            tabBarLabel: ({ focused }) => (
              <TabLabel label="Wallet" focused={focused} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
