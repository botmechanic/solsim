/**
 * Generate a mint-authority keypair for Solsim NFT minting on devnet.
 *
 * Usage: npx tsx scripts/create-mint-authority.ts
 *
 * Fund the printed pubkey at https://faucet.solana.com (devnet), then put
 * MINT_AUTHORITY_SECRET into api/.env — never commit it.
 */
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

const kp = Keypair.generate();
const secret = bs58.encode(kp.secretKey);

console.log('Mint authority pubkey:', kp.publicKey.toBase58());
console.log('MINT_AUTHORITY_SECRET (base58):', secret);
console.log('');
console.log('Next:');
console.log('  1. Fund the pubkey with ~1–2 SOL on devnet (faucet.solana.com)');
console.log('  2. Add to api/.env: MINT_AUTHORITY_SECRET=' + secret);
console.log('  3. Never commit .env or the secret');
