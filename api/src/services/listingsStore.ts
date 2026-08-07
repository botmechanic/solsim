import { Keypair, PublicKey } from '@solana/web3.js';
import type { CountryCode, MarketplaceListing } from '../types.js';
import { ApiError } from '../middleware/errors.js';
import { getConnection } from './verifyPayment.js';
import { getEscrowPubkey } from './escrow.js';

export type ListingRecord = MarketplaceListing & {
  iccid: string;
  qrPayload: string;
  soldTo?: string;
  paymentSignature?: string;
};

const byId = new Map<string, ListingRecord>();

function publicView(record: ListingRecord): MarketplaceListing {
  return {
    listingId: record.listingId,
    mint: record.mint,
    seller: record.seller,
    priceLamports: record.priceLamports,
    country: record.country,
    dataMb: record.dataMb,
    dataRemainingMb: record.dataRemainingMb,
    planId: record.planId,
    validUntil: record.validUntil,
    status: record.status,
    createdAt: record.createdAt,
    demo: record.demo,
  };
}

export function listActiveListings(): MarketplaceListing[] {
  return [...byId.values()]
    .filter(item => item.status === 'active')
    .map(publicView)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getListing(listingId: string): ListingRecord | undefined {
  return byId.get(listingId);
}

export function upsertListing(record: ListingRecord): MarketplaceListing {
  byId.set(record.listingId, record);
  return publicView(record);
}

/** True when escrow ATA holds exactly 1 token of mint. */
export async function escrowHoldsMint(mint: string): Promise<boolean> {
  const connection = getConnection();
  const escrow = getEscrowPubkey();
  let mintKey: PublicKey;
  try {
    mintKey = new PublicKey(mint);
  } catch {
    return false;
  }
  const accounts = await connection.getParsedTokenAccountsByOwner(escrow, {
    mint: mintKey,
  });
  for (const { account } of accounts.value) {
    const amount = account.data.parsed?.info?.tokenAmount?.amount;
    if (amount === '1') {
      return true;
    }
  }
  return false;
}

export function assertSeller(record: ListingRecord, seller: string): void {
  if (record.seller !== seller) {
    throw new ApiError('UNAUTHORIZED', 'Seller mismatch.', 403, false);
  }
}

/** Seed one soft listing so Marketplace isn’t empty on cold open. */
export function seedDemoListing(): void {
  if (byId.size > 0) {
    return;
  }
  const mint = Keypair.generate().publicKey.toBase58();
  const seller = Keypair.generate().publicKey.toBase58();
  const country: CountryCode = 'FR';
  upsertListing({
    listingId: 'seed-leftover-fr',
    mint,
    seller,
    priceLamports: '6000000',
    country,
    dataMb: 10240,
    dataRemainingMb: 6144,
    planId: 'mock_fr_10gb_30d',
    validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    createdAt: new Date().toISOString(),
    demo: true,
    iccid: '8901999999999999999',
    qrPayload: 'LPA:1$mock.solsim.so$SEEDDEMO01',
  });
}
