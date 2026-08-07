import {
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';
import {
  transact,
  type Web3MobileWallet,
} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import { Buffer } from 'buffer';
import { toByteArray } from 'react-native-quick-base64';
import type { EsimPlan, OwnedEsim } from '../../../shared/types';
import { APP_IDENTITY, SOLANA_CHAIN } from '../config/identity';
import { connection } from '../config/solana';
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
 * 1) MWA authorize + sign/send SOL payment on devnet
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
  const { signature, owner, nextAuthToken } = await transact(
    async (wallet: Web3MobileWallet) => {
      const authorization = await wallet.authorize({
        chain: SOLANA_CHAIN,
        identity: APP_IDENTITY,
        auth_token: authToken ?? undefined,
      });
      const ownerKey = accountAddressToPublicKey(
        authorization.accounts[0].address,
      );

      onProgress?.('signing');
      const { blockhash } = await connection.getLatestBlockhash('confirmed');
      const memo = new TransactionInstruction({
        keys: [],
        programId: MEMO_PROGRAM_ID,
        data: Buffer.from(`Solsim eSIM:${plan.planId}`, 'utf8'),
      });
      const transfer = SystemProgram.transfer({
        fromPubkey: ownerKey,
        toPubkey: TREASURY_PUBKEY,
        lamports,
      });
      const message = new TransactionMessage({
        payerKey: ownerKey,
        recentBlockhash: blockhash,
        instructions: [memo, transfer],
      }).compileToV0Message();
      const tx = new VersionedTransaction(message);
      const signatures = await wallet.signAndSendTransactions({
        transactions: [tx],
      });

      return {
        signature: signatures[0],
        owner: ownerKey.toBase58(),
        nextAuthToken: authorization.auth_token,
      };
    },
  );

  onProgress?.('confirming');
  const confirmation = await connection.confirmTransaction(
    signature,
    'confirmed',
  );
  if (confirmation.value.err) {
    throw new Error('Payment failed on-chain. Try again or top up devnet SOL.');
  }

  try {
    return await finishPurchaseAfterPayment({
      plan,
      owner,
      paymentSignature: signature,
      authToken: nextAuthToken,
      onProgress,
    });
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : 'NFT mint failed — payment OK, retry mint.';
    throw new MintAfterPaymentError(message, {
      paymentSignature: signature,
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
