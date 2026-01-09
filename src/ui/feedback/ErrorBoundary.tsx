/**
 * ErrorBoundary - Catches errors and logs them instead of crashing
 */

import React, {Component, ErrorInfo} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from '../primitives/Text';
import {Pressable} from '../primitives/Pressable';
import {colors, spacing, radii} from '../../theme';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {hasError: false, error: null};
  }

  static getDerivedStateFromError(error: Error): State {
    return {hasError: true, error};
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error instead of showing RN error modal
    console.error('[ErrorBoundary] Caught error:', error.message);
    console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack);
  }

  handleRetry = () => {
    this.setState({hasError: false, error: null});
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Text variant="headline" style={styles.title}>
              Something went wrong
            </Text>
            <Text variant="body" color={colors.textSecondary} style={styles.message}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </Text>
            <Pressable style={styles.button} onPress={this.handleRetry}>
              <Text variant="bodyMedium" color="#FFFFFF">
                Try Again
              </Text>
            </Pressable>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.content,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    padding: spacing.xxl,
  },
  title: {
    marginBottom: spacing.sm,
  },
  message: {
    marginBottom: spacing.lg,
    textAlign: 'center',
    maxWidth: 300,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.md,
  },
});
