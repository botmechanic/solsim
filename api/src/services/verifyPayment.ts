import {
  Connection,
  PublicKey,
  SystemProgram,
  clusterApiUrl,
  type ParsedTransactionWithMeta,
} from '@solana/web3.js';
import { ApiError } from '../middleware/errors.js';

export function getConnection(): Connection {
  const endpoint = process.env.SOLANA_RPC_URL || clusterApiUrl('devnet');
  return new Connection(endpoint, 'confirmed');
}

export function getTreasuryPubkey(): PublicKey {
  const raw = process.env.TREASURY_PUBKEY;
  if (!raw) {
    throw new ApiError(
      'INTERNAL',
      'TREASURY_PUBKEY is not configured.',
      500,
      false,
    );
  }
  try {
    return new PublicKey(raw);
  } catch {
    throw new ApiError('INTERNAL', 'TREASURY_PUBKEY is invalid.', 500, false);
  }
}

function transferLamportsToTreasury(
  tx: ParsedTransactionWithMeta,
  owner: PublicKey,
  treasury: PublicKey,
): bigint {
  let total = 0n;
  const message = tx.transaction.message;
  for (const ix of message.instructions) {
    if (!('parsed' in ix)) {
      continue;
    }
    if (ix.programId.equals(SystemProgram.programId) && ix.parsed?.type === 'transfer') {
      const info = ix.parsed.info as {
        source?: string;
        destination?: string;
        lamports?: number;
      };
      if (
        info.source === owner.toBase58() &&
        info.destination === treasury.toBase58() &&
        typeof info.lamports === 'number'
      ) {
        total += BigInt(info.lamports);
      }
    }
  }
  return total;
}

/** Verify a confirmed SOL payment from owner → treasury for at least minLamports. */
export async function verifyPayment(params: {
  paymentSignature: string;
  owner: string;
  minLamports: bigint;
}): Promise<void> {
  const connection = getConnection();
  let ownerKey: PublicKey;
  try {
    ownerKey = new PublicKey(params.owner);
  } catch {
    throw new ApiError('UNAUTHORIZED', 'Invalid owner pubkey.', 400, false);
  }
  const treasury = getTreasuryPubkey();

  const tx = await connection.getParsedTransaction(params.paymentSignature, {
    maxSupportedTransactionVersion: 0,
    commitment: 'confirmed',
  });

  if (!tx || tx.meta?.err) {
    throw new ApiError(
      'PAYMENT_NOT_CONFIRMED',
      'Payment is not confirmed on-chain yet. Wait and retry.',
      409,
      true,
    );
  }

  const paid = transferLamportsToTreasury(tx, ownerKey, treasury);
  if (paid < params.minLamports) {
    throw new ApiError(
      'INSUFFICIENT_PAYMENT',
      'Payment does not cover the plan price to the treasury.',
      400,
      false,
    );
  }
}
