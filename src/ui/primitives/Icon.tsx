/**
 * Icon primitives using Lucide icons
 */

import React from 'react';
import {Image} from 'react-native';
import {
  DollarSign,
  ChevronDown,
  ChevronLeft,
  Settings,
  RefreshCw,
  Info,
  Globe,
  Check,
} from 'lucide-react-native';
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
  const iconColor =
    color || (selected ? colors.iconSelected : colors.iconDefault);

  return <DollarSign size={size} color={iconColor} strokeWidth={2} />;
};

export const ChevronDownIcon: React.FC<IconProps> = ({
  size = 12,
  color = colors.textSecondary,
}) => {
  return <ChevronDown size={size} color={color} strokeWidth={2} />;
};

export const ChevronLeftIcon: React.FC<IconProps> = ({
  size = 16,
  color = colors.textSecondary,
}) => {
  return <ChevronLeft size={size} color={color} strokeWidth={2} />;
};

export const SettingsIcon: React.FC<IconProps & {selected?: boolean}> = ({
  size = 16,
  color,
  selected = false,
}) => {
  const iconColor =
    color || (selected ? colors.iconSelected : colors.iconDefault);

  return <Settings size={size} color={iconColor} strokeWidth={2} />;
};

export const SubscriptionIcon: React.FC<IconProps & {selected?: boolean}> = ({
  size = 16,
  color,
  selected = false,
}) => {
  const iconColor =
    color || (selected ? colors.iconSelected : colors.iconDefault);

  return <RefreshCw size={size} color={iconColor} strokeWidth={2} />;
};

export const AppInfoIcon: React.FC<IconProps & {selected?: boolean}> = ({
  size = 16,
  color,
  selected = false,
}) => {
  const iconColor =
    color || (selected ? colors.iconSelected : colors.iconDefault);

  return <Info size={size} color={iconColor} strokeWidth={2} />;
};

export const LocaleIcon: React.FC<IconProps & {selected?: boolean}> = ({
  size = 16,
  color,
  selected = false,
}) => {
  const iconColor =
    color || (selected ? colors.iconSelected : colors.iconDefault);

  return <Globe size={size} color={iconColor} strokeWidth={2} />;
};

export const CheckIcon: React.FC<IconProps> = ({
  size = 14,
  color = colors.primary,
}) => {
  return <Check size={size} color={color} strokeWidth={2} />;
};

interface AppIconProps {
  size?: number;
  iconUrl?: string;
}

const defaultIcon = require('../../../assets/logo.png');

export const AppIcon: React.FC<AppIconProps> = ({size = 32, iconUrl}) => {
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
