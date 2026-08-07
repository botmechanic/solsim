import { Router } from 'express';
import { z } from 'zod';
import { mockProvider } from '../services/mockProvider.js';
import { ApiError } from '../middleware/errors.js';
import type { CountryCode } from '../types.js';

const countrySchema = z
  .enum([
    'TH',
    'JP',
    'US',
    'KR',
    'SG',
    'VN',
    'FR',
    'DE',
    'GB',
    'AU',
    'MX',
    'BR',
  ])
  .optional();

let cached: { at: number; plans: Awaited<ReturnType<typeof mockProvider.listPlans>> } | null =
  null;
const CACHE_MS = 5 * 60 * 1000;

export const plansRouter = Router();

plansRouter.get('/plans', async (req, res, next) => {
  try {
    const parsed = countrySchema.safeParse(req.query.country);
    if (!parsed.success) {
      throw new ApiError(
        'PLAN_UNAVAILABLE',
        'Invalid country filter.',
        400,
        false,
      );
    }
    const country = parsed.data as CountryCode | undefined;

    // Cache full catalog only; filtered responses derive from cache when fresh.
    const now = Date.now();
    if (!cached || now - cached.at > CACHE_MS) {
      cached = { at: now, plans: await mockProvider.listPlans() };
    }

    const plans = country
      ? cached.plans.filter(plan => plan.country === country)
      : cached.plans;

    res.json({ plans, cachedAt: new Date(cached.at).toISOString() });
  } catch (err) {
    next(err);
  }
});

/** Test helper — reset in-memory cache between tests. */
export function __resetPlansCache(): void {
  cached = null;
}
