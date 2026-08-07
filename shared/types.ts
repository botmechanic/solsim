export type CountryCode =
  | 'TH'
  | 'JP'
  | 'US'
  | 'KR'
  | 'SG'
  | 'VN'
  | 'FR'
  | 'DE'
  | 'GB'
  | 'AU'
  | 'MX'
  | 'BR';

export type EsimStatus =
  | 'provisioning'
  | 'active'
  | 'listed'
  | 'sold'
  | 'failed';

export interface EsimPlan {
  planId: string;
  country: CountryCode;
  dataMb: number;
  validityDays: number;
  priceLamports: string;
  providerId: 'mock';
}

export interface EsimNft {
  mint: string;
  owner: string;
  country: CountryCode;
  dataMb: number;
  validUntil: string;
  status: EsimStatus;
  iccid: string;
}

/** Local vault record — QR never goes on-chain. */
export interface OwnedEsim extends EsimNft {
  planId: string;
  paymentSignature: string;
  purchasedAt: string;
  qrPayload: string;
  /** Mock remaining allowance for resale demos (defaults to ~60% of dataMb). */
  dataRemainingMb: number;
  listingId?: string;
}

export type MarketplaceListingStatus = 'active' | 'sold' | 'cancelled';

/** Public marketplace card — no QR / ICCID. */
export interface MarketplaceListing {
  listingId: string;
  mint: string;
  seller: string;
  priceLamports: string;
  country: CountryCode;
  dataMb: number;
  dataRemainingMb: number;
  planId: string;
  validUntil: string;
  status: MarketplaceListingStatus;
  createdAt: string;
  /** Soft listing (demo mint) — no on-chain escrow. */
  demo: boolean;
}
