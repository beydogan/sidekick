/**
 * AppSelector - Dropdown for selecting apps
 */

import React, {useState, useRef} from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import {Text, AppIcon, ChevronDownIcon} from '../primitives';
import {colors, spacing, radii, typography, shadows} from '../../theme';

export interface App {
  id: string;
  name: string;
  iconColor?: string;
}

interface AppSelectorProps {
  apps: App[];
  selectedApp: App | null;
  onSelectApp: (app: App) => void;
}

const DropdownItem: React.FC<{
  app: App;
  isSelected: boolean;
  onPress: () => void;
}> = ({app, isSelected, onPress}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={[
        styles.dropdownItem,
        isHovered && styles.dropdownItemHovered,
        isSelected && styles.dropdownItemSelected,
      ]}>
      <AppIcon size={24} color={app.iconColor || colors.primary} />
      <Text variant="body" style={styles.dropdownItemText} numberOfLines={1}>
        {app.name}
      </Text>
      {isSelected && (
        <Text variant="body" color={colors.primary} style={{fontWeight: '600'}}>
          ✓
        </Text>
      )}
    </Pressable>
  );
};

export const AppSelector: React.FC<AppSelectorProps> = ({
  apps,
  selectedApp,
  onSelectApp,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({x: 0, y: 0});
  const buttonRef = useRef<View>(null);

  const handlePress = () => {
    buttonRef.current?.measureInWindow((x, y, width, height) => {
      setDropdownPosition({x, y: y + height + 4});
      setIsOpen(true);
    });
  };

  const handleSelectApp = (app: App) => {
    onSelectApp(app);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <Pressable
        ref={buttonRef}
        onPress={handlePress}
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        style={[styles.selector, isHovered && styles.selectorHovered]}>
        <View style={styles.appInfo}>
          <AppIcon size={28} color={selectedApp?.iconColor || colors.primary} />
          <View style={styles.appDetails}>
            <Text variant="bodyMedium" numberOfLines={1}>
              {selectedApp?.name || 'Select App'}
            </Text>
            <Text variant="caption" color={colors.textSecondary} style={{marginTop: 1}}>
              App Store Connect
            </Text>
          </View>
        </View>
        <ChevronDownIcon size={10} color={colors.textTertiary} />
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="none"
        onRequestClose={() => setIsOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setIsOpen(false)}>
          <View
            style={[
              styles.dropdown,
              {left: dropdownPosition.x, top: dropdownPosition.y},
            ]}>
            <ScrollView style={styles.dropdownScroll} bounces={false}>
              {apps.map(app => (
                <DropdownItem
                  key={app.id}
                  app={app}
                  isSelected={selectedApp?.id === app.id}
                  onPress={() => handleSelectApp(app)}
                />
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.sm,
    borderRadius: radii.lg,
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
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  dropdown: {
    position: 'absolute',
    width: 220,
    backgroundColor: colors.dropdownBackground,
    borderRadius: radii.lg,
    borderWidth: 0.5,
    borderColor: colors.dropdownBorder,
    ...shadows.dropdown,
    overflow: 'hidden',
  },
  dropdownScroll: {
    maxHeight: 300,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
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
});
