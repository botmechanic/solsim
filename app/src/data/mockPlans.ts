import type { EsimPlan } from '../../../shared/types';

/** Local catalog until GET /plans is live. */
export const MOCK_PLANS: EsimPlan[] = [
  {
    planId: 'mock_th_5gb_30d',
    country: 'TH',
    dataMb: 5120,
    validityDays: 30,
    priceLamports: '100000000', // 0.1 SOL on devnet
    providerId: 'mock',
  },
  {
    planId: 'mock_jp_3gb_15d',
    country: 'JP',
    dataMb: 3072,
    validityDays: 15,
    priceLamports: '80000000', // 0.08 SOL
    providerId: 'mock',
  },
];

export function getPlanById(planId: string): EsimPlan | undefined {
  return MOCK_PLANS.find(plan => plan.planId === planId);
}
