import { clusterApiUrl } from '@solana/web3.js';

/**
 * Devnet RPC — QuickNode (sponsor) preferred.
 * Override with SOLANA_RPC_URL in the environment.
 */
export const QUICKNODE_DEVNET_RPC =
  'https://twilight-frosty-bush.solana-devnet.quiknode.pro/668d799bb5f19fa09864f178c35a98fad3de01d6/';

export function getSolanaRpcUrl(): string {
  return process.env.SOLANA_RPC_URL?.trim() || QUICKNODE_DEVNET_RPC || clusterApiUrl('devnet');
}
