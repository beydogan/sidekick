/**
 * AppSelector - Dropdown for selecting apps
 */

import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, ActivityIndicator} from 'react-native';
import {Text, AppIcon, ChevronDownIcon, Pressable} from '../primitives';
import {colors, spacing, radii, zIndex} from '../../theme';

export interface App {
  id: string;
  name: string;
  iconColor?: string;
}

interface AppSelectorProps {
  apps: App[];
  selectedApp: App | null;
  onSelectApp: (app: App) => void;
  isLoading?: boolean;
}

export const AppSelector: React.FC<AppSelectorProps> = ({
  apps,
  selectedApp,
  onSelectApp,
  isLoading = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectorHovered, setSelectorHovered] = useState(false);

  const handlePress = () => {
    if (!isLoading && apps.length > 0) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelectApp = (app: App) => {
    onSelectApp(app);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handlePress}
        onHoverIn={() => setSelectorHovered(true)}
        onHoverOut={() => setSelectorHovered(false)}
        style={[
          styles.selector,
          selectorHovered && !isLoading && apps.length > 0 && styles.selectorHovered,
        ]}>
        <View style={styles.appInfo}>
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <AppIcon size={28} color={selectedApp?.iconColor} />
          )}
          <View style={styles.appDetails}>
            <Text variant="bodyMedium" numberOfLines={1}>
              {isLoading ? 'Loading apps...' : selectedApp?.name || 'Select App'}
            </Text>
            <Text
              variant="caption"
              color={colors.textSecondary}
              style={styles.subtitle}>
              App Store Connect
            </Text>
          </View>
        </View>
        {!isLoading && apps.length > 0 && (
          <ChevronDownIcon size={10} color={colors.textTertiary} />
        )}
      </Pressable>

      {isOpen && (
        <View style={styles.dropdown}>
          <ScrollView style={styles.dropdownScroll} bounces={false}>
            {apps.map(app => {
              const isSelected = selectedApp?.id === app.id;
              const isHovered = hoveredId === app.id;

              return (
                <Pressable
                  key={app.id}
                  onPress={() => handleSelectApp(app)}
                  onHoverIn={() => setHoveredId(app.id)}
                  onHoverOut={() => setHoveredId(null)}
                  style={[
                    styles.dropdownItem,
                    isHovered && styles.dropdownItemHovered,
                    isSelected && styles.dropdownItemSelected,
                  ]}>
                  <AppIcon size={24} color={app.iconColor} />
                  <Text variant="body" style={styles.dropdownItemText} numberOfLines={1}>
                    {app.name}
                  </Text>
                  {isSelected && (
                    <Text variant="body" color={colors.primary} style={styles.checkmark}>
                      ✓
                    </Text>
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    position: 'relative',
    zIndex: zIndex.dropdown,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.sm,
    borderRadius: radii.lg,
    backgroundColor: 'transparent',
  },
  selectorHovered: {
    backgroundColor: colors.selectionHover,
  },
  appInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  appDetails: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  subtitle: {
    marginTop: 1,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: spacing.md,
    right: spacing.md,
    marginTop: spacing.xs,
    backgroundColor: colors.dropdownBackground,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.dropdownBorder,
    overflow: 'hidden',
    zIndex: zIndex.dropdown,
  },
  dropdownScroll: {
    maxHeight: 300,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    backgroundColor: 'transparent',
  },
  dropdownItemHovered: {
    backgroundColor: colors.selectionHover,
  },
  dropdownItemSelected: {
    backgroundColor: colors.selection,
  },
  dropdownItemText: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  checkmark: {
    fontWeight: '600',
  },
});
