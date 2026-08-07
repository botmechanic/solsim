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

export type EsimStatus = 'provisioning' | 'active' | 'failed';

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
}
