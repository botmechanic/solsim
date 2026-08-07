import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, space, type } from '../theme/tokens';

type Props = {
  children: ReactNode;
};

type State = {
  error: Error | null;
};

/** Catches render crashes so the demo doesn't dump to a redbox / blank kill. */
export class AppErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[AppErrorBoundary]', error.message, info.componentStack);
  }

  private onRetry = (): void => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.body}>
            Tap retry to keep going. If this keeps happening, reinstall with
            `npm run android:stable`.
          </Text>
          <Pressable
            onPress={this.onRetry}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}>
            <Text style={styles.buttonLabel}>Retry</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: 'center',
    padding: space.xl,
    gap: space.md,
  },
  title: {
    ...type.title,
    color: colors.text,
  },
  body: {
    ...type.body,
    color: colors.textSecondary,
  },
  button: {
    marginTop: space.md,
    alignSelf: 'flex-start',
    backgroundColor: colors.accent,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    borderRadius: radius.md,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonLabel: {
    ...type.bodyStrong,
    color: colors.bg,
  },
});
