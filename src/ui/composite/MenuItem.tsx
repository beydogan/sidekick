/**
 * MenuItem - Navigation item with selection states
 */

import React, {useState} from 'react';
import {Pressable, View, StyleSheet, ViewStyle} from 'react-native';
import {Text} from '../primitives';
import {colors, spacing, radii, typography, layout} from '../../theme';

interface MenuItemProps {
  label: string;
  icon?: React.ReactNode;
  selected?: boolean;
  onPress?: () => void;
  badge?: number | string;
  style?: ViewStyle;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  label,
  icon,
  selected = false,
  onPress,
  badge,
  style,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const showBackground = selected || isHovered;

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={[
        styles.container,
        showBackground && styles.containerActive,
        selected && styles.containerSelected,
        style,
      ]}>
      {icon && <View style={styles.iconWrapper}>{icon}</View>}
      <Text
        style={[
          selected ? typography.menuItemSelected : typography.menuItem,
          {color: colors.textPrimary},
        ]}
        numberOfLines={1}>
        {label}
      </Text>
      {badge !== undefined && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: layout.menuItemHeight,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    marginVertical: 1,
  },
  containerActive: {
    backgroundColor: colors.selectionHover,
  },
  containerSelected: {
    backgroundColor: colors.selection,
  },
  iconWrapper: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  badgeContainer: {
    backgroundColor: colors.textSecondary,
    borderRadius: radii.round,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginLeft: 'auto',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});
