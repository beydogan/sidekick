/**
 * Sidebar - Main navigation sidebar
 */

import React from 'react';
import {View, StyleSheet} from 'react-native';
import {colors, spacing, layout} from '../../theme';
import {AppSelector, App} from './AppSelector';
import {MenuItem} from './MenuItem';
import {PricingIcon} from '../primitives';

interface SidebarProps {
  apps: App[];
  selectedApp: App | null;
  onSelectApp: (app: App) => void;
  selectedMenuItem: string;
  onSelectMenuItem: (item: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  apps,
  selectedApp,
  onSelectApp,
  selectedMenuItem,
  onSelectMenuItem,
}) => {
  return (
    <View style={styles.container}>
      <AppSelector
        apps={apps}
        selectedApp={selectedApp}
        onSelectApp={onSelectApp}
      />

      <View style={styles.menu}>
        <MenuItem
          label="Pricing"
          icon={<PricingIcon selected={selectedMenuItem === 'pricing'} />}
          selected={selectedMenuItem === 'pricing'}
          onPress={() => onSelectMenuItem('pricing')}
        />
      </View>

      <View style={styles.spacer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: layout.sidebarWidth,
    backgroundColor: colors.sidebar,
    borderRightWidth: 1,
    borderRightColor: colors.sidebarBorder,
    paddingTop: spacing.xxxl,
  },
  menu: {
    paddingTop: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  spacer: {
    flex: 1,
  },
});
