/** Solsim — flat startup UI (Linear / Stripe-adjacent). */
export const colors = {
  bg: '#0B0B0C',
  bgElevated: '#121214',
  surface: '#161618',
  surfaceHover: '#1C1C1F',
  border: '#2A2A2E',
  borderStrong: '#3A3A40',
  text: '#EDEDEF',
  textSecondary: '#A0A0A8',
  textTertiary: '#6F6F78',
  accent: '#2EC4B6',
  accentMuted: 'rgba(46,196,182,0.12)',
  accentText: '#0B0B0C',
  danger: '#E5484D',
  warning: '#F5A524',
  success: '#2EC4B6',
  overlay: 'rgba(11,11,12,0.72)',
  white: '#FFFFFF',
  tabInactive: '#6F6F78',
  accentDim: 'rgba(46,196,182,0.2)',
} as const;

export const fonts = {
  body: 'DMSans-Regular',
  bodyMedium: 'DMSans-Medium',
  bodySemi: 'DMSans-SemiBold',
} as const;

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 40,
} as const;

export const radius = {
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12,
} as const;

export const type = {
  brand: {
    fontFamily: fonts.bodySemi,
    fontSize: 22,
    letterSpacing: -0.4,
    lineHeight: 28,
  },
  hero: {
    fontFamily: fonts.bodySemi,
    fontSize: 28,
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  title: {
    fontFamily: fonts.bodySemi,
    fontSize: 22,
    letterSpacing: -0.3,
    lineHeight: 28,
  },
  headline: {
    fontFamily: fonts.bodySemi,
    fontSize: 16,
    letterSpacing: -0.2,
    lineHeight: 22,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
  },
  bodyStrong: {
    fontFamily: fonts.bodySemi,
    fontSize: 15,
    lineHeight: 22,
  },
  caption: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
  },
  label: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    letterSpacing: 0.2,
  },
};
