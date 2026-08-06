import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { colors } from '../theme/tokens';

type Props = { focused: boolean; size?: number };

function tone(focused: boolean) {
  return focused ? colors.accent : colors.tabInactive;
}

export function PlansTabIcon({ focused, size = 22 }: Props) {
  const c = tone(focused);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={c} strokeWidth={1.6} />
      <Path
        d="M3.5 12h17M12 3.5c2.4 2.6 3.6 5.4 3.6 8.5S14.4 17.9 12 20.5C9.6 17.9 8.4 15.1 8.4 12S9.6 6.1 12 3.5z"
        stroke={c}
        strokeWidth={1.6}
      />
    </Svg>
  );
}

export function EsimsTabIcon({ focused, size = 22 }: Props) {
  const c = tone(focused);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7 3.8h7.2L19 8.6V20.2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.8a1 1 0 0 1 1-1z"
        stroke={c}
        strokeWidth={1.6}
      />
      <Rect x="9" y="11" width="6" height="6" rx="1" stroke={c} strokeWidth={1.6} />
    </Svg>
  );
}

export function WalletTabIcon({ focused, size = 22 }: Props) {
  const c = tone(focused);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18a1 1 0 0 1 1 1v1.2"
        stroke={c}
        strokeWidth={1.6}
      />
      <Path
        d="M4 8h15.5A1.5 1.5 0 0 1 21 9.5v8A1.5 1.5 0 0 1 19.5 19H5.5A1.5 1.5 0 0 1 4 17.5V8z"
        stroke={c}
        strokeWidth={1.6}
      />
      <Circle cx="16.5" cy="13.5" r="1.2" fill={c} />
    </Svg>
  );
}
