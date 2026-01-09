/**
 * SegmentedControl - Apple-style segmented picker control
 */

import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Pressable} from './Pressable';
import {Text} from './Text';
import {colors, spacing, radii} from '../../theme';

interface SegmentOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  disabled = false,
}: SegmentedControlProps<T>) {
  return (
    <View style={styles.track}>
      {options.map((option, index) => {
        const isSelected = option.value === value;
        const isFirst = index === 0;
        const isLast = index === options.length - 1;

        return (
          <Pressable
            key={option.value}
            style={[
              styles.segment,
              isSelected && styles.segmentSelected,
              isFirst && styles.segmentFirst,
              isLast && styles.segmentLast,
            ]}
            onPress={() => onChange(option.value)}
            disabled={disabled}
            hoverStyle={!isSelected ? styles.segmentHover : undefined}>
            <Text
              variant="body"
              color={isSelected ? colors.primary : colors.textSecondary}
              style={isSelected ? styles.labelSelected : undefined}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    backgroundColor: colors.sidebar,
    borderRadius: radii.lg,
    padding: 2,
  },
  segment: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.md,
  },
  segmentFirst: {
    borderTopLeftRadius: radii.md,
    borderBottomLeftRadius: radii.md,
  },
  segmentLast: {
    borderTopRightRadius: radii.md,
    borderBottomRightRadius: radii.md,
  },
  segmentSelected: {
    backgroundColor: colors.content,
  },
  segmentHover: {
    backgroundColor: colors.selectionHover,
  },
  labelSelected: {
    fontWeight: '500',
  },
});
