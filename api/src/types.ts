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
