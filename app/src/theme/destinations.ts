import type { CountryCode } from '../../../shared/types';

export type DestinationTheme = {
  code: CountryCode;
  name: string;
};

export const DESTINATIONS: Record<CountryCode, DestinationTheme> = {
  TH: { code: 'TH', name: 'Thailand' },
  JP: { code: 'JP', name: 'Japan' },
  US: { code: 'US', name: 'United States' },
  KR: { code: 'KR', name: 'South Korea' },
  SG: { code: 'SG', name: 'Singapore' },
  VN: { code: 'VN', name: 'Vietnam' },
  FR: { code: 'FR', name: 'France' },
  DE: { code: 'DE', name: 'Germany' },
  GB: { code: 'GB', name: 'United Kingdom' },
  AU: { code: 'AU', name: 'Australia' },
  MX: { code: 'MX', name: 'Mexico' },
  BR: { code: 'BR', name: 'Brazil' },
};

export function destinationFor(country: CountryCode): DestinationTheme {
  return DESTINATIONS[country];
}
