import {
  transferV1,
  mplTokenMetadata,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata';
import { keypairIdentity, publicKey } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { clusterApiUrl } from '@solana/web3.js';
import bs58 from 'bs58';
import { ApiError } from '../middleware/errors.js';

function loadEscrowSecret(): Uint8Array {
  const raw = process.env.MINT_AUTHORITY_SECRET;
  if (!raw) {
    throw new ApiError(
      'INTERNAL',
      'MINT_AUTHORITY_SECRET is not configured.',
      500,
      false,
    );
  }
  try {
    return bs58.decode(raw);
  } catch {
    throw new ApiError(
      'INTERNAL',
      'MINT_AUTHORITY_SECRET must be base58.',
      500,
      false,
    );
  }
}

/** Transfer a deposited Solsim NFT from escrow → buyer. */
export async function transferNftFromEscrow(params: {
  mint: string;
  buyer: string;
}): Promise<void> {
  const endpoint = process.env.SOLANA_RPC_URL || clusterApiUrl('devnet');
  const umi = createUmi(endpoint).use(mplTokenMetadata());
  const secret = loadEscrowSecret();
  const authority = umi.eddsa.createKeypairFromSecretKey(secret);
  umi.use(keypairIdentity(authority));

  try {
    await transferV1(umi, {
      mint: publicKey(params.mint),
      tokenOwner: authority.publicKey,
      destinationOwner: publicKey(params.buyer),
      amount: 1,
      tokenStandard: TokenStandard.NonFungible,
    }).sendAndConfirm(umi, { confirm: { commitment: 'confirmed' } });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Transfer failed';
    console.error('[marketplace] escrow transfer failed', message);
    throw new ApiError(
      'PROVISIONING_FAILED',
      'Could not transfer the eSIM NFT to the buyer. Payment is OK — retry claim.',
      502,
      true,
    );
  }
}
