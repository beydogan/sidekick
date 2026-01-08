/**
 * SubscriptionGroupsScreen - Lists subscription groups for an app
 */

import React from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {Screen, Text, Pressable, NavigationHeader} from '@ui';
import {colors, spacing, radii} from '@theme';
import {useSubscriptionGroups} from '@features/subscriptions/hooks/useSubscriptions';
import type {SubscriptionsStackParamList} from '@app/navigation/types';
import type {SubscriptionGroup} from '@libs/appStoreConnect';

type NavigationProp = StackNavigationProp<
  SubscriptionsStackParamList,
  'SubscriptionGroups'
>;

interface SubscriptionGroupsScreenProps {
  appId: string;
  appName?: string;
}

export function SubscriptionGroupsScreen({
  appId,
  appName,
}: SubscriptionGroupsScreenProps) {
  const navigation = useNavigation<NavigationProp>();

  const {
    data: groupsData,
    isLoading,
    error,
  } = useSubscriptionGroups(appId);

  const handleSelectGroup = (group: SubscriptionGroup) => {
    navigation.navigate('SubscriptionList', {
      groupId: group.id,
      groupName: group.attributes.referenceName,
    });
  };

  if (isLoading) {
    return (
      <Screen padded={false}>
        <NavigationHeader title="Subscriptions" showBack={false} />
        <View style={styles.centered}>
          <ActivityIndicator color={colors.primary} />
          <Text variant="body" color={colors.textSecondary} style={styles.mt}>
            Loading subscriptions...
          </Text>
        </View>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen padded={false}>
        <NavigationHeader title="Subscriptions" showBack={false} />
        <View style={styles.centered}>
          <Text variant="body" color={colors.error}>
            {error instanceof Error
              ? error.message
              : 'Failed to load subscriptions'}
          </Text>
        </View>
      </Screen>
    );
  }

  if (!groupsData?.data?.length) {
    return (
      <Screen padded={false}>
        <NavigationHeader title="Subscriptions" showBack={false} />
        <View style={styles.centered}>
          <Text variant="body" color={colors.textSecondary}>
            No subscription groups found for this app.
          </Text>
          <Text variant="caption" color={colors.textTertiary} style={styles.mt}>
            Create subscriptions in App Store Connect first.
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen padded={false}>
      <NavigationHeader title="Subscriptions" showBack={false} />
      <View style={styles.content}>
        {appName && (
          <Text
            variant="body"
            color={colors.textSecondary}
            style={styles.subtitle}>
            Select a subscription group for {appName}
          </Text>
        )}
        <View style={styles.list}>
          {groupsData.data.map((group: SubscriptionGroup) => (
            <Pressable
              key={group.id}
              style={styles.listItem}
              onPress={() => handleSelectGroup(group)}>
              <View style={styles.listItemContent}>
                <Text variant="body">{group.attributes.referenceName}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mt: {
    marginTop: spacing.sm,
  },
  content: {
    flex: 1,
    padding: spacing.xxl,
  },
  subtitle: {
    marginBottom: spacing.lg,
  },
  list: {
    gap: spacing.xs,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.sidebar,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  listItemContent: {
    flex: 1,
  },
  chevron: {
    fontSize: 18,
    color: colors.textTertiary,
    marginLeft: spacing.sm,
  },
});
