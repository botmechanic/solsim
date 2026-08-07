import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text } from 'react-native';
import { PlansScreen } from '../screens/PlansScreen';
import { PlanDetailScreen } from '../screens/PlanDetailScreen';
import { PurchasingScreen } from '../screens/PurchasingScreen';
import { MyEsimsScreen } from '../screens/MyEsimsScreen';
import { EsimQrScreen } from '../screens/EsimQrScreen';
import { InstallGuideScreen } from '../screens/InstallGuideScreen';
import { SellLeftoverScreen } from '../screens/SellLeftoverScreen';
import { MarketplaceScreen } from '../screens/MarketplaceScreen';
import { ListingDetailScreen } from '../screens/ListingDetailScreen';
import { WalletScreen } from '../screens/WalletScreen';
import { colors, fonts, space } from '../theme/tokens';
import {
  EsimsTabIcon,
  MarketTabIcon,
  PlansTabIcon,
  WalletTabIcon,
} from './TabIcons';
import type {
  MarketplaceStackParamList,
  MyEsimsStackParamList,
  PlansStackParamList,
  RootTabParamList,
} from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();
const PlansStack = createNativeStackNavigator<PlansStackParamList>();
const MyEsimsStack = createNativeStackNavigator<MyEsimsStackParamList>();
const MarketStack = createNativeStackNavigator<MarketplaceStackParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
    card: colors.bg,
    text: colors.text,
    border: colors.border,
    primary: colors.accent,
  },
};

const stackScreenOptions = {
  headerStyle: {
    backgroundColor: colors.bg,
  },
  headerShadowVisible: false,
  headerTintColor: colors.text,
  headerTitleStyle: {
    fontFamily: fonts.bodySemi,
    fontSize: 16,
  },
  contentStyle: { backgroundColor: colors.bg },
};

function MarketplaceStackNavigator() {
  return (
    <MarketStack.Navigator screenOptions={stackScreenOptions}>
      <MarketStack.Screen
        name="MarketplaceList"
        component={MarketplaceScreen}
        options={{ headerShown: false }}
      />
      <MarketStack.Screen
        name="ListingDetail"
        component={ListingDetailScreen}
        options={{ title: 'Leftover' }}
      />
    </MarketStack.Navigator>
  );
}

function PlansStackNavigator() {
  return (
    <PlansStack.Navigator screenOptions={stackScreenOptions}>
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
      <PlansStack.Screen
        name="Purchasing"
        component={PurchasingScreen}
        options={{ title: 'Provisioning', headerBackVisible: false }}
      />
    </PlansStack.Navigator>
  );
}

function MyEsimsStackNavigator() {
  return (
    <MyEsimsStack.Navigator screenOptions={stackScreenOptions}>
      <MyEsimsStack.Screen
        name="MyEsimsList"
        component={MyEsimsScreen}
        options={{ headerShown: false }}
      />
      <MyEsimsStack.Screen
        name="EsimQr"
        component={EsimQrScreen}
        options={{ title: 'Reveal' }}
      />
      <MyEsimsStack.Screen
        name="InstallGuide"
        component={InstallGuideScreen}
        options={{ title: 'Install' }}
      />
      <MyEsimsStack.Screen
        name="SellLeftover"
        component={SellLeftoverScreen}
        options={{ title: 'Sell leftover' }}
      />
    </MyEsimsStack.Navigator>
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
    <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
      {label}
    </Text>
  );
}

export function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        initialRouteName="Plans"
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.tabInactive,
        }}>
        <Tab.Screen
          name="Plans"
          component={PlansStackNavigator}
          options={{
            tabBarIcon: ({ focused }) => <PlansTabIcon focused={focused} />,
            tabBarLabel: ({ focused }) => (
              <TabLabel label="Plans" focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="Marketplace"
          component={MarketplaceStackNavigator}
          options={{
            tabBarIcon: ({ focused }) => <MarketTabIcon focused={focused} />,
            tabBarLabel: ({ focused }) => (
              <TabLabel label="Market" focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="MyEsims"
          component={MyEsimsStackNavigator}
          options={{
            title: 'My eSIMs',
            tabBarIcon: ({ focused }) => <EsimsTabIcon focused={focused} />,
            tabBarLabel: ({ focused }) => (
              <TabLabel label="My eSIMs" focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="Wallet"
          component={WalletScreen}
          options={{
            tabBarIcon: ({ focused }) => <WalletTabIcon focused={focused} />,
            tabBarLabel: ({ focused }) => (
              <TabLabel label="Wallet" focused={focused} />
            ),
          }}
        />      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.bg,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    height: 64,
    paddingTop: space.sm,
    paddingBottom: space.sm,
  },
  tabLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    color: colors.tabInactive,
    marginTop: 2,
  },
  tabLabelActive: {
    color: colors.text,
  },
});
