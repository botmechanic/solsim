import type { EsimPlan } from '../../../shared/types';

/**
 * Local catalog — 20 plans across 12 countries (meets “20 plans / ≥5 countries”).
 * Prices stay tiny for faucet demos.
 */
export const MOCK_PLANS: EsimPlan[] = [
  // Thailand
  {
    planId: 'mock_th_1gb_7d',
    country: 'TH',
    dataMb: 1024,
    validityDays: 7,
    priceLamports: '4000000',
    providerId: 'mock',
  },
  {
    planId: 'mock_th_5gb_30d',
    country: 'TH',
    dataMb: 5120,
    validityDays: 30,
    priceLamports: '10000000',
    providerId: 'mock',
  },
  // Japan
  {
    planId: 'mock_jp_3gb_15d',
    country: 'JP',
    dataMb: 3072,
    validityDays: 15,
    priceLamports: '8000000',
    providerId: 'mock',
  },
  {
    planId: 'mock_jp_10gb_30d',
    country: 'JP',
    dataMb: 10240,
    validityDays: 30,
    priceLamports: '15000000',
    providerId: 'mock',
  },
  // United States
  {
    planId: 'mock_us_1gb_7d',
    country: 'US',
    dataMb: 1024,
    validityDays: 7,
    priceLamports: '4000000',
    providerId: 'mock',
  },
  {
    planId: 'mock_us_5gb_30d',
    country: 'US',
    dataMb: 5120,
    validityDays: 30,
    priceLamports: '10000000',
    providerId: 'mock',
  },
  {
    planId: 'mock_us_10gb_30d',
    country: 'US',
    dataMb: 10240,
    validityDays: 30,
    priceLamports: '15000000',
    providerId: 'mock',
  },
  // South Korea
  {
    planId: 'mock_kr_1gb_7d',
    country: 'KR',
    dataMb: 1024,
    validityDays: 7,
    priceLamports: '4000000',
    providerId: 'mock',
  },
  {
    planId: 'mock_kr_3gb_15d',
    country: 'KR',
    dataMb: 3072,
    validityDays: 15,
    priceLamports: '8000000',
    providerId: 'mock',
  },
  // Singapore
  {
    planId: 'mock_sg_2gb_7d',
    country: 'SG',
    dataMb: 2048,
    validityDays: 7,
    priceLamports: '5000000',
    providerId: 'mock',
  },
  // Vietnam
  {
    planId: 'mock_vn_5gb_30d',
    country: 'VN',
    dataMb: 5120,
    validityDays: 30,
    priceLamports: '9000000',
    providerId: 'mock',
  },
  // France
  {
    planId: 'mock_fr_3gb_14d',
    country: 'FR',
    dataMb: 3072,
    validityDays: 14,
    priceLamports: '8000000',
    providerId: 'mock',
  },
  {
    planId: 'mock_fr_10gb_30d',
    country: 'FR',
    dataMb: 10240,
    validityDays: 30,
    priceLamports: '15000000',
    providerId: 'mock',
  },
  // Germany
  {
    planId: 'mock_de_1gb_7d',
    country: 'DE',
    dataMb: 1024,
    validityDays: 7,
    priceLamports: '4000000',
    providerId: 'mock',
  },
  {
    planId: 'mock_de_5gb_30d',
    country: 'DE',
    dataMb: 5120,
    validityDays: 30,
    priceLamports: '10000000',
    providerId: 'mock',
  },
  // United Kingdom
  {
    planId: 'mock_gb_3gb_15d',
    country: 'GB',
    dataMb: 3072,
    validityDays: 15,
    priceLamports: '8000000',
    providerId: 'mock',
  },
  {
    planId: 'mock_gb_10gb_30d',
    country: 'GB',
    dataMb: 10240,
    validityDays: 30,
    priceLamports: '15000000',
    providerId: 'mock',
  },
  // Australia
  {
    planId: 'mock_au_5gb_30d',
    country: 'AU',
    dataMb: 5120,
    validityDays: 30,
    priceLamports: '10000000',
    providerId: 'mock',
  },
  // Mexico
  {
    planId: 'mock_mx_3gb_14d',
    country: 'MX',
    dataMb: 3072,
    validityDays: 14,
    priceLamports: '7000000',
    providerId: 'mock',
  },
  // Brazil
  {
    planId: 'mock_br_5gb_30d',
    country: 'BR',
    dataMb: 5120,
    validityDays: 30,
    priceLamports: '9000000',
    providerId: 'mock',
  },
];

export function getPlanById(planId: string): EsimPlan | undefined {
  return MOCK_PLANS.find(plan => plan.planId === planId);
}
