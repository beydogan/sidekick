/**
 * Text primitive with typography variants
 */

import React from 'react';
import {Text as RNText, TextProps as RNTextProps, StyleSheet} from 'react-native';
import {colors, typography} from '../../theme';

type TextVariant = keyof typeof typography;

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: string;
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  color,
  style,
  children,
  ...props
}) => {
  const variantStyle = typography[variant];

  return (
    <RNText
      style={[
        styles.base,
        variantStyle,
        color ? {color} : {color: colors.textPrimary},
        style,
      ]}
      {...props}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  base: {
    color: colors.textPrimary,
    cursor: 'default' as 'auto',
  },
});
