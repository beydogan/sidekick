/**
 * Banner primitive for displaying contextual messages
 */

import React from 'react';
import {View, StyleSheet, ViewProps} from 'react-native';
import {colors, spacing, radii} from '../../theme';
import {Text} from './Text';

type BannerVariant = 'default' | 'error' | 'success' | 'warning';

interface BannerProps extends ViewProps {
  variant?: BannerVariant;
  children: React.ReactNode;
}

const variantStyles = {
  default: {
    backgroundColor: colors.selection,
    borderColor: colors.borderLight,
    textColor: colors.textSecondary,
  },
  error: {
    backgroundColor: 'rgba(255, 59, 48, 0.08)',
    borderColor: 'rgba(255, 59, 48, 0.2)',
    textColor: colors.error,
  },
  success: {
    backgroundColor: 'rgba(52, 199, 89, 0.08)',
    borderColor: 'rgba(52, 199, 89, 0.2)',
    textColor: colors.success,
  },
  warning: {
    backgroundColor: 'rgba(255, 149, 0, 0.08)',
    borderColor: 'rgba(255, 149, 0, 0.2)',
    textColor: colors.warning,
  },
};

export const Banner: React.FC<BannerProps> = ({
  variant = 'default',
  children,
  style,
  ...props
}) => {
  const variantStyle = variantStyles[variant];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: variantStyle.backgroundColor,
          borderColor: variantStyle.borderColor,
        },
        style,
      ]}
      {...props}>
      {typeof children === 'string' ? (
        <Text variant="caption" color={variantStyle.textColor}>
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
  },
});
