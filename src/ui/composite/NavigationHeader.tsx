/**
 * NavigationHeader - Header with back button and title for page navigation
 */

import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, ChevronLeftIcon, Pressable} from '../primitives';
import {colors, spacing} from '../../theme';

interface NavigationHeaderProps {
  title: string;
  onBack?: () => void;
  showBack?: boolean;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  title,
  onBack,
  showBack = true,
}) => {
  return (
    <View style={styles.container}>
      {showBack && onBack ? (
        <Pressable style={styles.backButton} onPress={onBack}>
          <ChevronLeftIcon size={20} color={colors.primary} />
        </Pressable>
      ) : (
        <View style={styles.backPlaceholder} />
      )}
      <Text variant="headline" style={styles.title}>
        {title}
      </Text>
      <View style={styles.backPlaceholder} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.content,
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  backPlaceholder: {
    width: 32,
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
});
