import type { CountryCode } from '../../../shared/types';

const COUNTRY_LABELS: Record<CountryCode, string> = {
  TH: 'Thailand',
  JP: 'Japan',
};

export function truncatePubkey(pubkey: string, left = 4, right = 4): string {
  if (pubkey.length <= left + right + 1) {
    return pubkey;
  }
  return `${pubkey.slice(0, left)}…${pubkey.slice(-right)}`;
}

export function formatDataMb(dataMb: number): string {
  if (dataMb >= 1024 && dataMb % 1024 === 0) {
    return `${dataMb / 1024} GB`;
  }
  return `${dataMb} MB`;
}

export function formatLamportsAsSol(lamports: string): string {
  const value = Number(lamports) / 1_000_000_000;
  return `${value.toFixed(3)} SOL`;
}

export function countryLabel(code: CountryCode): string {
  return COUNTRY_LABELS[code] ?? code;
}
