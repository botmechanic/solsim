import { clusterApiUrl, Connection, type BlockhashWithExpiryBlockHeight } from '@solana/web3.js';

/** Public Solana RPC endpoints — try backups when one rate-limits. */
const DEVNET_RPCS = [
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
  attempts = 3,
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
