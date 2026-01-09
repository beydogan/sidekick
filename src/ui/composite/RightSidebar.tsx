/**
 * RightSidebar - Reusable right sidebar for secondary navigation/selection
 */

import React from 'react';
import {View, StyleSheet, ScrollView, ActivityIndicator} from 'react-native';
import {colors, spacing, typography} from '../../theme';
import {Text, Pressable} from '../primitives';

const RIGHT_SIDEBAR_WIDTH = 220;

interface RightSidebarItem {
  id: string;
  label: string;
  selected?: boolean;
  loading?: boolean;
  onPress?: () => void;
  action?: {
    icon: '+' | '-';
    onPress: () => void;
  };
}

interface RightSidebarSection {
  title: string;
  items: RightSidebarItem[];
}

interface RightSidebarProps {
  sections: RightSidebarSection[];
}

const SectionHeader: React.FC<{title: string; first?: boolean}> = ({
  title,
  first,
}) => (
  <View style={[styles.sectionHeader, !first && styles.sectionHeaderSpacing]}>
    <Text style={styles.sectionHeaderText}>{title}</Text>
  </View>
);

const SidebarItem: React.FC<RightSidebarItem> = ({
  label,
  selected,
  loading,
  onPress,
  action,
}) => (
  <View style={styles.itemContainer}>
    <Pressable
      style={[styles.item, selected && styles.itemSelected]}
      onPress={onPress}
      disabled={loading}>
      <Text
        style={[styles.itemLabel, selected && styles.itemLabelSelected, loading && styles.itemLabelLoading]}
        numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
    {loading ? (
      <View style={styles.actionButton}>
        <ActivityIndicator size="small" color={colors.textSecondary} />
      </View>
    ) : action && (
      <Pressable
        style={styles.actionButton}
        onPress={action.onPress}
        hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
        <Text style={styles.actionIcon}>{action.icon}</Text>
      </Pressable>
    )}
  </View>
);

export const RightSidebar: React.FC<RightSidebarProps> = ({sections}) => {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {sections.map((section, index) => (
          <View key={section.title}>
            <SectionHeader title={section.title} first={index === 0} />
            {section.items.map(item => (
              <SidebarItem key={item.id} {...item} />
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: RIGHT_SIDEBAR_WIDTH,
    backgroundColor: colors.sidebar,
    borderLeftWidth: 1,
    borderLeftColor: colors.sidebarBorder,
  },
  scrollView: {
    flex: 1,
    paddingTop: spacing.lg,
  },
  sectionHeader: {
    paddingHorizontal: spacing.lg,
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
    marginTop: spacing.lg,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: spacing.sm,
  },
  item: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 0,
  },
  itemSelected: {
    backgroundColor: colors.selection,
  },
  itemLabel: {
    ...typography.body,
    color: colors.textPrimary,
  },
  itemLabelSelected: {
    ...typography.bodyMedium,
    color: colors.primary,
  },
  itemLabelLoading: {
    opacity: 0.5,
  },
  actionButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  actionIcon: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
  },
});
