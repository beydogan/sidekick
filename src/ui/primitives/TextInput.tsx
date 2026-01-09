/**
 * TextInput - Text input without macOS focus ring
 */

import React from 'react';
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  StyleSheet,
  StyleProp,
  TextStyle,
} from 'react-native';
import {colors, typography} from '../../theme';

interface TextInputProps extends Omit<RNTextInputProps, 'style'> {
  style?: StyleProp<TextStyle>;
  mono?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
  style,
  mono = false,
  placeholderTextColor = colors.textTertiary,
  ...props
}) => {
  return (
    <RNTextInput
      {...props}
      style={[styles.input, mono && styles.mono, style]}
      placeholderTextColor={placeholderTextColor}
      // @ts-expect-error - macOS specific prop to disable focus ring
      enableFocusRing={false}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    ...typography.body,
    color: colors.textPrimary,
    padding: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  mono: {
    fontFamily: 'Menlo',
    fontSize: 12,
  },
});
