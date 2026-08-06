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
];

export function getPlanById(planId: string): EsimPlan | undefined {
  return MOCK_PLANS.find(plan => plan.planId === planId);
}
