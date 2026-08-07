import { clusterApiUrl, Connection, type BlockhashWithExpiryBlockHeight } from '@solana/web3.js';

/**
 * Devnet RPC pool — QuickNode first (hackathon sponsor), then public fallbacks.
 * The QuikNode path segment is an access token; rotate after the event if the repo is public.
 */
export const QUICKNODE_DEVNET_RPC =
  'https://twilight-frosty-bush.solana-devnet.quiknode.pro/668d799bb5f19fa09864f178c35a98fad3de01d6/';

const DEVNET_RPCS = [
  QUICKNODE_DEVNET_RPC,
  clusterApiUrl('devnet'),
  'https://api.devnet.solana.com',
];

export const RPC_ENDPOINT = DEVNET_RPCS[0];

export const connection = new Connection(RPC_ENDPOINT, {
  commitment: 'confirmed',
  disableRetryOnRateLimit: false,
});

async function sleep(ms: number): Promise<void> {
  await new Promise<void>(resolve => {
    setTimeout(resolve, ms);
  });
}

export type LatestBlockhashResult = {
  value: BlockhashWithExpiryBlockHeight;
  context: { slot: number };
  endpoint: string;
};

/** Fetch a recent blockhash with retries across fallback RPCs. */
export async function fetchLatestBlockhash(
  attempts = 4,
): Promise<LatestBlockhashResult> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i += 1) {
    const endpoint = DEVNET_RPCS[i % DEVNET_RPCS.length];
    const rpc = new Connection(endpoint, 'confirmed');
    try {
      const latest = await rpc.getLatestBlockhashAndContext('confirmed');
      return {
        value: latest.value,
        context: latest.context,
        endpoint,
      };
    } catch (err) {
      lastError = err;
      await sleep(350 * (i + 1));
    }
  }
  const detail =
    lastError instanceof Error ? lastError.message : 'RPC unavailable';
  throw new Error(
    `Failed to get recent blockhash (${detail}). Check phone network / VPN, then retry.`,
  );
}
