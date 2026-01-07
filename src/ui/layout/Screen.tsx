/**
 * Screen - Base layout container
 */

import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {colors, spacing} from '../../theme';

interface ScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padded?: boolean;
}

export const Screen: React.FC<ScreenProps> = ({
  children,
  style,
  padded = true,
}) => {
  return (
    <View style={[styles.container, padded && styles.padded, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.content,
  },
  padded: {
    padding: spacing.xxl,
  },
});
