/**
 * SectionNavigator - Manages which navigation stack is visible
 *
 * Uses show/hide pattern (not unmount) to preserve each section's
 * navigation state when switching between sidebar items.
 */

import React from 'react';
import {View, StyleSheet} from 'react-native';
import {
  NavigationContainer,
  NavigationIndependentTree,
} from '@react-navigation/native';
import {
  PricingStack,
  SubscriptionsStack,
  SettingsStack,
  AppInfoStack,
  AppSettingsStack,
} from './stacks';
import type {SidebarSection} from './types';

interface SectionNavigatorProps {
  activeSection: SidebarSection;
  appId?: string;
  appName?: string;
  onConnectionSuccess?: () => void;
}

export function SectionNavigator({
  activeSection,
  appId,
  appName,
  onConnectionSuccess,
}: SectionNavigatorProps) {
  // Don't render app-dependent stacks until we have an app selected
  const hasApp = appId && appName;

  return (
    <View style={styles.container}>
      {/* App Info Stack - key forces remount when app changes */}
      {hasApp && (
        <View
          key={`app-info-${appId}`}
          style={[
            styles.stack,
            activeSection === 'app-info' ? styles.visible : styles.hidden,
          ]}>
          <NavigationIndependentTree>
            <NavigationContainer>
              <AppInfoStack appId={appId} appName={appName} />
            </NavigationContainer>
          </NavigationIndependentTree>
        </View>
      )}

      {/* App Settings Stack - key forces remount when app changes */}
      {hasApp && (
        <View
          key={`app-settings-${appId}`}
          style={[
            styles.stack,
            activeSection === 'app-settings' ? styles.visible : styles.hidden,
          ]}>
          <NavigationIndependentTree>
            <NavigationContainer>
              <AppSettingsStack appId={appId} appName={appName} />
            </NavigationContainer>
          </NavigationIndependentTree>
        </View>
      )}

      {/* Pricing Stack - key forces remount when app changes */}
      {hasApp && (
        <View
          key={`pricing-${appId}`}
          style={[
            styles.stack,
            activeSection === 'pricing' ? styles.visible : styles.hidden,
          ]}>
          <NavigationIndependentTree>
            <NavigationContainer>
              <PricingStack appId={appId} appName={appName} />
            </NavigationContainer>
          </NavigationIndependentTree>
        </View>
      )}

      {/* Subscriptions Stack - key forces remount when app changes */}
      {hasApp && (
        <View
          key={`subscriptions-${appId}`}
          style={[
            styles.stack,
            activeSection === 'subscriptions' ? styles.visible : styles.hidden,
          ]}>
          <NavigationIndependentTree>
            <NavigationContainer>
              <SubscriptionsStack appId={appId} appName={appName} />
            </NavigationContainer>
          </NavigationIndependentTree>
        </View>
      )}

      {/* Settings Stack */}
      <View
        style={[
          styles.stack,
          activeSection === 'settings' ? styles.visible : styles.hidden,
        ]}>
        <NavigationIndependentTree>
          <NavigationContainer>
            <SettingsStack onConnectionSuccess={onConnectionSuccess} />
          </NavigationContainer>
        </NavigationIndependentTree>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stack: {
    ...StyleSheet.absoluteFillObject,
  },
  visible: {
    opacity: 1,
    zIndex: 1,
  },
  hidden: {
    opacity: 0,
    zIndex: 0,
    pointerEvents: 'none',
  },
});
