/**
 * Solsim — Solana Mobile eSIM hackathon app
 * MWA: https://docs.solanamobile.com/get-started/react-native/invoke-mwa-sessions-directly
 * @format
 */

import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { WalletProvider } from './src/wallet/WalletContext';
import { colors } from './src/theme/colors';

function App() {
  return (
    <SafeAreaProvider>
      <WalletProvider>
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
        <RootNavigator />
      </WalletProvider>
    </SafeAreaProvider>
  );
}

export default App;
