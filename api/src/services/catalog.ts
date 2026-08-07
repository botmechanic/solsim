import type { CountryCode, EsimPlan } from '../types.js';
import { mockProvider } from './mockProvider.js';

const COUNTRY_NAMES: Record<CountryCode, string> = {
  TH: 'Thailand',
  JP: 'Japan',
  US: 'United States',
  KR: 'South Korea',
  SG: 'Singapore',
  VN: 'Vietnam',
  FR: 'France',
  DE: 'Germany',
  GB: 'United Kingdom',
  AU: 'Australia',
  MX: 'Mexico',
  BR: 'Brazil',
};

export async function getPlanById(planId: string): Promise<EsimPlan | undefined> {
  const plans = await mockProvider.listPlans();
  return plans.find(plan => plan.planId === planId);
}

export function planMetadataSlug(plan: EsimPlan): string {
  const gb = Math.round(plan.dataMb / 1024);
  return `${plan.country.toLowerCase()}-${gb}gb`;
}

export function planDisplayName(plan: EsimPlan): string {
  const gb = Math.round(plan.dataMb / 1024);
  return `Solsim ${plan.country} ${gb}GB`;
}

export function planCountryName(plan: EsimPlan): string {
  return COUNTRY_NAMES[plan.country] ?? plan.country;
}
