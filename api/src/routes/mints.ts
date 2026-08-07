import { Router } from 'express';
import { z } from 'zod';
import { ApiError } from '../middleware/errors.js';
import { getPlanById } from '../services/catalog.js';
import { mintEsimNft } from '../services/metaplexMint.js';
import { verifyPayment } from '../services/verifyPayment.js';

const bodySchema = z.object({
  owner: z.string().min(32).max(44),
  planId: z.string().min(1),
  paymentSignature: z.string().min(64).max(128),
  idempotencyKey: z.string().uuid(),
});

type MintRecord = {
  mint: string;
  name: string;
  explorerUrl: string;
  owner: string;
  planId: string;
  paymentSignature: string;
  idempotencyKey: string;
};

const byIdempotency = new Map<string, MintRecord>();
const byPaymentSig = new Map<string, MintRecord>();

export const mintsRouter = Router();

mintsRouter.post('/mints', async (req, res, next) => {
  try {
    const parsed = bodySchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ApiError(
        'PLAN_UNAVAILABLE',
        'Invalid mint request body.',
        400,
        false,
      );
    }
    const { owner, planId, paymentSignature, idempotencyKey } = parsed.data;

    const existing =
      byIdempotency.get(idempotencyKey) ?? byPaymentSig.get(paymentSignature);
    if (existing) {
      res.status(200).json({
        mint: existing.mint,
        name: existing.name,
        explorerUrl: existing.explorerUrl,
        idempotent: true,
      });
      return;
    }

    const plan = await getPlanById(planId);
    if (!plan) {
      throw new ApiError('PLAN_UNAVAILABLE', 'Unknown plan.', 404, false);
    }

    await verifyPayment({
      paymentSignature,
      owner,
      minLamports: BigInt(plan.priceLamports),
    });

    const minted = await mintEsimNft({ owner, plan });
    const record: MintRecord = {
      ...minted,
      owner,
      planId,
      paymentSignature,
      idempotencyKey,
    };
    byIdempotency.set(idempotencyKey, record);
    byPaymentSig.set(paymentSignature, record);

    res.status(201).json({
      mint: record.mint,
      name: record.name,
      explorerUrl: record.explorerUrl,
      idempotent: false,
    });
  } catch (err) {
    next(err);
  }
});

/** Test helper */
export function __resetMintCache(): void {
  byIdempotency.clear();
  byPaymentSig.clear();
}
