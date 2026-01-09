/**
 * SubscriptionListScreen - Lists subscriptions in a group
 */

import React from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RouteProp} from '@react-navigation/native';
import {Screen, Text, Pressable, NavigationHeader} from '@ui';
import {colors, spacing, radii} from '@theme';
import {useSubscriptions} from '@features/subscriptions/hooks/useSubscriptions';
import type {SubscriptionsStackParamList} from '@app/navigation/types';
import type {Subscription} from '@libs/appStoreConnect';

type NavigationProp = StackNavigationProp<
  SubscriptionsStackParamList,
  'SubscriptionList'
>;
type RouteProps = RouteProp<SubscriptionsStackParamList, 'SubscriptionList'>;

export function SubscriptionListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const {groupId, groupName} = route.params;

  const {data: subscriptionsData, isLoading} = useSubscriptions(groupId);

  const handleSelectSubscription = (sub: Subscription) => {
    navigation.navigate('SubscriptionPricing', {
      subscriptionId: sub.id,
      subscriptionName: sub.attributes.name,
    });
  };

  return (
    <Screen padded={false}>
      <NavigationHeader title={groupName} />
      <View style={styles.content}>
        <Text
          variant="body"
          color={colors.textSecondary}
          style={styles.subtitle}>
          Select a subscription to configure PPP pricing
        </Text>

        {isLoading ? (
          <ActivityIndicator color={colors.primary} style={styles.loader} />
        ) : subscriptionsData?.data?.length ? (
          <View style={styles.list}>
            {subscriptionsData.data.map((sub: Subscription) => (
              <Pressable
                key={sub.id}
                style={styles.listItem}
                onPress={() => handleSelectSubscription(sub)}>
                <View style={styles.listItemContent}>
                  <Text variant="body">{sub.attributes.name}</Text>
                  <Text variant="caption" color={colors.textTertiary}>
                    {sub.attributes.subscriptionPeriod?.replace(/_/g, ' ') ??
                      ''}
                  </Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </Pressable>
            ))}
          </View>
        ) : (
          <Text variant="caption" color={colors.textSecondary}>
            No subscriptions in this group
          </Text>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: spacing.xxl,
  },
  subtitle: {
    marginBottom: spacing.lg,
  },
  loader: {
    marginTop: spacing.lg,
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
    gap: spacing.xs,
  },
  chevron: {
    fontSize: 18,
    color: colors.textTertiary,
    marginLeft: spacing.sm,
  },
});
