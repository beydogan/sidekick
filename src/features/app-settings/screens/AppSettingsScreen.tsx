import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Screen, Text, NavigationHeader} from '@ui';
import {colors, spacing, typography} from '@theme';

interface AppSettingsScreenProps {
  appId: string;
  appName?: string;
}

export const AppSettingsScreen: React.FC<AppSettingsScreenProps> = ({
  appName,
}) => {
  return (
    <Screen padded={false}>
      <NavigationHeader title="App Settings" showBack={false} />
      <View style={styles.content}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No Settings Available</Text>
          <Text style={styles.emptyDescription}>
            {appName ? `Settings for ${appName} will appear here.` : 'App settings will appear here.'}
          </Text>
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: spacing.xl,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    ...typography.headline,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  emptyDescription: {
    ...typography.body,
    color: colors.textTertiary,
    textAlign: 'center',
  },
});
