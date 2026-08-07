import {
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import {
  transact,
  type Web3MobileWallet,
} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import { Buffer } from 'buffer';
import { toByteArray } from 'react-native-quick-base64';
import type { EsimPlan, OwnedEsim } from '../../../shared/types';
import { APP_IDENTITY, SOLANA_CHAIN } from '../config/identity';
import { connection, fetchLatestBlockhash } from '../config/solana';
import { MEMO_PROGRAM_ID, TREASURY_PUBKEY } from '../config/treasury';
import { provisionMockEsim } from './mockProvision';
import { requestNftMint } from './requestNftMint';

export type PurchaseStep =
  | 'authorizing'
  | 'signing'
  | 'confirming'
  | 'minting'
  | 'provisioning'
  | 'complete';

export type PurchaseProgress = (step: PurchaseStep) => void;

const MWA_TIMEOUT_MS = 90_000;

export class MintAfterPaymentError extends Error {
  readonly paymentSignature: string;
  readonly owner: string;
  readonly authToken: string;

  constructor(
    message: string,
    params: { paymentSignature: string; owner: string; authToken: string },
  ) {
    super(message);
    this.name = 'MintAfterPaymentError';
    this.paymentSignature = params.paymentSignature;
    this.owner = params.owner;
    this.authToken = params.authToken;
  }
}

function accountAddressToPublicKey(address: string): PublicKey {
  return new PublicKey(toByteArray(address));
}

async function sleep(ms: number): Promise<void> {
  await new Promise<void>(resolve => {
    setTimeout(resolve, ms);
  });
}

function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), ms);
    promise.then(
      value => {
        clearTimeout(timer);
        resolve(value);
      },
      err => {
        clearTimeout(timer);
        reject(err);
      },
    );
  });
}

function mapWalletError(err: unknown): Error {
  const msg = err instanceof Error ? err.message : String(err);
  const name = err instanceof Error ? err.name : '';
  if (/failed to get recent blockhash|blockhash/i.test(msg)) {
    return new Error(
      'Could not reach Solana RPC for payment. Check phone network, then retry Buy.',
    );
  }
  if (
    name.includes('Cancellation') ||
    /cancel|declin|reject|disagree/i.test(msg)
  ) {
    return new Error(
      'Payment declined in Phantom. Tap Approve on the transfer, then return here.',
    );
  }
  if (/session|disconnect|closed|timed?\s*out/i.test(msg)) {
    return new Error(
      'Wallet session closed or timed out. Try Buy again and keep Phantom open.',
    );
  }
  return err instanceof Error ? err : new Error(msg);
}

function buildPaymentTransaction(params: {
  ownerKey: PublicKey;
  planId: string;
  lamports: number;
  recentBlockhash: string;
}): Transaction {
  const memo = new TransactionInstruction({
    keys: [{ pubkey: params.ownerKey, isSigner: true, isWritable: true }],
    programId: MEMO_PROGRAM_ID,
    data: Buffer.from(`Solsim eSIM:${params.planId}`, 'utf8'),
  });
  const transfer = SystemProgram.transfer({
    fromPubkey: params.ownerKey,
    toPubkey: TREASURY_PUBKEY,
    lamports: params.lamports,
  });
  return new Transaction({
    feePayer: params.ownerKey,
    recentBlockhash: params.recentBlockhash,
  }).add(memo, transfer);
}

/** Mint + provision after payment is already confirmed (also used for retry). */
export async function finishPurchaseAfterPayment(params: {
  plan: EsimPlan;
  owner: string;
  paymentSignature: string;
  authToken: string;
  onProgress?: PurchaseProgress;
}): Promise<{ esim: OwnedEsim; paymentSignature: string; authToken: string }> {
  const { plan, owner, paymentSignature, authToken, onProgress } = params;

  onProgress?.('minting');
  const minted = await requestNftMint({
    owner,
    planId: plan.planId,
    paymentSignature,
  });

  onProgress?.('provisioning');
  await sleep(400);
  const esim = provisionMockEsim(plan, owner, paymentSignature, minted.mint);
  onProgress?.('complete');

  return { esim, paymentSignature, authToken };
}

/**
 * Full demo purchase:
 * 1) MWA authorize + sign payment (we submit via Solana RPC — not Phantom RPC)
 * 2) confirm payment
 * 3) API mints Metaplex NFT to buyer
 * 4) mock-provision eSIM + local ownership record (QR off-chain)
 */
export async function purchaseEsim(params: {
  plan: EsimPlan;
  authToken?: string | null;
  onProgress?: PurchaseProgress;
}): Promise<{ esim: OwnedEsim; paymentSignature: string; authToken: string }> {
  const { plan, authToken, onProgress } = params;
  const lamports = Number(plan.priceLamports);

  onProgress?.('authorizing');
  // Warm RPC early so we fail fast with a clear message before opening Phantom.
  await fetchLatestBlockhash();

  onProgress?.('signing');
  let signedTx: Transaction;
  let owner: string;
  let nextAuthToken: string;
  let blockhash: string;
  let lastValidBlockHeight: number;

  try {
    const session = await withTimeout(
      transact(async (wallet: Web3MobileWallet) => {
        const authorization = await wallet.authorize({
          chain: SOLANA_CHAIN,
          identity: APP_IDENTITY,
          auth_token: authToken ?? undefined,
        });
        const account = authorization.accounts[0];
        if (!account?.address) {
          throw new Error('Wallet returned no accounts.');
        }
        const ownerKey = accountAddressToPublicKey(account.address);

        // Fresh hash after authorize (reauthorize is usually instant).
        // Do NOT use signAndSend — Phantom's RPC often fails with
        // "failed to get recent blockhash" even when ours works.
        const latest = await fetchLatestBlockhash();
        const tx = buildPaymentTransaction({
          ownerKey,
          planId: plan.planId,
          lamports,
          recentBlockhash: latest.value.blockhash,
        });

        const signed = await wallet.signTransactions({
          transactions: [tx],
        });
        const paid = signed[0];
        if (!paid) {
          throw new Error('Wallet did not return a signed transaction.');
        }

        return {
          signedTx: paid,
          owner: ownerKey.toBase58(),
          nextAuthToken: authorization.auth_token,
          blockhash: latest.value.blockhash,
          lastValidBlockHeight: latest.value.lastValidBlockHeight,
        };
      }),
      MWA_TIMEOUT_MS,
      'Phantom did not finish signing in time. Approve the transfer in Phantom, then try again.',
    );
    signedTx = session.signedTx;
    owner = session.owner;
    nextAuthToken = session.nextAuthToken;
    blockhash = session.blockhash;
    lastValidBlockHeight = session.lastValidBlockHeight;
  } catch (err) {
    throw mapWalletError(err);
  }

  onProgress?.('confirming');
  let paymentSignature: string;
  try {
    paymentSignature = await connection.sendRawTransaction(
      signedTx.serialize(),
      {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
        maxRetries: 3,
      },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/insufficient|no record of a prior credit/i.test(msg)) {
      throw new Error(
        'Not enough devnet SOL for payment + fees. Top up the faucet, then retry.',
      );
    }
    if (/blockhash/i.test(msg)) {
      throw new Error(
        'Payment blockhash expired. Tap Buy again and approve quickly in Phantom.',
      );
    }
    throw new Error(`Could not submit payment: ${msg}`);
  }

  const confirmation = await connection.confirmTransaction(
    {
      signature: paymentSignature,
      blockhash,
      lastValidBlockHeight,
    },
    'confirmed',
  );
  if (confirmation.value.err) {
    throw new Error('Payment failed on-chain. Try again or top up devnet SOL.');
  }

  try {
    return await finishPurchaseAfterPayment({
      plan,
      owner,
      paymentSignature,
      authToken: nextAuthToken,
      onProgress,
    });
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : 'NFT mint failed — payment OK, retry mint.';
    throw new MintAfterPaymentError(message, {
      paymentSignature,
      owner,
      authToken: nextAuthToken,
    });
  }
}

/** Offline demo path when wallet has no SOL / faucet unavailable. */
export async function purchaseEsimDemo(params: {
  plan: EsimPlan;
  owner: string;
  onProgress?: PurchaseProgress;
}): Promise<OwnedEsim> {
  const { plan, owner, onProgress } = params;
  onProgress?.('authorizing');
  await sleep(350);
  onProgress?.('signing');
  await sleep(450);
  onProgress?.('confirming');
  await sleep(350);
  onProgress?.('minting');
  await sleep(350);
  onProgress?.('provisioning');
  await sleep(650);
  const esim = provisionMockEsim(plan, owner, `demo-${Date.now()}`);
  onProgress?.('complete');
  return esim;
}
