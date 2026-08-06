/**
 * Solsim — Solana Mobile eSIM hackathon app
 * MWA: https://docs.solanamobile.com/get-started/react-native/invoke-mwa-sessions-directly
 * @format
 */

import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { WalletProvider } from './src/wallet/WalletContext';
import { OwnershipProvider } from './src/ownership/OwnershipContext';
import { colors } from './src/theme/tokens';

function App() {
  return (
    <SafeAreaProvider>
      <WalletProvider>
        <OwnershipProvider>
          <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
          <RootNavigator />
        </OwnershipProvider>
      </WalletProvider>
    </SafeAreaProvider>
  );
}

export default App;
