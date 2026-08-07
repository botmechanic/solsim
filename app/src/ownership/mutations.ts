import type { MarketplaceListing, OwnedEsim } from '../../../shared/types';
import { loadAllOwned, saveAllOwned, upsertOwned } from './storage';

function withDefaults(esim: OwnedEsim): OwnedEsim {
  const dataRemainingMb =
    typeof esim.dataRemainingMb === 'number' && esim.dataRemainingMb > 0
      ? esim.dataRemainingMb
      : Math.max(1024, Math.round(esim.dataMb * 0.6));
  return { ...esim, dataRemainingMb };
}

export async function loadOwnedNormalized(): Promise<OwnedEsim[]> {
  const all = await loadAllOwned();
  return all.map(withDefaults);
}

export { upsertOwned, saveAllOwned };

export async function markListed(
  mint: string,
  listingId: string,
): Promise<OwnedEsim[]> {
  const all = await loadOwnedNormalized();
  const next = all.map(item =>
    item.mint === mint
      ? { ...item, status: 'listed' as const, listingId }
      : item,
  );
  await saveAllOwned(next);
  return next;
}

export type { MarketplaceListing };
