import {
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import {
  PublicKey,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import {
  transact,
  type Web3MobileWallet,
} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import { toByteArray } from 'react-native-quick-base64';
import type { OwnedEsim } from '../../../shared/types';
import { APP_IDENTITY, SOLANA_CHAIN } from '../config/identity';
import { connection, fetchLatestBlockhash } from '../config/solana';
import { MEMO_PROGRAM_ID } from '../config/treasury';
import { Buffer } from 'buffer';
import { createListing, fetchMarketplaceConfig } from './api';
import { isDemoSignature } from '../lib/explorer';

function accountAddressToPublicKey(address: string): PublicKey {
  return new PublicKey(toByteArray(address));
}

async function signAndSend(params: {
  authToken?: string | null;
  build: (owner: PublicKey) => Promise<Transaction>;
}): Promise<{ signature: string; owner: string; authToken: string }> {
  const session = await transact(async (wallet: Web3MobileWallet) => {
    const authorization = await wallet.authorize({
      chain: SOLANA_CHAIN,
      identity: APP_IDENTITY,
      auth_token: params.authToken ?? undefined,
    });
    const account = authorization.accounts[0];
    if (!account?.address) {
      throw new Error('Wallet returned no accounts.');
    }
    const ownerKey = accountAddressToPublicKey(account.address);
    const latest = await fetchLatestBlockhash();
    const tx = await params.build(ownerKey);
    tx.feePayer = ownerKey;
    tx.recentBlockhash = latest.value.blockhash;
    const signed = await wallet.signTransactions({ transactions: [tx] });
    return {
      signed: signed[0]!,
      owner: ownerKey.toBase58(),
      authToken: authorization.auth_token,
      blockhash: latest.value.blockhash,
      lastValidBlockHeight: latest.value.lastValidBlockHeight,
    };
  });

  const signature = await connection.sendRawTransaction(
    session.signed.serialize(),
    { skipPreflight: false, preflightCommitment: 'confirmed' },
  );
  await connection.confirmTransaction(
    {
      signature,
      blockhash: session.blockhash,
      lastValidBlockHeight: session.lastValidBlockHeight,
    },
    'confirmed',
  );
  return {
    signature,
    owner: session.owner,
    authToken: session.authToken,
  };
}

async function buildDepositIx(params: {
  owner: PublicKey;
  mint: PublicKey;
  escrow: PublicKey;
}): Promise<TransactionInstruction[]> {
  const source = getAssociatedTokenAddressSync(params.mint, params.owner);
  const dest = getAssociatedTokenAddressSync(params.mint, params.escrow);
  const ixs: TransactionInstruction[] = [];
  const destInfo = await connection.getAccountInfo(dest);
  if (!destInfo) {
    ixs.push(
      createAssociatedTokenAccountInstruction(
        params.owner,
        dest,
        params.escrow,
        params.mint,
      ),
    );
  }
  ixs.push(
    createTransferInstruction(
      source,
      dest,
      params.owner,
      1n,
      [],
      TOKEN_PROGRAM_ID,
    ),
  );
  return ixs;
}

/** Deposit NFT to escrow (live) or soft-list (demo mint), then register listing. */
export async function listLeftover(params: {
  esim: OwnedEsim;
  priceLamports: string;
  authToken?: string | null;
}): Promise<{ listingId: string; authToken?: string }> {
  const demo = isDemoSignature(params.esim.paymentSignature);

  if (demo) {
    const listing = await createListing({
      mint: params.esim.mint,
      seller: params.esim.owner,
      priceLamports: params.priceLamports,
      dataRemainingMb: params.esim.dataRemainingMb,
      dataMb: params.esim.dataMb,
      country: params.esim.country,
      planId: params.esim.planId,
      validUntil: params.esim.validUntil,
      iccid: params.esim.iccid,
      qrPayload: params.esim.qrPayload,
      demo: true,
    });
    return { listingId: listing.listingId };
  }

  const { escrowPubkey } = await fetchMarketplaceConfig();
  const escrow = new PublicKey(escrowPubkey);
  const mint = new PublicKey(params.esim.mint);

  const { owner, authToken } = await signAndSend({
    authToken: params.authToken,
    build: async ownerKey => {
      const memo = new TransactionInstruction({
        keys: [{ pubkey: ownerKey, isSigner: true, isWritable: true }],
        programId: MEMO_PROGRAM_ID,
        data: Buffer.from(`Solsim list:${params.esim.mint}`, 'utf8'),
      });
      const deposit = await buildDepositIx({
        owner: ownerKey,
        mint,
        escrow,
      });
      return new Transaction().add(memo, ...deposit);
    },
  });

  if (owner !== params.esim.owner) {
    throw new Error('Connected wallet is not the eSIM owner.');
  }

  const listing = await createListing({
    mint: params.esim.mint,
    seller: params.esim.owner,
    priceLamports: params.priceLamports,
    dataRemainingMb: params.esim.dataRemainingMb,
    dataMb: params.esim.dataMb,
    country: params.esim.country,
    planId: params.esim.planId,
    validUntil: params.esim.validUntil,
    iccid: params.esim.iccid,
    qrPayload: params.esim.qrPayload,
    demo: false,
  });

  return { listingId: listing.listingId, authToken };
}
