import bs58 from 'bs58';
import { Keypair, PublicKey } from '@solana/web3.js';
import { ApiError } from '../middleware/errors.js';

let cached: PublicKey | null = null;

/** Escrow = mint authority keypair pubkey (already funded / configured). */
export function getEscrowPubkey(): PublicKey {
  if (cached) {
    return cached;
  }
  const raw = process.env.MINT_AUTHORITY_SECRET;
  if (!raw) {
    throw new ApiError(
      'INTERNAL',
      'MINT_AUTHORITY_SECRET is not configured (needed for marketplace escrow).',
      500,
      false,
    );
  }
  try {
    const kp = Keypair.fromSecretKey(bs58.decode(raw));
    cached = kp.publicKey;
    return cached;
  } catch {
    throw new ApiError(
      'INTERNAL',
      'MINT_AUTHORITY_SECRET must be base58.',
      500,
      false,
    );
  }
}
