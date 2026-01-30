import React, {useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Text, Pressable} from '@ui';
import {colors, spacing, typography, radii} from '@theme';
import {getLocaleName, getCategoryName} from '../constants';
import type {App, AppCategory} from '@libs/appStoreConnect';

interface GeneralInfoSectionProps {
  app: App | undefined;
  versionString: string | undefined;
  categories: AppCategory[];
  primaryCategory: string | undefined;
  secondaryCategory: string | undefined;
  isEditable: boolean;
  onPrimaryCategoryChange: (categoryId: string | undefined) => void;
  onSecondaryCategoryChange: (categoryId: string | undefined) => void;
}

export function GeneralInfoSection({
  app,
  versionString,
  categories,
  primaryCategory,
  secondaryCategory,
  isEditable,
  onPrimaryCategoryChange,
  onSecondaryCategoryChange,
}: GeneralInfoSectionProps) {
  const [showPrimaryPicker, setShowPrimaryPicker] = useState(false);
  const [showSecondaryPicker, setShowSecondaryPicker] = useState(false);

  const handlePrimaryCategorySelect = (categoryId: string) => {
    onPrimaryCategoryChange(categoryId);
    setShowPrimaryPicker(false);
  };

  const handleSecondaryCategorySelect = (categoryId: string | undefined) => {
    onSecondaryCategoryChange(categoryId);
    setShowSecondaryPicker(false);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>General Information</Text>
      <View style={styles.card}>
        <View style={styles.fieldRow}>
          <View style={styles.fieldHalf}>
            <Text style={styles.label}>Version</Text>
            <Text style={[styles.valueText, styles.mono]}>
              {versionString || '—'}
            </Text>
          </View>
          <View style={styles.fieldHalf}>
            <Text style={styles.label}>Primary Language</Text>
            <Text style={styles.valueText}>
              {app?.attributes.primaryLocale
                ? getLocaleName(app.attributes.primaryLocale)
                : '—'}
            </Text>
          </View>
        </View>
        <Divider />
        <View style={styles.fieldRow}>
          <View style={styles.fieldHalf}>
            <Text style={styles.label}>Bundle ID</Text>
            <Text style={[styles.valueText, styles.mono]}>
              {app?.attributes.bundleId || '—'}
            </Text>
          </View>
          <View style={styles.fieldHalf}>
            <Text style={styles.label}>SKU</Text>
            <Text style={[styles.valueText, styles.mono]}>
              {app?.attributes.sku || '—'}
            </Text>
          </View>
        </View>
        <Divider />
        <View style={styles.fieldRow}>
          <View style={styles.fieldHalf}>
            <Text style={styles.label}>Apple ID</Text>
            <Text style={[styles.valueText, styles.mono]}>{app?.id || '—'}</Text>
          </View>
          <View style={styles.fieldHalf} />
        </View>
        <Divider />
        <View style={styles.field}>
          <Text style={styles.label}>Category</Text>
          <Pressable
            style={styles.selectField}
            onPress={() => isEditable && setShowPrimaryPicker(!showPrimaryPicker)}
            disabled={!isEditable}>
            <Text style={styles.selectText}>
              {primaryCategory ? getCategoryName(primaryCategory) : 'Select category'}
            </Text>
            <Text style={styles.selectChevron}>▾</Text>
          </Pressable>
          {showPrimaryPicker && (
            <View style={styles.inlineDropdown}>
              <ScrollView style={styles.dropdownScroll}>
                {categories.map(cat => (
                  <Pressable
                    key={cat.id}
                    style={[
                      styles.dropdownOption,
                      cat.id === primaryCategory && styles.dropdownOptionSelected,
                    ]}
                    onPress={() => handlePrimaryCategorySelect(cat.id)}>
                    <Text
                      variant="body"
                      color={
                        cat.id === primaryCategory
                          ? colors.primary
                          : colors.textPrimary
                      }>
                      {getCategoryName(cat.id)}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
        <Divider />
        <View style={styles.field}>
          <Text style={styles.label}>Secondary Category (Optional)</Text>
          <Pressable
            style={styles.selectField}
            onPress={() => isEditable && setShowSecondaryPicker(!showSecondaryPicker)}
            disabled={!isEditable}>
            <Text
              style={[
                styles.selectText,
                !secondaryCategory && styles.selectTextPlaceholder,
              ]}>
              {secondaryCategory ? getCategoryName(secondaryCategory) : 'None'}
            </Text>
            <Text style={styles.selectChevron}>▾</Text>
          </Pressable>
          {showSecondaryPicker && (
            <View style={styles.inlineDropdown}>
              <ScrollView style={styles.dropdownScroll}>
                <Pressable
                  style={[
                    styles.dropdownOption,
                    !secondaryCategory && styles.dropdownOptionSelected,
                  ]}
                  onPress={() => handleSecondaryCategorySelect(undefined)}>
                  <Text
                    variant="body"
                    color={!secondaryCategory ? colors.primary : colors.textTertiary}>
                    None
                  </Text>
                </Pressable>
                {categories
                  .filter(cat => cat.id !== primaryCategory)
                  .map(cat => (
                    <Pressable
                      key={cat.id}
                      style={[
                        styles.dropdownOption,
                        cat.id === secondaryCategory && styles.dropdownOptionSelected,
                      ]}
                      onPress={() => handleSecondaryCategorySelect(cat.id)}>
                      <Text
                        variant="body"
                        color={
                          cat.id === secondaryCategory
                            ? colors.primary
                            : colors.textPrimary
                        }>
                        {getCategoryName(cat.id)}
                      </Text>
                    </Pressable>
                  ))}
              </ScrollView>
            </View>
          )}
        </View>
      </View>
      <Text style={styles.sectionFooter}>
        Primary Language cannot be changed after app creation.
      </Text>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  section: {},
  sectionTitle: {
    ...typography.headline,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  card: {
    backgroundColor: colors.sidebar,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radii.xl,
    overflow: 'hidden',
  },
  sectionFooter: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: spacing.sm,
    marginLeft: spacing.xs,
  },
  field: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  fieldRow: {
    flexDirection: 'row',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  fieldHalf: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginLeft: spacing.lg,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  valueText: {
    ...typography.body,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  mono: {
    fontFamily: 'Menlo',
    fontSize: 13,
  },
  selectField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.content,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radii.md,
  },
  selectText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  selectTextPlaceholder: {
    color: colors.textTertiary,
  },
  selectChevron: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  inlineDropdown: {
    backgroundColor: colors.content,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownOption: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  dropdownOptionSelected: {
    backgroundColor: colors.selection,
  },
});
