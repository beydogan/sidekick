/**
 * CreateSubscriptionScreen - Create a new subscription with subscription group
 */

import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Switch,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {Screen, Text, Pressable, NavigationHeader} from '@ui';
import {colors, spacing, radii, typography} from '@theme';
import {
  useCreateSubscriptionGroup,
  useCreateSubscription,
} from '@features/subscriptions/hooks/useSubscriptions';
import type {SubscriptionsStackParamList} from '@app/navigation/types';
import type {Subscription} from '@libs/appStoreConnect';

type NavigationProp = StackNavigationProp<
  SubscriptionsStackParamList,
  'CreateSubscription'
>;

type SubscriptionPeriod = Subscription['attributes']['subscriptionPeriod'];

const BILLING_PERIODS: {value: SubscriptionPeriod; label: string}[] = [
  {value: 'ONE_WEEK', label: 'Weekly'},
  {value: 'ONE_MONTH', label: 'Monthly'},
  {value: 'TWO_MONTHS', label: '2 Months'},
  {value: 'THREE_MONTHS', label: '3 Months'},
  {value: 'SIX_MONTHS', label: '6 Months'},
  {value: 'ONE_YEAR', label: 'Yearly'},
];

interface CreateSubscriptionScreenProps {
  appId: string;
  appName?: string;
}

export function CreateSubscriptionScreen({
  appId,
  appName,
}: CreateSubscriptionScreenProps) {
  const navigation = useNavigation<NavigationProp>();

  // Form state
  const [groupName, setGroupName] = useState('');
  const [subscriptionName, setSubscriptionName] = useState('');
  const [productId, setProductId] = useState('');
  const [billingPeriod, setBillingPeriod] = useState<SubscriptionPeriod>('ONE_MONTH');
  const [familySharable, setFamilySharable] = useState(false);
  const [showPeriodPicker, setShowPeriodPicker] = useState(false);

  // Mutations
  const createGroup = useCreateSubscriptionGroup();
  const createSubscription = useCreateSubscription();

  const isLoading = createGroup.isPending || createSubscription.isPending;
  const error = createGroup.error || createSubscription.error;

  const isFormValid =
    groupName.trim().length > 0 &&
    subscriptionName.trim().length > 0 &&
    productId.trim().length > 0;

  const handleSubmit = async () => {
    if (!isFormValid || isLoading) return;

    try {
      // First create the subscription group
      const groupResult = await createGroup.mutateAsync({
        appId,
        request: {referenceName: groupName.trim()},
      });

      const newGroupId = groupResult.data.id;

      // Then create the subscription in that group
      await createSubscription.mutateAsync({
        groupId: newGroupId,
        request: {
          name: subscriptionName.trim(),
          productId: productId.trim(),
          subscriptionPeriod: billingPeriod,
          familySharable,
        },
      });

      // Navigate to the subscription list for the new group
      navigation.replace('SubscriptionList', {
        groupId: newGroupId,
        groupName: groupName.trim(),
      });
    } catch {
      // Error is handled by the mutation state
    }
  };

  const selectedPeriodLabel =
    BILLING_PERIODS.find(p => p.value === billingPeriod)?.label ?? 'Select';

  return (
    <Screen padded={false}>
      <NavigationHeader title="Create Subscription" showBack />
      <View style={styles.content}>
        {appName && (
          <Text
            variant="body"
            color={colors.textSecondary}
            style={styles.subtitle}>
            Create a new subscription for {appName}
          </Text>
        )}

        <View style={styles.form}>
          {/* Group Name */}
          <View style={styles.field}>
            <Text variant="bodyMedium" style={styles.label}>
              Group Name
            </Text>
            <TextInput
              style={styles.input}
              value={groupName}
              onChangeText={setGroupName}
              placeholder="e.g., Premium Features"
              placeholderTextColor={colors.textTertiary}
              editable={!isLoading}
            />
            <Text variant="caption" color={colors.textTertiary} style={styles.hint}>
              Internal reference name for the subscription group
            </Text>
          </View>

          {/* Subscription Name */}
          <View style={styles.field}>
            <Text variant="bodyMedium" style={styles.label}>
              Subscription Name
            </Text>
            <TextInput
              style={styles.input}
              value={subscriptionName}
              onChangeText={setSubscriptionName}
              placeholder="e.g., Monthly Premium"
              placeholderTextColor={colors.textTertiary}
              editable={!isLoading}
            />
            <Text variant="caption" color={colors.textTertiary} style={styles.hint}>
              Display name shown to users
            </Text>
          </View>

          {/* Product ID */}
          <View style={styles.field}>
            <Text variant="bodyMedium" style={styles.label}>
              Product ID
            </Text>
            <TextInput
              style={[styles.input, styles.monoInput]}
              value={productId}
              onChangeText={setProductId}
              placeholder="com.yourapp.subscription.monthly"
              placeholderTextColor={colors.textTertiary}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
            <Text variant="caption" color={colors.textTertiary} style={styles.hint}>
              Unique identifier for StoreKit
            </Text>
          </View>

          {/* Billing Period */}
          <View style={styles.field}>
            <Text variant="bodyMedium" style={styles.label}>
              Billing Period
            </Text>
            <Pressable
              style={styles.picker}
              onPress={() => setShowPeriodPicker(!showPeriodPicker)}
              disabled={isLoading}>
              <Text variant="body">{selectedPeriodLabel}</Text>
              <Text style={styles.chevron}>{showPeriodPicker ? '▲' : '▼'}</Text>
            </Pressable>
            {showPeriodPicker && (
              <View style={styles.pickerDropdown}>
                {BILLING_PERIODS.map(period => (
                  <Pressable
                    key={period.value}
                    style={[
                      styles.pickerOption,
                      billingPeriod === period.value && styles.pickerOptionSelected,
                    ]}
                    onPress={() => {
                      setBillingPeriod(period.value);
                      setShowPeriodPicker(false);
                    }}>
                    <Text
                      variant="body"
                      color={
                        billingPeriod === period.value
                          ? colors.primary
                          : colors.textPrimary
                      }>
                      {period.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          {/* Family Sharing */}
          <View style={styles.switchField}>
            <View style={styles.switchLabel}>
              <Text variant="bodyMedium">Family Sharing</Text>
              <Text variant="caption" color={colors.textTertiary}>
                Allow family members to share this subscription
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

        {/* Error Message */}
        {error && (
          <View style={styles.errorContainer}>
            <Text variant="body" color={colors.error}>
              {error instanceof Error ? error.message : 'Failed to create subscription'}
            </Text>
          </View>
        )}

        {/* Submit Button */}
        <Pressable
          style={[
            styles.submitButton,
            (!isFormValid || isLoading) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!isFormValid || isLoading}>
          {isLoading ? (
            <ActivityIndicator color={colors.content} size="small" />
          ) : (
            <Text variant="bodyMedium" color={colors.content}>
              Create Subscription
            </Text>
          )}
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: spacing.xxl,
    maxWidth: 480,
  },
  subtitle: {
    marginBottom: spacing.xl,
  },
  form: {
    gap: spacing.lg,
  },
  field: {
    gap: spacing.xs,
  },
  label: {
    color: colors.textPrimary,
  },
  input: {
    backgroundColor: colors.sidebar,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.md,
    ...typography.body,
    color: colors.textPrimary,
  },
  monoInput: {
    fontFamily: 'Menlo',
    fontSize: 12,
  },
  hint: {
    marginTop: spacing.xs,
  },
  picker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.sidebar,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  chevron: {
    fontSize: 10,
    color: colors.textTertiary,
  },
  pickerDropdown: {
    backgroundColor: colors.dropdownBackground,
    borderWidth: 1,
    borderColor: colors.dropdownBorder,
    borderRadius: radii.md,
    marginTop: spacing.xs,
    overflow: 'hidden',
  },
  pickerOption: {
    padding: spacing.md,
  },
  pickerOptionSelected: {
    backgroundColor: colors.selection,
  },
  switchField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.sidebar,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  switchLabel: {
    flex: 1,
    gap: spacing.xs,
  },
  errorContainer: {
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: radii.md,
  },
  submitButton: {
    marginTop: spacing.xl,
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
});
