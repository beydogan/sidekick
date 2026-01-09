/**
 * NavigationHeader - Header with back button and title for page navigation
 */

import React from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Text, ChevronLeftIcon, Pressable} from '../primitives';
import {colors, spacing, radii} from '../../theme';

interface NavigationHeaderProps {
  title: string;
  onBack?: () => void;
  showBack?: boolean;
  rightAction?: {
    label: string;
    onPress: () => void;
    disabled?: boolean;
    loading?: boolean;
  };
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  title,
  onBack,
  showBack = true,
  rightAction,
}) => {
  const navigation = useNavigation();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      {showBack ? (
        <Pressable style={styles.backButton} onPress={handleBack}>
          <ChevronLeftIcon size={20} color={colors.primary} />
        </Pressable>
      ) : (
        <View style={styles.leftPadding} />
      )}
      <Text variant="headline" style={styles.title}>
        {title}
      </Text>
      {rightAction ? (
        <Pressable
          style={[
            styles.actionButton,
            rightAction.disabled && styles.actionButtonDisabled,
          ]}
          onPress={rightAction.onPress}
          disabled={rightAction.disabled || rightAction.loading}
          hoverStyle={styles.actionButtonHover}>
          {rightAction.loading ? (
            <ActivityIndicator size="small" color={colors.content} />
          ) : (
            <Text variant="bodyMedium" color={colors.content}>
              {rightAction.label}
            </Text>
          )}
        </Pressable>
      ) : (
        <View style={styles.rightPlaceholder} />
      )}
    </View>
  );
};

const HEADER_HEIGHT = 52;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: HEADER_HEIGHT,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.content,
    gap: spacing.sm,
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.md,
  },
  leftPadding: {
    width: spacing.sm,
  },
  rightPlaceholder: {
    width: 72,
  },
  title: {
    flex: 1,
  },
  actionButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    minWidth: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionButtonHover: {
    opacity: 0.9,
  },
});
