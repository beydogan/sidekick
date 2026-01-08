/**
 * PricingScreen - Main pricing management screen
 */

import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import {Screen, Text, Pressable} from '../../../ui';
import {colors, spacing, radii, zIndex} from '../../../theme';
import {
  usePriceSchedule,
  usePricePoints,
  useUpdateBasePrice,
} from '../hooks/usePricing';
import type {AppPricePoint} from '../../../libs/appStoreConnect';

interface PricingScreenProps {
  appId: string;
  appName?: string;
}

export const PricingScreen: React.FC<PricingScreenProps> = ({
  appId,
  appName,
}) => {
  const [showPricePicker, setShowPricePicker] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');

  const {
    data: scheduleData,
    isLoading: scheduleLoading,
    error: scheduleError,
  } = usePriceSchedule(appId);

  const {data: pricePointsData, isLoading: pricePointsLoading} =
    usePricePoints(appId);

  const updatePrice = useUpdateBasePrice();

  function handleSelectPrice(pricePoint: AppPricePoint) {
    updatePrice.mutate(
      {
        appId,
        pricePointId: pricePoint.id,
        startDate: scheduledDate || undefined,
      },
      {
        onSuccess: () => {
          setShowPricePicker(false);
          setScheduledDate('');
        },
      },
    );
  }

  if (scheduleLoading) {
    return (
      <Screen>
        <View style={styles.centered}>
          <ActivityIndicator color={colors.primary} />
          <Text variant="body" color={colors.textSecondary} style={styles.mt}>
            Loading pricing...
          </Text>
        </View>
      </Screen>
    );
  }

  if (scheduleError) {
    return (
      <Screen>
        <View style={styles.centered}>
          <Text variant="body" color={colors.error}>
            {scheduleError instanceof Error
              ? scheduleError.message
              : 'Failed to load pricing'}
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Text variant="title">Pricing</Text>
        {appName && (
          <Text
            variant="body"
            color={colors.textSecondary}
            style={styles.subtitle}>
            Manage pricing for {appName}
          </Text>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text variant="bodyMedium">Base Price (USA)</Text>
          <View style={styles.priceRow}>
            <Text variant="headline">
              {scheduleData?.data ? 'Configured' : 'Not set'}
            </Text>
            <Pressable
              style={styles.changeButton}
              onPress={() => setShowPricePicker(true)}>
              <Text variant="bodyMedium" color="#FFFFFF">
                Change Price
              </Text>
            </Pressable>
          </View>
          <Text variant="caption" color={colors.textTertiary} style={styles.mt}>
            Prices in other territories are calculated automatically
          </Text>
        </View>

        {scheduleData?.data && (
          <View style={styles.card}>
            <Text variant="bodyMedium">Schedule Info</Text>
            <Text variant="caption" color={colors.textSecondary} style={styles.mt}>
              Schedule ID: {scheduleData.data.id}
            </Text>
          </View>
        )}
      </View>

      {showPricePicker && (
        <View style={styles.modalContainer}>
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setShowPricePicker(false)}
          />
          <View style={styles.modalContent}>
            <Text variant="headline" style={styles.modalTitle}>
              Select Price Tier
            </Text>

            <View style={styles.scheduleInput}>
              <Text variant="caption" color={colors.textSecondary}>
                Schedule for date (optional, YYYY-MM-DD):
              </Text>
              <TextInput
                style={styles.dateInput}
                value={scheduledDate}
                onChangeText={setScheduledDate}
                placeholder="Leave empty for immediate"
                placeholderTextColor={colors.textTertiary}
              />
            </View>

            {pricePointsLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color={colors.primary} />
                <Text variant="caption" color={colors.textSecondary} style={styles.mt}>
                  Loading price tiers...
                </Text>
              </View>
            ) : !pricePointsData?.data?.length ? (
              <View style={styles.emptyContainer}>
                <Text variant="body" color={colors.textSecondary}>
                  No price tiers available
                </Text>
              </View>
            ) : (
              <ScrollView style={styles.priceList}>
                {pricePointsData.data.map(point => (
                  <Pressable
                    key={point.id}
                    style={styles.priceOption}
                    onPress={() => handleSelectPrice(point)}>
                    <Text variant="bodyMedium">
                      ${point.attributes.customerPrice}
                    </Text>
                    <Text variant="caption" color={colors.textSecondary}>
                      Proceeds: ${point.attributes.proceeds}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            )}

            {updatePrice.isPending && (
              <View style={styles.modalLoading}>
                <ActivityIndicator color={colors.primary} />
                <Text variant="body" color={colors.textSecondary}>
                  Updating price...
                </Text>
              </View>
            )}

            {updatePrice.isError && (
              <Text variant="body" color={colors.error} style={styles.mt}>
                {updatePrice.error instanceof Error
                  ? updatePrice.error.message
                  : 'Failed to update price'}
              </Text>
            )}

            <Pressable
              style={styles.modalCancel}
              onPress={() => setShowPricePicker(false)}>
              <Text variant="body" color={colors.primary}>
                Cancel
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mt: {
    marginTop: spacing.sm,
  },
  header: {
    marginBottom: spacing.xxl,
  },
  subtitle: {
    marginTop: spacing.xs,
  },
  content: {
    flex: 1,
    gap: spacing.lg,
  },
  card: {
    backgroundColor: colors.sidebar,
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  changeButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: zIndex.modal,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContent: {
    backgroundColor: colors.content,
    borderRadius: radii.xl,
    padding: spacing.xxl,
    width: 380,
    maxHeight: 500,
    borderWidth: 1,
    borderColor: colors.border,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  modalTitle: {
    marginBottom: spacing.lg,
  },
  scheduleInput: {
    marginBottom: spacing.lg,
  },
  dateInput: {
    marginTop: spacing.xs,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.sidebar,
  },
  priceList: {
    maxHeight: 200,
  },
  priceOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.md,
  },
  priceOptionPressed: {
    backgroundColor: colors.selection,
  },
  modalLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  modalCancel: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
