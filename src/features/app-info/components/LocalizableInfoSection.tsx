import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from '@ui';
import {colors, spacing, typography, radii} from '@theme';
import {FormField} from './FormField';
import {getLocaleName} from '../constants';
import type {LocalizableFields, VersionFields} from '../hooks/useAppInfoForm';

interface LocalizableInfoSectionProps {
  selectedLocale: string | null;
  localizable: LocalizableFields;
  version: VersionFields;
  isEditable: boolean;
  aiModifiedFields: Set<string>;
  clearAIModified: (field: string) => void;
  onNameChange: (value: string) => void;
  onSubtitleChange: (value: string) => void;
  onPromotionalTextChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onWhatsNewChange: (value: string) => void;
  onKeywordsChange: (value: string) => void;
  onSupportUrlChange: (value: string) => void;
  onMarketingUrlChange: (value: string) => void;
}

export function LocalizableInfoSection({
  selectedLocale,
  localizable,
  version,
  isEditable,
  aiModifiedFields,
  clearAIModified,
  onNameChange,
  onSubtitleChange,
  onPromotionalTextChange,
  onDescriptionChange,
  onWhatsNewChange,
  onKeywordsChange,
  onSupportUrlChange,
  onMarketingUrlChange,
}: LocalizableInfoSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Localizable Information</Text>
      <Text style={styles.sectionSubtitle}>
        {selectedLocale ? getLocaleName(selectedLocale) : 'Select a language'}
      </Text>
      <View style={styles.card}>
        <FormField
          label="Name"
          value={localizable.name}
          onChangeText={onNameChange}
          placeholder="App name"
          editable={isEditable}
          aiModified={aiModifiedFields.has('name')}
          onClearAIModified={() => clearAIModified('name')}
        />
        <Divider />
        <FormField
          label="Subtitle"
          value={localizable.subtitle}
          onChangeText={onSubtitleChange}
          placeholder="App subtitle"
          editable={isEditable}
          aiModified={aiModifiedFields.has('subtitle')}
          onClearAIModified={() => clearAIModified('subtitle')}
        />
        <Divider />
        <FormField
          label="Promotional Text"
          value={version.promotionalText}
          onChangeText={onPromotionalTextChange}
          placeholder="Promotional text appears at the top of your description"
          editable={isEditable}
          multiline
          aiModified={aiModifiedFields.has('promotionalText')}
          onClearAIModified={() => clearAIModified('promotionalText')}
        />
        <Divider />
        <FormField
          label="Description"
          value={version.description}
          onChangeText={onDescriptionChange}
          placeholder="A description of your app"
          editable={isEditable}
          multiline
          aiModified={aiModifiedFields.has('description')}
          onClearAIModified={() => clearAIModified('description')}
        />
        <Divider />
        <FormField
          label="What's New"
          value={version.whatsNew}
          onChangeText={onWhatsNewChange}
          placeholder="What's new in this version"
          editable={isEditable}
          multiline
          aiModified={aiModifiedFields.has('whatsNew')}
          onClearAIModified={() => clearAIModified('whatsNew')}
        />
        <Divider />
        <FormField
          label="Keywords"
          value={version.keywords}
          onChangeText={onKeywordsChange}
          placeholder="Comma-separated keywords"
          editable={isEditable}
          aiModified={aiModifiedFields.has('keywords')}
          onClearAIModified={() => clearAIModified('keywords')}
        />
        <Divider />
        <FormField
          label="Support URL"
          value={version.supportUrl}
          onChangeText={onSupportUrlChange}
          placeholder="https://example.com/support"
          editable={isEditable}
          mono
          aiModified={aiModifiedFields.has('supportUrl')}
          onClearAIModified={() => clearAIModified('supportUrl')}
        />
        <Divider />
        <FormField
          label="Marketing URL"
          value={version.marketingUrl}
          onChangeText={onMarketingUrlChange}
          placeholder="https://example.com"
          editable={isEditable}
          mono
          aiModified={aiModifiedFields.has('marketingUrl')}
          onClearAIModified={() => clearAIModified('marketingUrl')}
        />
      </View>
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
  sectionSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.sidebar,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radii.xl,
    overflow: 'hidden',
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginLeft: spacing.lg,
  },
});
