import { Keypair } from '@solana/web3.js';
import type { EsimPlan, OwnedEsim } from '../../../shared/types';

function randomDigits(length: number): string {
  let out = '';
  for (let i = 0; i < length; i += 1) {
    out += Math.floor(Math.random() * 10).toString();
  }
  return out;
}

/** Mock provider: issues ICCID + LPA QR. Never a real installable profile. */
export function provisionMockEsim(
  plan: EsimPlan,
  owner: string,
  paymentSignature: string,
  mint?: string,
): OwnedEsim {
  const resolvedMint = mint ?? Keypair.generate().publicKey.toBase58();
  const iccid = `8901${randomDigits(15)}`;
  const activationCode = `DEMO${randomDigits(8)}`;
  const validUntil = new Date(
    Date.now() + plan.validityDays * 24 * 60 * 60 * 1000,
  ).toISOString();
  // Mock “already used ~40%” so Sell leftover is the pitch-ready state.
  const dataRemainingMb = Math.max(1024, Math.round(plan.dataMb * 0.6));

  return {
    mint: resolvedMint,
    owner,
    planId: plan.planId,
    country: plan.country,
    dataMb: plan.dataMb,
    dataRemainingMb,
    validUntil,
    status: 'active',
    iccid,
    paymentSignature,
    purchasedAt: new Date().toISOString(),
    qrPayload: `LPA:1$mock.solsim.so$${activationCode}`,
  };
}
