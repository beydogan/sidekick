import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, TextInput} from '@ui';
import {colors, spacing, typography, radii} from '@theme';

interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  editable?: boolean;
  multiline?: boolean;
  mono?: boolean;
  aiModified?: boolean;
  onClearAIModified?: () => void;
}

export function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  editable = true,
  multiline = false,
  mono = false,
  aiModified = false,
  onClearAIModified,
}: FormFieldProps) {
  const handleChangeText = (text: string) => {
    onChangeText(text);
    onClearAIModified?.();
  };

  return (
    <View style={[styles.field, aiModified && styles.fieldAIModified]}>
      <View style={styles.fieldHeader}>
        <Text style={styles.label}>{label}</Text>
        {aiModified && (
          <View style={styles.aiBadge}>
            <Text style={styles.aiBadgeText}>AI</Text>
          </View>
        )}
      </View>
      <TextInput
        style={[styles.input, multiline && styles.multilineInput]}
        value={value}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        editable={editable}
        multiline={multiline}
        mono={mono}
        autoCapitalize={mono ? 'none' : undefined}
        autoCorrect={!mono}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  fieldAIModified: {
    backgroundColor: 'rgba(147, 112, 219, 0.08)',
    borderLeftWidth: 3,
    borderLeftColor: 'rgba(147, 112, 219, 0.5)',
    marginLeft: -spacing.lg,
    paddingLeft: spacing.lg - 3 + spacing.lg,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  input: {
    ...typography.body,
    color: colors.textPrimary,
    padding: 0,
    marginTop: spacing.xs,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  aiBadge: {
    backgroundColor: 'rgba(147, 112, 219, 0.15)',
    paddingHorizontal: spacing.xs,
    paddingVertical: 1,
    borderRadius: radii.sm,
  },
  aiBadgeText: {
    ...typography.caption,
    fontSize: 9,
    fontWeight: '600',
    color: 'rgba(147, 112, 219, 1)',
    letterSpacing: 0.5,
  },
});
