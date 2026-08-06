import type { CountryCode } from '../../../shared/types';

export type DestinationTheme = {
  code: CountryCode;
  name: string;
};

export const DESTINATIONS: Record<CountryCode, DestinationTheme> = {
  TH: { code: 'TH', name: 'Thailand' },
  JP: { code: 'JP', name: 'Japan' },
};

export function destinationFor(country: CountryCode): DestinationTheme {
  return DESTINATIONS[country];
}
