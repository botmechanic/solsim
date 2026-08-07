import { createNft, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import {
  generateSigner,
  keypairIdentity,
  percentAmount,
  publicKey,
} from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import bs58 from 'bs58';
import type { EsimPlan } from '../types.js';
import { ApiError } from '../middleware/errors.js';
import { getSolanaRpcUrl } from '../config/rpc.js';
import { planDisplayName, planMetadataSlug } from './catalog.js';

function metadataBaseUrl(): string {
  return (
    process.env.METADATA_BASE_URL ||
    'https://raw.githubusercontent.com/botmechanic/solsim/main/api/public/nft'
  ).replace(/\/$/, '');
}

function loadMintAuthoritySecret(): Uint8Array {
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

export type MintResult = {
  mint: string;
  name: string;
  explorerUrl: string;
};

/** Mint a Metaplex Token Metadata NFT to `owner` for the given plan. */
export async function mintEsimNft(params: {
  owner: string;
  plan: EsimPlan;
}): Promise<MintResult> {
  const endpoint = getSolanaRpcUrl();
  const umi = createUmi(endpoint).use(mplTokenMetadata());

  const secret = loadMintAuthoritySecret();
  const authority = umi.eddsa.createKeypairFromSecretKey(secret);
  umi.use(keypairIdentity(authority));

  const mint = generateSigner(umi);
  const name = planDisplayName(params.plan);
  const slug = planMetadataSlug(params.plan);
  const uri = `${metadataBaseUrl()}/${slug}.json`;

  try {
    await createNft(umi, {
      mint,
      tokenOwner: publicKey(params.owner),
      name,
      symbol: 'SOLSIM',
      uri,
      sellerFeeBasisPoints: percentAmount(0),
      isMutable: true,
    }).sendAndConfirm(umi, { confirm: { commitment: 'confirmed' } });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Mint failed';
    console.error('[mint] createNft failed', message);
    throw new ApiError(
      'PROVISIONING_FAILED',
      'NFT mint failed on-chain. Payment is OK — retry mint.',
      502,
      true,
    );
  }

  const mintAddress = mint.publicKey.toString();
  return {
    mint: mintAddress,
    name,
    explorerUrl: `https://solscan.io/token/${mintAddress}?cluster=devnet`,
  };
}
