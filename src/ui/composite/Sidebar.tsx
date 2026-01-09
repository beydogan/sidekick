/**
 * Sidebar - Main navigation sidebar
 */

import React from 'react';
import {View, StyleSheet} from 'react-native';
import {colors, spacing, layout, typography} from '../../theme';
import {AppSelector, App} from './AppSelector';
import {MenuItem} from './MenuItem';
import {Text} from '../primitives';
import {
  PricingIcon,
  SettingsIcon,
  SubscriptionIcon,
  AppInfoIcon,
  LocaleIcon,
} from '../primitives';
import type {SidebarSection} from '../../app/navigation';

interface SidebarProps {
  apps: App[];
  selectedApp: App | null;
  onSelectApp: (app: App) => void;
  selectedMenuItem: SidebarSection;
  onSelectMenuItem: (item: SidebarSection) => void;
  showSettings?: boolean;
  isLoadingApps?: boolean;
}

const SectionHeader: React.FC<{title: string; first?: boolean}> = ({
  title,
  first,
}) => (
  <View style={[styles.sectionHeader, !first && styles.sectionHeaderSpacing]}>
    <Text style={styles.sectionHeaderText}>{title}</Text>
  </View>
);

export const Sidebar: React.FC<SidebarProps> = ({
  apps,
  selectedApp,
  onSelectApp,
  selectedMenuItem,
  onSelectMenuItem,
  showSettings = false,
  isLoadingApps = false,
}) => {
  return (
    <View style={styles.container}>
      <AppSelector
        apps={apps}
        selectedApp={selectedApp}
        onSelectApp={onSelectApp}
        isLoading={isLoadingApps}
      />

      <View style={styles.menu}>
        <SectionHeader title="General" first />
        <MenuItem
          label="App Info"
          icon={<AppInfoIcon selected={selectedMenuItem === 'app-info'} />}
          selected={selectedMenuItem === 'app-info'}
          onPress={() => onSelectMenuItem('app-info')}
        />
        <MenuItem
          label="App Settings"
          icon={<LocaleIcon selected={selectedMenuItem === 'app-settings'} />}
          selected={selectedMenuItem === 'app-settings'}
          onPress={() => onSelectMenuItem('app-settings')}
        />

        <SectionHeader title="Monetization" />
        <MenuItem
          label="Pricing"
          icon={<PricingIcon selected={selectedMenuItem === 'pricing'} />}
          selected={selectedMenuItem === 'pricing'}
          onPress={() => onSelectMenuItem('pricing')}
        />
        <MenuItem
          label="Subscriptions"
          icon={<SubscriptionIcon selected={selectedMenuItem === 'subscriptions'} />}
          selected={selectedMenuItem === 'subscriptions'}
          onPress={() => onSelectMenuItem('subscriptions')}
        />
      </View>

      <View style={styles.spacer} />

      {showSettings && (
        <View style={styles.bottomMenu}>
          <MenuItem
            label="Settings"
            icon={<SettingsIcon selected={selectedMenuItem === 'settings'} />}
            selected={selectedMenuItem === 'settings'}
            onPress={() => onSelectMenuItem('settings')}
          />
        </View>
      )}
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
    // Explicitly disable shadows to prevent RN macOS bug with NULL CGColor
    shadowColor: '#000',
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: {width: 0, height: 0},
  },
  menu: {
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  sectionHeader: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
  },
  sectionHeaderText: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
    letterSpacing: 0.3,
  },
  sectionHeaderSpacing: {
    marginTop: spacing.xl,
  },
  spacer: {
    flex: 1,
  },
  bottomMenu: {
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.sidebarBorder,
    paddingTop: spacing.sm,
  },
});
