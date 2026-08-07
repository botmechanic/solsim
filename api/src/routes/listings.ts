import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import { z } from 'zod';
import { ApiError } from '../middleware/errors.js';
import { getEscrowPubkey } from '../services/escrow.js';
import {
  escrowHoldsMint,
  getListing,
  listActiveListings,
  seedDemoListing,
  upsertListing,
  type ListingRecord,
} from '../services/listingsStore.js';
import { transferNftFromEscrow } from '../services/nftTransfer.js';
import { verifySolPayment } from '../services/verifyPayment.js';

const countrySchema = z.enum([
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
]);

const createSchema = z.object({
  mint: z.string().min(32).max(44),
  seller: z.string().min(32).max(44),
  priceLamports: z.string().regex(/^\d+$/),
  dataRemainingMb: z.number().int().positive(),
  dataMb: z.number().int().positive(),
  country: countrySchema,
  planId: z.string().min(1),
  validUntil: z.string().min(1),
  iccid: z.string().min(1),
  qrPayload: z.string().min(1).max(512),
  /** Soft listing — skip escrow deposit check (demo mints). */
  demo: z.boolean().optional().default(false),
});

const purchaseSchema = z.object({
  buyer: z.string().min(32).max(44),
  paymentSignature: z.string().min(8).max(128),
  demo: z.boolean().optional().default(false),
});

seedDemoListing();

export const listingsRouter = Router();

listingsRouter.get('/marketplace/config', (_req, res, next) => {
  try {
    res.json({ escrowPubkey: getEscrowPubkey().toBase58() });
  } catch (err) {
    next(err);
  }
});

listingsRouter.get('/listings', (_req, res) => {
  res.json({ listings: listActiveListings() });
});

listingsRouter.post('/listings', async (req, res, next) => {
  try {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ApiError('PLAN_UNAVAILABLE', 'Invalid listing body.', 400, false);
    }
    const body = parsed.data;
    if (body.dataRemainingMb > body.dataMb) {
      throw new ApiError(
        'PLAN_UNAVAILABLE',
        'Remaining data cannot exceed plan size.',
        400,
        false,
      );
    }

    if (!body.demo) {
      const held = await escrowHoldsMint(body.mint);
      if (!held) {
        throw new ApiError(
          'PROVISIONING_FAILED',
          'Escrow does not hold this NFT yet. Deposit first, then list.',
          409,
          true,
        );
      }
    }

    const existing = listActiveListings().find(item => item.mint === body.mint);
    if (existing) {
      res.status(200).json({ listing: existing, idempotent: true });
      return;
    }

    const record: ListingRecord = {
      listingId: randomUUID(),
      mint: body.mint,
      seller: body.seller,
      priceLamports: body.priceLamports,
      country: body.country,
      dataMb: body.dataMb,
      dataRemainingMb: body.dataRemainingMb,
      planId: body.planId,
      validUntil: body.validUntil,
      status: 'active',
      createdAt: new Date().toISOString(),
      demo: body.demo,
      iccid: body.iccid,
      qrPayload: body.qrPayload,
    };
    const listing = upsertListing(record);
    res.status(201).json({ listing });
  } catch (err) {
    next(err);
  }
});

listingsRouter.post('/listings/:listingId/purchase', async (req, res, next) => {
  try {
    const parsed = purchaseSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ApiError('PLAN_UNAVAILABLE', 'Invalid purchase body.', 400, false);
    }
    const { buyer, paymentSignature, demo } = parsed.data;
    const listing = getListing(req.params.listingId);
    if (!listing || listing.status !== 'active') {
      throw new ApiError('NOT_FOUND', 'Listing not found or already sold.', 404, false);
    }
    if (listing.seller === buyer) {
      throw new ApiError(
        'UNAUTHORIZED',
        'Cannot buy your own listing.',
        400,
        false,
      );
    }

    if (listing.demo) {
      // Soft settle — seeded / demo-mint leftovers.
    } else {
      if (demo) {
        throw new ApiError(
          'UNAUTHORIZED',
          'This listing requires a live SOL payment to the seller.',
          400,
          false,
        );
      }
      await verifySolPayment({
        paymentSignature,
        payer: buyer,
        destination: listing.seller,
        minLamports: BigInt(listing.priceLamports),
      });
      await transferNftFromEscrow({ mint: listing.mint, buyer });
    }

    listing.status = 'sold';
    listing.soldTo = buyer;
    listing.paymentSignature = paymentSignature;
    upsertListing(listing);

    res.status(200).json({
      mint: listing.mint,
      owner: buyer,
      country: listing.country,
      dataMb: listing.dataMb,
      dataRemainingMb: listing.dataRemainingMb,
      validUntil: listing.validUntil,
      status: 'active',
      iccid: listing.iccid,
      planId: listing.planId,
      paymentSignature,
      purchasedAt: new Date().toISOString(),
      qrPayload: listing.qrPayload,
      listingId: listing.listingId,
    });
  } catch (err) {
    next(err);
  }
});
