import type { MarketplaceListing, OwnedEsim } from '../../../shared/types';
import { API_BASE_URL } from '../config/api';

export type MarketplaceConfig = { escrowPubkey: string };

export async function fetchMarketplaceConfig(): Promise<MarketplaceConfig> {
  const res = await fetch(`${API_BASE_URL}/v1/marketplace/config`);
  if (!res.ok) {
    throw new Error('Could not load marketplace config. Is the API running?');
  }
  return (await res.json()) as MarketplaceConfig;
}

export async function fetchListings(): Promise<MarketplaceListing[]> {
  const res = await fetch(`${API_BASE_URL}/v1/listings`);
  if (!res.ok) {
    throw new Error('Could not load marketplace listings.');
  }
  const body = (await res.json()) as { listings: MarketplaceListing[] };
  return body.listings ?? [];
}

export async function createListing(body: {
  mint: string;
  seller: string;
  priceLamports: string;
  dataRemainingMb: number;
  dataMb: number;
  country: string;
  planId: string;
  validUntil: string;
  iccid: string;
  qrPayload: string;
  demo: boolean;
}): Promise<MarketplaceListing> {
  const res = await fetch(`${API_BASE_URL}/v1/listings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(parseApiError(text) || 'Could not create listing.');
  }
  const json = (await res.json()) as { listing: MarketplaceListing };
  return json.listing;
}

export async function purchaseListing(params: {
  listingId: string;
  buyer: string;
  paymentSignature: string;
  demo?: boolean;
}): Promise<OwnedEsim> {
  const res = await fetch(
    `${API_BASE_URL}/v1/listings/${params.listingId}/purchase`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        buyer: params.buyer,
        paymentSignature: params.paymentSignature,
        demo: params.demo ?? false,
      }),
    },
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(parseApiError(text) || 'Could not complete purchase.');
  }
  const owned = (await res.json()) as OwnedEsim;
  return {
    ...owned,
    dataRemainingMb: owned.dataRemainingMb ?? owned.dataMb,
    status: 'active',
  };
}

function parseApiError(text: string): string | null {
  try {
    const json = JSON.parse(text) as { error?: { message?: string } };
    return json.error?.message ?? null;
  } catch {
    return null;
  }
}
