import { clusterApiUrl, Connection } from '@solana/web3.js';

export const RPC_ENDPOINT = clusterApiUrl('devnet');

export const connection = new Connection(RPC_ENDPOINT, 'confirmed');
