export type CountryCode = 'TH' | 'JP';

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
