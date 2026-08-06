import type { EsimPlan } from '../../../shared/types';
import { API_BASE_URL, PLANS_PATH } from '../config/api';
import { MOCK_PLANS } from './mockPlans';

const CACHE_MS = 5 * 60 * 1000;

type CatalogState = {
  plans: EsimPlan[];
  at: number;
  source: 'api' | 'mock';
};

let cache: CatalogState | null = null;

export function getCachedPlans(): EsimPlan[] {
  return cache?.plans ?? MOCK_PLANS;
}

export function getPlanById(planId: string): EsimPlan | undefined {
  return getCachedPlans().find(plan => plan.planId === planId);
}

export function getCatalogSource(): 'api' | 'mock' | null {
  return cache?.source ?? null;
}

export async function loadPlans(force = false): Promise<{
  plans: EsimPlan[];
  source: 'api' | 'mock';
}> {
  const now = Date.now();
  if (!force && cache && now - cache.at < CACHE_MS) {
    return { plans: cache.plans, source: cache.source };
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`${API_BASE_URL}${PLANS_PATH}`, {
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) {
      throw new Error(`plans HTTP ${res.status}`);
    }
    const body = (await res.json()) as { plans?: EsimPlan[] };
    if (!Array.isArray(body.plans) || body.plans.length === 0) {
      throw new Error('empty catalog');
    }
    cache = { plans: body.plans, at: now, source: 'api' };
    return { plans: cache.plans, source: 'api' };
  } catch {
    cache = { plans: MOCK_PLANS, at: now, source: 'mock' };
    return { plans: MOCK_PLANS, source: 'mock' };
  }
}
