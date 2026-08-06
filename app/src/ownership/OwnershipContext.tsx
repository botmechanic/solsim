import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { OwnedEsim } from '../../../shared/types';
import { useWallet } from '../wallet/WalletContext';
import { loadAllOwned, upsertOwned } from './storage';

type OwnershipContextValue = {
  esims: OwnedEsim[];
  loading: boolean;
  refresh: () => Promise<void>;
  addOwned: (esim: OwnedEsim) => Promise<void>;
  getByMint: (mint: string) => OwnedEsim | undefined;
};

const OwnershipContext = createContext<OwnershipContextValue | null>(null);

export function OwnershipProvider({ children }: { children: ReactNode }) {
  const { publicKey } = useWallet();
  const [all, setAll] = useState<OwnedEsim[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setAll(await loadAllOwned());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh().catch(() => undefined);
  }, [refresh]);

  const esims = useMemo(() => {
    if (!publicKey) {
      return [];
    }
    const owner = publicKey.toBase58();
    return all.filter(item => item.owner === owner && item.status === 'active');
  }, [all, publicKey]);

  const addOwned = useCallback(async (esim: OwnedEsim) => {
    const next = await upsertOwned(esim);
    setAll(next);
  }, []);

  const getByMint = useCallback(
    (mint: string) => all.find(item => item.mint === mint),
    [all],
  );

  const value = useMemo(
    () => ({ esims, loading, refresh, addOwned, getByMint }),
    [esims, loading, refresh, addOwned, getByMint],
  );

  return (
    <OwnershipContext.Provider value={value}>
      {children}
    </OwnershipContext.Provider>
  );
}

export function useOwnership(): OwnershipContextValue {
  const ctx = useContext(OwnershipContext);
  if (!ctx) {
    throw new Error('useOwnership must be used within OwnershipProvider');
  }
  return ctx;
}
