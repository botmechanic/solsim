import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { Alert, Linking } from 'react-native';
import { PublicKey } from '@solana/web3.js';
import {
  transact,
  type Web3MobileWallet,
} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import { toByteArray } from 'react-native-quick-base64';
import { APP_IDENTITY, SOLANA_CHAIN } from '../config/identity';
import { connection } from '../config/solana';
import {
  clearAuthorization,
  loadAuthorization,
  saveAuthorization,
} from './authorizationStorage';

const PHANTOM_PLAY_STORE =
  'https://play.google.com/store/apps/details?id=app.phantom';

type WalletContextValue = {
  publicKey: PublicKey | null;
  connecting: boolean;
  balanceLamports: number | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  refreshBalance: () => Promise<void>;
};

const WalletContext = createContext<WalletContextValue | null>(null);

function accountAddressToPublicKey(address: string): PublicKey {
  return new PublicKey(toByteArray(address));
}

function isNoWalletError(error: unknown): boolean {
  const message =
    error instanceof Error ? error.message.toLowerCase() : String(error);
  return (
    message.includes('no wallet') ||
    message.includes('not found') ||
    message.includes('activity not found') ||
    message.includes('no activity')
  );
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [balanceLamports, setBalanceLamports] = useState<number | null>(null);

  const refreshBalance = useCallback(async () => {
    if (!publicKey) {
      setBalanceLamports(null);
      return;
    }
    try {
      const balance = await connection.getBalance(publicKey, 'confirmed');
      setBalanceLamports(balance);
    } catch {
      setBalanceLamports(null);
    }
  }, [publicKey]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = await loadAuthorization();
      if (!stored || cancelled) {
        return;
      }
      try {
        setConnecting(true);
        const result = await transact(async (wallet: Web3MobileWallet) => {
          return wallet.authorize({
            chain: SOLANA_CHAIN,
            identity: APP_IDENTITY,
            auth_token: stored.authToken,
          });
        });
        if (cancelled) {
          return;
        }
        const pubkey = accountAddressToPublicKey(result.accounts[0].address);
        setPublicKey(pubkey);
        setAuthToken(result.auth_token);
        await saveAuthorization({
          authToken: result.auth_token,
          publicKey: pubkey.toBase58(),
        });
      } catch {
        await clearAuthorization();
        if (!cancelled) {
          setPublicKey(null);
          setAuthToken(null);
        }
      } finally {
        if (!cancelled) {
          setConnecting(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    refreshBalance().catch(() => undefined);
  }, [refreshBalance]);

  const connect = useCallback(async () => {
    setConnecting(true);
    try {
      const result = await transact(async (wallet: Web3MobileWallet) => {
        return wallet.authorize({
          chain: SOLANA_CHAIN,
          identity: APP_IDENTITY,
          auth_token: authToken ?? undefined,
        });
      });
      const pubkey = accountAddressToPublicKey(result.accounts[0].address);
      setPublicKey(pubkey);
      setAuthToken(result.auth_token);
      await saveAuthorization({
        authToken: result.auth_token,
        publicKey: pubkey.toBase58(),
      });
    } catch (error) {
      if (isNoWalletError(error)) {
        Alert.alert(
          'Wallet required',
          'Install Phantom (or another MWA wallet) to use Solsim.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Install Phantom',
              onPress: () => {
                Linking.openURL(PHANTOM_PLAY_STORE).catch(() => undefined);
              },
            },
          ],
        );
      } else {
        const message =
          error instanceof Error ? error.message : 'Could not connect wallet.';
        Alert.alert('Connection failed', message);
      }
    } finally {
      setConnecting(false);
    }
  }, [authToken]);

  const disconnect = useCallback(async () => {
    const token = authToken;
    setPublicKey(null);
    setAuthToken(null);
    setBalanceLamports(null);
    await clearAuthorization();
    if (!token) {
      return;
    }
    try {
      await transact(async (wallet: Web3MobileWallet) => {
        await wallet.deauthorize({ auth_token: token });
      });
    } catch {
      // Local disconnect still succeeded.
    }
  }, [authToken]);

  const value = useMemo(
    () => ({
      publicKey,
      connecting,
      balanceLamports,
      connect,
      disconnect,
      refreshBalance,
    }),
    [
      publicKey,
      connecting,
      balanceLamports,
      connect,
      disconnect,
      refreshBalance,
    ],
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWallet(): WalletContextValue {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return ctx;
}
