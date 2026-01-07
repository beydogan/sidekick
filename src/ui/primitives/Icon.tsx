/**
 * Icon primitives
 */

import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from './Text';
import {colors} from '../../theme';

interface IconProps {
  size?: number;
  color?: string;
}

export const PricingIcon: React.FC<IconProps & {selected?: boolean}> = ({
  size = 16,
  color,
  selected = false,
}) => {
  const iconColor = color || (selected ? colors.iconSelected : colors.iconDefault);

  return (
    <View style={[styles.iconContainer, {width: size, height: size}]}>
      <Text
        style={[
          styles.iconText,
          {fontSize: size * 0.85, color: iconColor, fontWeight: '600'},
        ]}>
        $
      </Text>
    </View>
  );
};

export const ChevronDownIcon: React.FC<IconProps> = ({
  size = 12,
  color = colors.textSecondary,
}) => {
  return (
    <View style={[styles.iconContainer, {width: size, height: size}]}>
      <Text style={{fontSize: size, color}}>▾</Text>
    </View>
  );
};

export const AppIcon: React.FC<IconProps> = ({
  size = 32,
  color = colors.primary,
}) => {
  return (
    <View
      style={[
        styles.appIconContainer,
        {
          width: size,
          height: size,
          borderRadius: size * 0.22,
          backgroundColor: color,
        },
      ]}>
      <Text style={[styles.appIconText, {fontSize: size * 0.5}]}>✦</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {},
  appIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  appIconText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
