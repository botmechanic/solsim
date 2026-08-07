import { PublicKey, SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js';
import {
  transact,
  type Web3MobileWallet,
} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import { Buffer } from 'buffer';
import { toByteArray } from 'react-native-quick-base64';
import type { MarketplaceListing, OwnedEsim } from '../../../shared/types';
import { APP_IDENTITY, SOLANA_CHAIN } from '../config/identity';
import { connection, fetchLatestBlockhash } from '../config/solana';
import { MEMO_PROGRAM_ID } from '../config/treasury';
import { purchaseListing } from './api';

function accountAddressToPublicKey(address: string): PublicKey {
  return new PublicKey(toByteArray(address));
}

/** Demo (soft) buy — works for seeded / demo listings without SOL. */
export async function buyListingDemo(
  listing: MarketplaceListing,
  buyer: string,
): Promise<OwnedEsim> {
  return purchaseListing({
    listingId: listing.listingId,
    buyer,
    paymentSignature: `demo-resale-${Date.now()}`,
    demo: true,
  });
}

/** Live buy: SOL to seller, then claim NFT + QR from API. */
export async function buyListingLive(params: {
  listing: MarketplaceListing;
  authToken?: string | null;
}): Promise<{ esim: OwnedEsim; authToken: string }> {
  const { listing, authToken } = params;
  if (listing.demo) {
    throw new Error('Use Demo buy for soft listings.');
  }

  const lamports = Number(listing.priceLamports);
  const seller = new PublicKey(listing.seller);

  const session = await transact(async (wallet: Web3MobileWallet) => {
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
    const latest = await fetchLatestBlockhash();
    const memo = new TransactionInstruction({
      keys: [{ pubkey: ownerKey, isSigner: true, isWritable: true }],
      programId: MEMO_PROGRAM_ID,
      data: Buffer.from(`Solsim buy:${listing.listingId}`, 'utf8'),
    });
    const transfer = SystemProgram.transfer({
      fromPubkey: ownerKey,
      toPubkey: seller,
      lamports,
    });
    const tx = new Transaction({
      feePayer: ownerKey,
      recentBlockhash: latest.value.blockhash,
    }).add(memo, transfer);
    const signed = await wallet.signTransactions({ transactions: [tx] });
    return {
      signed: signed[0]!,
      owner: ownerKey.toBase58(),
      authToken: authorization.auth_token,
      blockhash: latest.value.blockhash,
      lastValidBlockHeight: latest.value.lastValidBlockHeight,
    };
  });

  const paymentSignature = await connection.sendRawTransaction(
    session.signed.serialize(),
    { skipPreflight: false, preflightCommitment: 'confirmed' },
  );
  await connection.confirmTransaction(
    {
      signature: paymentSignature,
      blockhash: session.blockhash,
      lastValidBlockHeight: session.lastValidBlockHeight,
    },
    'confirmed',
  );

  const esim = await purchaseListing({
    listingId: listing.listingId,
    buyer: session.owner,
    paymentSignature,
    demo: false,
  });

  return { esim, authToken: session.authToken };
}
