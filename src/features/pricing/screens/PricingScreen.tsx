/**
 * PricingScreen - Main pricing management screen
 */

import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Screen, Text} from '../../../ui';
import {colors, spacing} from '../../../theme';

interface PricingScreenProps {
  appName?: string;
}

export const PricingScreen: React.FC<PricingScreenProps> = ({appName}) => {
  return (
    <Screen>
      <View style={styles.header}>
        <Text variant="title">Pricing</Text>
        {appName && (
          <Text variant="body" color={colors.textSecondary} style={styles.subtitle}>
            Manage pricing for {appName}
          </Text>
        )}
      </View>

      <View style={styles.content}>
        {/* Pricing content will go here */}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.xxl,
  },
  subtitle: {
    marginTop: spacing.xs,
  },
  content: {
    flex: 1,
  },
});
