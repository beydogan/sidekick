/**
 * CreateSubscriptionScreen - Create a new subscription with subscription group
 * Apple macOS-style grouped form layout
 */

import React, {useState} from 'react';
import {View, StyleSheet, Switch, ScrollView, ActivityIndicator} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {Screen, Text, TextInput, NavigationHeader, SegmentedControl, Pressable} from '@ui';
import {colors, spacing, radii} from '@theme';
import {
  useSubscriptionGroups,
  useCreateSubscriptionGroup,
  useCreateSubscription,
} from '../hooks/useSubscriptions';
import type {SubscriptionsStackParamList} from '@app/navigation/types';
import type {Subscription} from '@libs/appStoreConnect';

type NavigationProp = StackNavigationProp<
  SubscriptionsStackParamList,
  'CreateSubscription'
>;

type SubscriptionPeriod = Subscription['attributes']['subscriptionPeriod'];

const BILLING_PERIODS: {value: SubscriptionPeriod; label: string}[] = [
  {value: 'ONE_WEEK', label: 'Week'},
  {value: 'ONE_MONTH', label: 'Month'},
  {value: 'TWO_MONTHS', label: '2 Mo'},
  {value: 'THREE_MONTHS', label: '3 Mo'},
  {value: 'SIX_MONTHS', label: '6 Mo'},
  {value: 'ONE_YEAR', label: 'Year'},
];

interface CreateSubscriptionScreenProps {
  appId: string;
  appName?: string;
}

const CREATE_NEW_GROUP = '__create_new__';

export function CreateSubscriptionScreen({
  appId,
  appName,
}: CreateSubscriptionScreenProps) {
  const navigation = useNavigation<NavigationProp>();

  // Fetch existing groups
  const {data: groupsData, isLoading: isLoadingGroups} = useSubscriptionGroups(appId);
  const existingGroups = groupsData?.data ?? [];

  // Form state
  const [selectedGroupId, setSelectedGroupId] = useState<string>(CREATE_NEW_GROUP);
  const [newGroupName, setNewGroupName] = useState('');
  const [subscriptionName, setSubscriptionName] = useState('');
  const [productId, setProductId] = useState('');
  const [billingPeriod, setBillingPeriod] =
    useState<SubscriptionPeriod>('ONE_MONTH');
  const [familySharable, setFamilySharable] = useState(false);

  const isCreatingNewGroup = selectedGroupId === CREATE_NEW_GROUP;

  // Mutations
  const createGroup = useCreateSubscriptionGroup();
  const createSubscription = useCreateSubscription();

  const isLoading = createGroup.isPending || createSubscription.isPending;
  const error = createGroup.error || createSubscription.error;

  const isFormValid =
    (isCreatingNewGroup ? newGroupName.trim().length > 0 : selectedGroupId !== '') &&
    subscriptionName.trim().length > 0 &&
    productId.trim().length > 0;

  const handleSubmit = async () => {
    if (!isFormValid || isLoading) return;

    try {
      let groupId: string;
      let groupName: string;

      if (isCreatingNewGroup) {
        // Create new subscription group
        const groupResult = await createGroup.mutateAsync({
          appId,
          request: {referenceName: newGroupName.trim()},
        });
        groupId = groupResult.data.id;
        groupName = newGroupName.trim();
      } else {
        // Use existing group
        groupId = selectedGroupId;
        groupName = existingGroups.find(g => g.id === selectedGroupId)?.attributes.referenceName ?? '';
      }

      // Create the subscription in the group
      await createSubscription.mutateAsync({
        groupId,
        request: {
          name: subscriptionName.trim(),
          productId: productId.trim(),
          subscriptionPeriod: billingPeriod,
          familySharable,
        },
      });

      // Navigate to the subscription list
      navigation.replace('SubscriptionList', {
        groupId,
        groupName,
      });
    } catch {
      // Error is handled by the mutation state
    }
  };

  return (
    <Screen padded={false}>
      <NavigationHeader
        title="Create Subscription"
        showBack
        rightAction={{
          label: 'Create',
          onPress: handleSubmit,
          disabled: !isFormValid,
          loading: isLoading,
        }}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {appName && (
            <Text
              variant="body"
              color={colors.textSecondary}
              style={styles.subtitle}>
              Creating subscription for {appName}
            </Text>
          )}

          {/* Error Message */}
          {error && (
            <View style={styles.errorContainer}>
              <Text variant="body" color={colors.error}>
                {error instanceof Error
                  ? error.message
                  : 'Failed to create subscription'}
              </Text>
            </View>
          )}

          {/* Subscription Group Section */}
          <View style={styles.section}>
            <Text variant="caption" color={colors.textSecondary} style={styles.sectionHeader}>
              SUBSCRIPTION GROUP
            </Text>
            <View style={styles.sectionCard}>
              {isLoadingGroups ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator size="small" color={colors.textSecondary} />
                  <Text variant="body" color={colors.textSecondary}>
                    Loading groups...
                  </Text>
                </View>
              ) : (
                <>
                  {/* Create New option */}
                  <Pressable
                    style={styles.radioRow}
                    onPress={() => setSelectedGroupId(CREATE_NEW_GROUP)}
                    disabled={isLoading}>
                    <View style={[
                      styles.radio,
                      isCreatingNewGroup && styles.radioSelected,
                    ]}>
                      {isCreatingNewGroup && <View style={styles.radioInner} />}
                    </View>
                    <Text variant="body" color={colors.textPrimary}>
                      Create New Group
                    </Text>
                  </Pressable>

                  {/* New group name input */}
                  {isCreatingNewGroup && (
                    <View style={styles.nestedField}>
                      <TextInput
                        value={newGroupName}
                        onChangeText={setNewGroupName}
                        placeholder="e.g., Premium Features"
                        editable={!isLoading}
                      />
                    </View>
                  )}

                  {/* Existing groups */}
                  {existingGroups.map((group) => (
                    <React.Fragment key={group.id}>
                      <View style={styles.fieldDivider} />
                      <Pressable
                        style={styles.radioRow}
                        onPress={() => setSelectedGroupId(group.id)}
                        disabled={isLoading}>
                        <View style={[
                          styles.radio,
                          selectedGroupId === group.id && styles.radioSelected,
                        ]}>
                          {selectedGroupId === group.id && <View style={styles.radioInner} />}
                        </View>
                        <Text variant="body" color={colors.textPrimary}>
                          {group.attributes.referenceName}
                        </Text>
                      </Pressable>
                    </React.Fragment>
                  ))}
                </>
              )}
            </View>
            <Text variant="caption" color={colors.textTertiary} style={styles.sectionFooter}>
              {isCreatingNewGroup
                ? 'Internal name used to organize subscriptions. Not visible to users.'
                : 'Add this subscription to an existing group.'}
            </Text>
          </View>

          {/* Subscription Details Section */}
          <View style={styles.section}>
            <Text variant="caption" color={colors.textSecondary} style={styles.sectionHeader}>
              SUBSCRIPTION DETAILS
            </Text>
            <View style={styles.sectionCard}>
              <View style={styles.field}>
                <Text variant="body" color={colors.textSecondary}>
                  Display Name
                </Text>
                <TextInput
                  value={subscriptionName}
                  onChangeText={setSubscriptionName}
                  placeholder="e.g., Monthly Premium"
                  editable={!isLoading}
                />
              </View>
              <View style={styles.fieldDivider} />
              <View style={styles.field}>
                <Text variant="body" color={colors.textSecondary}>
                  Product ID
                </Text>
                <TextInput
                  mono
                  value={productId}
                  onChangeText={setProductId}
                  placeholder="com.yourapp.subscription.monthly"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
              </View>
            </View>
            <Text variant="caption" color={colors.textTertiary} style={styles.sectionFooter}>
              The Product ID must be unique and cannot be changed after creation.
            </Text>
          </View>

          {/* Billing Section */}
          <View style={styles.section}>
            <Text variant="caption" color={colors.textSecondary} style={styles.sectionHeader}>
              BILLING
            </Text>
            <View style={styles.sectionCard}>
              <View style={styles.fieldWithLabel}>
                <Text variant="body" color={colors.textPrimary}>
                  Renewal Period
                </Text>
                <SegmentedControl
                  options={BILLING_PERIODS}
                  value={billingPeriod}
                  onChange={setBillingPeriod}
                  disabled={isLoading}
                />
              </View>
            </View>
          </View>

          {/* Options Section */}
          <View style={styles.section}>
            <Text variant="caption" color={colors.textSecondary} style={styles.sectionHeader}>
              OPTIONS
            </Text>
            <View style={styles.sectionCard}>
              <View style={styles.switchRow}>
                <View style={styles.switchLabel}>
                  <Text variant="body" color={colors.textPrimary}>
                    Family Sharing
                  </Text>
                  <Text variant="caption" color={colors.textTertiary}>
                    Allow up to 6 family members to share
                  </Text>
                </View>
                <Switch
                  value={familySharable}
                  onValueChange={setFamilySharable}
                  disabled={isLoading}
                  trackColor={{false: colors.border, true: colors.primary}}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  content: {
    padding: spacing.xxl,
    maxWidth: 560,
    gap: spacing.xl,
  },
  subtitle: {
    marginBottom: spacing.sm,
  },
  errorContainer: {
    padding: spacing.md,
    backgroundColor: 'rgba(255, 59, 48, 0.08)',
    borderRadius: radii.lg,
  },
  section: {
    gap: spacing.sm,
  },
  sectionHeader: {
    paddingHorizontal: spacing.md,
    letterSpacing: 0.5,
  },
  sectionCard: {
    backgroundColor: colors.content,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    overflow: 'hidden',
  },
  sectionFooter: {
    paddingHorizontal: spacing.md,
  },
  field: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  fieldWithLabel: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  fieldDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginHorizontal: spacing.md,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  nestedField: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    paddingLeft: spacing.md + 18 + spacing.sm,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  switchLabel: {
    flex: 1,
    gap: 2,
  },
});
