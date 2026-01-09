/**
 * StatusIndicator - Colored dot/icon for version states
 */

import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Check} from 'lucide-react-native';
import {colors} from '../../theme';
import type {VersionStateCategory} from '../../features/versions/utils';

interface StatusIndicatorProps {
  category: VersionStateCategory;
  size?: number;
}

const categoryColors: Record<VersionStateCategory, string> = {
  editable: colors.warning,
  inProgress: colors.primary,
  live: colors.success,
  removed: colors.textTertiary,
};

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  category,
  size = 8,
}) => {
  const color = categoryColors[category];

  if (category === 'live') {
    return (
      <View style={[styles.checkContainer, {width: size + 4, height: size + 4}]}>
        <Check size={size} color={color} strokeWidth={3} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.dot,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  dot: {},
  checkContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
