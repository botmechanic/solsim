import type { EsimPlan } from '../../../shared/types';

/** Local catalog — prices kept tiny for easy faucet demos. */
export const MOCK_PLANS: EsimPlan[] = [
  {
    planId: 'mock_th_5gb_30d',
    country: 'TH',
    dataMb: 5120,
    validityDays: 30,
    priceLamports: '10000000', // 0.01 SOL
    providerId: 'mock',
  },
  {
    planId: 'mock_jp_3gb_15d',
    country: 'JP',
    dataMb: 3072,
    validityDays: 15,
    priceLamports: '8000000', // 0.008 SOL
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
    planId: 'mock_kr_3gb_15d',
    country: 'KR',
    dataMb: 3072,
    validityDays: 15,
    priceLamports: '8000000',
    providerId: 'mock',
  },
  {
    planId: 'mock_sg_2gb_7d',
    country: 'SG',
    dataMb: 2048,
    validityDays: 7,
    priceLamports: '5000000', // 0.005 SOL
    providerId: 'mock',
  },
  {
    planId: 'mock_vn_5gb_30d',
    country: 'VN',
    dataMb: 5120,
    validityDays: 30,
    priceLamports: '9000000',
    providerId: 'mock',
  },
  {
    planId: 'mock_fr_3gb_14d',
    country: 'FR',
    dataMb: 3072,
    validityDays: 14,
    priceLamports: '8000000',
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
  {
    planId: 'mock_gb_3gb_15d',
    country: 'GB',
    dataMb: 3072,
    validityDays: 15,
    priceLamports: '8000000',
    providerId: 'mock',
  },
  {
    planId: 'mock_au_5gb_30d',
    country: 'AU',
    dataMb: 5120,
    validityDays: 30,
    priceLamports: '10000000',
    providerId: 'mock',
  },
  {
    planId: 'mock_mx_3gb_14d',
    country: 'MX',
    dataMb: 3072,
    validityDays: 14,
    priceLamports: '7000000',
    providerId: 'mock',
  },
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
