/**
 * Icon primitives
 */

import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
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

export const ChevronLeftIcon: React.FC<IconProps> = ({
  size = 16,
  color = colors.textSecondary,
}) => {
  return (
    <View style={[styles.iconContainer, {width: size, height: size}]}>
      <Text style={{fontSize: size, color}}>‹</Text>
    </View>
  );
};

export const SettingsIcon: React.FC<IconProps & {selected?: boolean}> = ({
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
          {fontSize: size * 0.85, color: iconColor, fontWeight: '500'},
        ]}>
        ⚙
      </Text>
    </View>
  );
};

export const SubscriptionIcon: React.FC<IconProps & {selected?: boolean}> = ({
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
          {fontSize: size * 0.85, color: iconColor, fontWeight: '500'},
        ]}>
        ↻
      </Text>
    </View>
  );
};

interface AppIconProps {
  size?: number;
  iconUrl?: string;
}

const defaultIcon = require('../../../assets/logo.png');

export const AppIcon: React.FC<AppIconProps> = ({
  size = 32,
  iconUrl,
}) => {
  const borderRadius = size * 0.22;

  return (
    <Image
      source={iconUrl ? {uri: iconUrl} : defaultIcon}
      style={{
        width: size,
        height: size,
        borderRadius,
      }}
    />
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {},
});
