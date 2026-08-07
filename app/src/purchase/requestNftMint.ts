import { API_BASE_URL } from '../config/api';

export type MintApiResponse = {
  mint: string;
  name: string;
  explorerUrl: string;
  idempotent?: boolean;
};

type ApiErrorBody = {
  error?: { code?: string; message?: string; retriable?: boolean };
};

function randomUuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, ch => {
    const r = (Math.random() * 16) | 0;
    const v = ch === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** Ask API to mint Metaplex NFT after payment is confirmed. */
export async function requestNftMint(params: {
  owner: string;
  planId: string;
  paymentSignature: string;
  idempotencyKey?: string;
}): Promise<MintApiResponse> {
  const idempotencyKey = params.idempotencyKey ?? randomUuid();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 90_000);

  try {
    const res = await fetch(`${API_BASE_URL}/v1/mints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        owner: params.owner,
        planId: params.planId,
        paymentSignature: params.paymentSignature,
        idempotencyKey,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      let message =
        'NFT mint failed — payment OK, retry mint or check the API.';
      try {
        const body = (await res.json()) as ApiErrorBody;
        if (body.error?.message) {
          message = body.error.message;
        }
      } catch {
        // keep default
      }
      throw new Error(message);
    }

    return (await res.json()) as MintApiResponse;
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error(
        'NFT mint timed out — payment OK. Ensure the API is running and retry.',
      );
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}
