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
    // Explicitly disable shadows to prevent RN macOS bug with NULL CGColor
    shadowColor: '#000',
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: {width: 0, height: 0},
  },
  padded: {
    padding: spacing.xxl,
  },
});
