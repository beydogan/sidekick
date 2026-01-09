import React, {useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {observer} from '@legendapp/state/react';
import {Screen, Text, Pressable, TextInput, NavigationHeader} from '@ui';
import {colors, spacing, radii, typography} from '@theme';
import {appSettings$} from '@stores/appSettings';

const COMMON_LOCALES = [
  {code: 'en-US', name: 'English (US)'},
  {code: 'en-GB', name: 'English (UK)'},
  {code: 'de-DE', name: 'German'},
  {code: 'fr-FR', name: 'French'},
  {code: 'es-ES', name: 'Spanish (Spain)'},
  {code: 'es-MX', name: 'Spanish (Mexico)'},
  {code: 'it-IT', name: 'Italian'},
  {code: 'pt-BR', name: 'Portuguese (Brazil)'},
  {code: 'pt-PT', name: 'Portuguese (Portugal)'},
  {code: 'ja', name: 'Japanese'},
  {code: 'ko', name: 'Korean'},
  {code: 'zh-Hans', name: 'Chinese (Simplified)'},
  {code: 'zh-Hant', name: 'Chinese (Traditional)'},
  {code: 'nl-NL', name: 'Dutch'},
  {code: 'ru', name: 'Russian'},
  {code: 'tr', name: 'Turkish'},
  {code: 'ar-SA', name: 'Arabic'},
  {code: 'th', name: 'Thai'},
  {code: 'vi', name: 'Vietnamese'},
  {code: 'id', name: 'Indonesian'},
  {code: 'ms', name: 'Malay'},
  {code: 'sv', name: 'Swedish'},
  {code: 'da', name: 'Danish'},
  {code: 'fi', name: 'Finnish'},
  {code: 'no', name: 'Norwegian'},
  {code: 'pl', name: 'Polish'},
  {code: 'cs', name: 'Czech'},
  {code: 'el', name: 'Greek'},
  {code: 'he', name: 'Hebrew'},
  {code: 'hi', name: 'Hindi'},
  {code: 'hu', name: 'Hungarian'},
  {code: 'ro', name: 'Romanian'},
  {code: 'sk', name: 'Slovak'},
  {code: 'uk', name: 'Ukrainian'},
  {code: 'ca', name: 'Catalan'},
  {code: 'hr', name: 'Croatian'},
];

interface AppSettingsScreenProps {
  appId: string;
  appName?: string;
}

export const AppSettingsScreen = observer(function AppSettingsScreen({
  appId,
  appName,
}: AppSettingsScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const appSettings = appSettings$[appId].get();
  const selectedLocales = appSettings?.locales || [];

  const filteredLocales = COMMON_LOCALES.filter(
    locale =>
      locale.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      locale.code.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const toggleLocale = (code: string) => {
    const current = appSettings$[appId].locales.get() || [];
    if (current.includes(code)) {
      appSettings$[appId].locales.set(current.filter(c => c !== code));
    } else {
      appSettings$[appId].locales.set([...current, code]);
    }
  };

  const selectAll = () => {
    appSettings$[appId].locales.set(COMMON_LOCALES.map(l => l.code));
  };

  const clearAll = () => {
    appSettings$[appId].locales.set([]);
  };

  return (
    <Screen padded={false}>
      <NavigationHeader title="App Settings" showBack={false} />
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>AVAILABLE LOCALES</Text>
          <Text style={styles.sectionDescription}>
            Select the locales your app supports. This enables locale switching
            for localizable fields throughout the app.
          </Text>

          <View style={styles.card}>
            <View style={styles.searchRow}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search locales..."
                placeholderTextColor={colors.textTertiary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <View style={styles.actionsRow}>
              <View style={styles.selectedCount}>
                <Text variant="caption" color={colors.textSecondary}>
                  {selectedLocales.length} selected
                </Text>
              </View>
              <View style={styles.actionButtons}>
                <Pressable style={styles.actionButton} onPress={selectAll}>
                  <Text variant="caption" color={colors.primary}>
                    Select all
                  </Text>
                </Pressable>
                <Pressable style={styles.actionButton} onPress={clearAll}>
                  <Text variant="caption" color={colors.primary}>
                    Clear
                  </Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.dividerFull} />

            <ScrollView style={styles.localeList}>
              {filteredLocales.map((locale, index) => {
                const isSelected = selectedLocales.includes(locale.code);
                return (
                  <React.Fragment key={locale.code}>
                    <Pressable
                      style={[
                        styles.localeRow,
                        isSelected && styles.localeRowSelected,
                      ]}
                      onPress={() => toggleLocale(locale.code)}>
                      <View style={styles.localeInfo}>
                        <Text style={styles.localeName}>{locale.name}</Text>
                        <Text style={styles.localeCode}>{locale.code}</Text>
                      </View>
                      <View
                        style={[
                          styles.checkbox,
                          isSelected && styles.checkboxSelected,
                        ]}>
                        {isSelected && (
                          <Text style={styles.checkmark}>✓</Text>
                        )}
                      </View>
                    </Pressable>
                    {index < filteredLocales.length - 1 && (
                      <View style={styles.divider} />
                    )}
                  </React.Fragment>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </View>
    </Screen>
  );
});

const styles = StyleSheet.create({
  content: {
    flex: 1,
    maxWidth: 480,
    padding: spacing.xl,
  },
  section: {},
  sectionHeader: {
    ...typography.caption,
    color: colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
    marginLeft: spacing.xs,
  },
  sectionDescription: {
    ...typography.body,
    color: colors.textTertiary,
    marginBottom: spacing.md,
    marginLeft: spacing.xs,
  },
  card: {
    backgroundColor: colors.sidebar,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radii.xl,
    overflow: 'hidden',
  },
  searchRow: {
    padding: spacing.md,
  },
  searchInput: {
    ...typography.body,
    color: colors.textPrimary,
    backgroundColor: colors.content,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radii.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  selectedCount: {},
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    paddingVertical: spacing.xs,
  },
  dividerFull: {
    height: 1,
    backgroundColor: colors.borderLight,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginLeft: spacing.lg,
  },
  localeList: {
    maxHeight: 400,
  },
  localeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  localeRowSelected: {
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
  },
  localeInfo: {
    flex: 1,
  },
  localeName: {
    ...typography.body,
    color: colors.textPrimary,
  },
  localeCode: {
    ...typography.caption,
    color: colors.textTertiary,
    fontFamily: 'Menlo',
    marginTop: 2,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.content,
  },
  checkboxSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
