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

export interface EsimPlan {
  planId: string;
  country: CountryCode;
  dataMb: number;
  validityDays: number;
  priceLamports: string;
  providerId: 'mock';
}

export interface EsimProvider {
  listPlans(country?: CountryCode): Promise<EsimPlan[]>;
  orderEsim(
    planId: string,
    idemKey: string,
  ): Promise<{
    iccid: string;
    qrPayload: string;
    validUntil: string;
  }>;
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
