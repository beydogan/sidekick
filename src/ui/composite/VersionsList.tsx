/**
 * VersionsList - Shows app versions grouped by platform
 */

import React, {useState, useMemo} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {Text, Pressable, StatusIndicator} from '../primitives';
import {colors, spacing, radii, typography} from '../../theme';
import type {AppStoreVersion, Platform} from '@libs/appStoreConnect';
import {
  getVersionStateCategory,
  formatPlatformName,
  formatVersionState,
} from '../../features/versions/utils';

const MAX_VERSIONS = 3;

export interface VersionsListProps {
  versions: AppStoreVersion[];
  selectedVersionId?: string | null;
  onSelectVersion?: (version: AppStoreVersion) => void;
  isLoading?: boolean;
}

interface GroupedVersions {
  platform: Platform;
  versions: AppStoreVersion[];
}

function groupByPlatform(versions: AppStoreVersion[]): GroupedVersions[] {
  const groups = new Map<Platform, AppStoreVersion[]>();

  for (const version of versions) {
    const platform = version.attributes.platform;
    const existing = groups.get(platform) || [];
    groups.set(platform, [...existing, version]);
  }

  return Array.from(groups.entries()).map(([platform, vers]) => ({
    platform,
    versions: vers,
  }));
}

const PlatformHeader: React.FC<{platform: Platform}> = ({platform}) => (
  <View style={styles.platformHeader}>
    <Text style={styles.platformHeaderText}>{formatPlatformName(platform)}</Text>
  </View>
);

interface VersionItemProps {
  version: AppStoreVersion;
  selected?: boolean;
  onPress?: () => void;
}

const VersionItem: React.FC<VersionItemProps> = ({version, selected, onPress}) => {
  const [isHovered, setIsHovered] = useState(false);
  const {versionString, appVersionState} = version.attributes;
  const category = getVersionStateCategory(appVersionState);
  const stateLabel = formatVersionState(appVersionState);
  const showBackground = selected || isHovered;

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={[
        styles.versionItem,
        showBackground && styles.versionItemActive,
        selected && styles.versionItemSelected,
      ]}>
      <StatusIndicator category={category} size={8} />
      <Text style={styles.versionString} numberOfLines={1}>
        {versionString}
      </Text>
      <Text style={styles.stateLabel} numberOfLines={1}>
        {stateLabel}
      </Text>
    </Pressable>
  );
};

export const VersionsList: React.FC<VersionsListProps> = ({
  versions,
  selectedVersionId,
  onSelectVersion,
  isLoading = false,
}) => {
  const groupedVersions = useMemo(() => {
    const limited = versions.slice(0, MAX_VERSIONS);
    return groupByPlatform(limited);
  }, [versions]);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color={colors.textTertiary} />
      </View>
    );
  }

  if (versions.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {groupedVersions.map(({platform, versions: platformVersions}) => (
        <View key={platform} style={styles.platformGroup}>
          <PlatformHeader platform={platform} />
          {platformVersions.map(version => (
            <VersionItem
              key={version.id}
              version={version}
              selected={selectedVersionId === version.id}
              onPress={() => onSelectVersion?.(version)}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.md,
  },
  loaderContainer: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  platformGroup: {
    marginBottom: spacing.sm,
  },
  platformHeader: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  platformHeaderText: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
    letterSpacing: 0.3,
  },
  versionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 28,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    marginVertical: 1,
    gap: spacing.sm,
  },
  versionItemActive: {
    backgroundColor: colors.selectionHover,
  },
  versionItemSelected: {
    backgroundColor: colors.selection,
  },
  versionString: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '500',
    minWidth: 40,
  },
  stateLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
  },
});
