import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Pressable} from './Pressable';
import {Text} from './Text';
import {ChevronDownIcon, CheckIcon} from './Icon';
import {colors, spacing, radii} from '../../theme';

interface DropdownOption<T extends string> {
  value: T;
  label: string;
}

interface DropdownProps<T extends string> {
  options: DropdownOption<T>[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function Dropdown<T extends string>({
  options,
  value,
  onChange,
  disabled = false,
  placeholder = 'Select...',
}: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(o => o.value === value);

  const handlePress = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
  };

  const handleSelect = (optionValue: T) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.button, disabled && styles.buttonDisabled]}
        onPress={handlePress}
        disabled={disabled}>
        <Text
          variant="body"
          color={selectedOption ? colors.textPrimary : colors.textTertiary}>
          {selectedOption?.label ?? placeholder}
        </Text>
        <ChevronDownIcon size={14} color={colors.textSecondary} />
      </Pressable>

      {isOpen && (
        <>
          <Pressable style={styles.backdrop} onPress={() => setIsOpen(false)} />
          <View style={styles.menu}>
            {options.map(option => (
              <Pressable
                key={option.value}
                style={[
                  styles.menuItem,
                  option.value === value && styles.menuItemSelected,
                ]}
                onPress={() => handleSelect(option.value)}
                hoverStyle={styles.menuItemHover}>
                <Text
                  variant="body"
                  color={
                    option.value === value ? colors.primary : colors.textPrimary
                  }>
                  {option.label}
                </Text>
                {option.value === value && (
                  <CheckIcon size={14} color={colors.primary} />
                )}
              </Pressable>
            ))}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.sidebar,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    minWidth: 140,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  backdrop: {
    position: 'absolute',
    top: -5000,
    left: -5000,
    right: -5000,
    bottom: -5000,
    zIndex: 999,
  },
  menu: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: spacing.xs,
    backgroundColor: colors.content,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    paddingVertical: spacing.xs,
    minWidth: 140,
    zIndex: 1000,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  menuItemSelected: {
    backgroundColor: colors.selectionHover,
  },
  menuItemHover: {
    backgroundColor: colors.selectionHover,
  },
});
