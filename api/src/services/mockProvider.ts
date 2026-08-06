import type { CountryCode, EsimPlan, EsimProvider } from '../types.js';

const CATALOG: EsimPlan[] = [
  {
    planId: 'mock_th_5gb_30d',
    country: 'TH',
    dataMb: 5120,
    validityDays: 30,
    priceLamports: '10000000',
    providerId: 'mock',
  },
  {
    planId: 'mock_jp_3gb_15d',
    country: 'JP',
    dataMb: 3072,
    validityDays: 15,
    priceLamports: '8000000',
    providerId: 'mock',
  },
];

/** In-memory MockProvider — no external credentials. */
export class MockProvider implements EsimProvider {
  private readonly orders = new Map<
    string,
    { iccid: string; qrPayload: string; validUntil: string }
  >();

  async listPlans(country?: CountryCode): Promise<EsimPlan[]> {
    if (!country) {
      return [...CATALOG];
    }
    return CATALOG.filter(plan => plan.country === country);
  }

  async orderEsim(
    planId: string,
    idemKey: string,
  ): Promise<{ iccid: string; qrPayload: string; validUntil: string }> {
    const existing = this.orders.get(idemKey);
    if (existing) {
      return existing;
    }
    const plan = CATALOG.find(item => item.planId === planId);
    if (!plan) {
      throw new Error(`Unknown plan: ${planId}`);
    }
    const iccid = `8944${String(Date.now()).slice(-12)}`;
    const result = {
      iccid,
      qrPayload: `LPA:1$rsp.solsim.mock$${idemKey.slice(0, 12)}`,
      validUntil: new Date(
        Date.now() + plan.validityDays * 24 * 60 * 60 * 1000,
      ).toISOString(),
    };
    this.orders.set(idemKey, result);
    return result;
  }
}

export const mockProvider = new MockProvider();
