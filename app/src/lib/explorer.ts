/** Devnet Solscan helpers for judge-facing on-chain proof. */
export function solscanTxUrl(signature: string): string {
  return `https://solscan.io/tx/${signature}?cluster=devnet`;
}

export function solscanAddressUrl(address: string): string {
  return `https://solscan.io/account/${address}?cluster=devnet`;
}

export function solscanTokenUrl(mint: string): string {
  return `https://solscan.io/token/${mint}?cluster=devnet`;
}

export function isDemoSignature(signature: string): boolean {
  return signature.startsWith('demo');
}
