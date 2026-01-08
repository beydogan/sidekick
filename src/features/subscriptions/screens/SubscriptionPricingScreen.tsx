/**
 * SubscriptionPricingScreen - Configure PPP pricing for a subscription
 */

import React, {useState, useMemo} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';
import {Screen, Text, Pressable, NavigationHeader} from '@ui';
import {colors, spacing, radii} from '@theme';
import {
  useAllSubscriptionPricePoints,
  useApplyPPPPrices,
} from '@features/subscriptions/hooks/useSubscriptions';
import {
  calculatePPPPrices,
  formatDiscount,
  getDiscountColor,
} from '@features/subscriptions/utils/pppCalculator';
import {
  findNearestPricePoint,
  formatPrice,
} from '@features/subscriptions/utils/pricePointMatcher';
import {getTerritoriesWithPPPData} from '@features/subscriptions/utils/bigMacIndex';
import type {SubscriptionsStackParamList} from '@app/navigation/types';

type RouteProps = RouteProp<SubscriptionsStackParamList, 'SubscriptionPricing'>;

export function SubscriptionPricingScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProps>();
  const {subscriptionId, subscriptionName} = route.params;

  const [basePriceUSD, setBasePriceUSD] = useState('9.99');
  const [isApplying, setIsApplying] = useState(false);

  const {data: pricePointsData, isLoading: pricePointsLoading} =
    useAllSubscriptionPricePoints(subscriptionId);

  const applyPPPPrices = useApplyPPPPrices();

  // Calculate PPP prices for territories that have price points available
  const pppPrices = useMemo(() => {
    const price = parseFloat(basePriceUSD);
    if (isNaN(price) || price <= 0) return [];

    // Only calculate for territories that have both PPP data AND price points
    const pppTerritories = getTerritoriesWithPPPData();
    const availableTerritories = pricePointsData?.byTerritory
      ? pppTerritories.filter(t => pricePointsData.byTerritory[t]?.length > 0)
      : [];

    return calculatePPPPrices({
      basePriceUSD: price,
      territories: availableTerritories,
    });
  }, [basePriceUSD, pricePointsData?.byTerritory]);

  // Match to Apple price tiers (per territory)
  const matchedPrices = useMemo(() => {
    if (!pricePointsData?.byTerritory || pppPrices.length === 0) return [];

    return pppPrices
      .map(ppp => {
        const territoryPricePoints = pricePointsData.byTerritory[ppp.territoryCode] || [];
        const matched = findNearestPricePoint(ppp.calculatedPriceUSD, territoryPricePoints);
        if (!matched) return null;

        return {
          ...ppp,
          matchedPricePoint: matched,
          matchedPrice: parseFloat(matched.attributes.customerPrice),
        };
      })
      .filter((p): p is NonNullable<typeof p> => p !== null);
  }, [pppPrices, pricePointsData?.byTerritory]);

  const handleApplyPrices = async () => {
    if (matchedPrices.length === 0) return;

    setIsApplying(true);
    try {
      const pricesToApply = matchedPrices
        .filter(p => p.matchedPricePoint)
        .map(p => ({
          pricePointId: p.matchedPricePoint!.id,
          territoryCode: p.territoryCode,
        }));

      await applyPPPPrices.mutateAsync({
        subscriptionId,
        prices: pricesToApply,
      });
    } catch (err) {
      console.error('Failed to apply prices:', err);
    } finally {
      setIsApplying(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <Screen padded={false}>
      <NavigationHeader title={subscriptionName} onBack={handleBack} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}>
        <Text
          variant="body"
          color={colors.textSecondary}
          style={styles.subtitle}>
          Configure Purchasing Power Parity pricing
        </Text>

        {/* Base Price Input */}
        <View style={styles.section}>
          <Text variant="bodyMedium" style={styles.sectionTitle}>
            Base USD Price
          </Text>
          <View style={styles.priceInputRow}>
            <Text variant="body" color={colors.textSecondary}>
              $
            </Text>
            <TextInput
              style={styles.priceInput}
              value={basePriceUSD}
              onChangeText={setBasePriceUSD}
              keyboardType="decimal-pad"
              placeholder="9.99"
              placeholderTextColor={colors.textTertiary}
            />
            <Text variant="caption" color={colors.textTertiary}>
              USD / month
            </Text>
          </View>
        </View>

        {/* PPP Price Preview */}
        {matchedPrices.length > 0 && (
          <View style={styles.section}>
            <Text variant="bodyMedium" style={styles.sectionTitle}>
              PPP Price Preview
            </Text>
            <Text
              variant="caption"
              color={colors.textSecondary}
              style={styles.sectionSubtitle}>
              Prices adjusted based on BigMac Index purchasing power parity
            </Text>

            {pricePointsLoading ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <View style={styles.priceTable}>
                {/* Header */}
                <View style={styles.tableHeader}>
                  <Text
                    variant="caption"
                    color={colors.textSecondary}
                    style={styles.colTerritory}>
                    Territory
                  </Text>
                  <Text
                    variant="caption"
                    color={colors.textSecondary}
                    style={styles.colPPP}>
                    PPP
                  </Text>
                  <Text
                    variant="caption"
                    color={colors.textSecondary}
                    style={styles.colPrice}>
                    Price
                  </Text>
                  <Text
                    variant="caption"
                    color={colors.textSecondary}
                    style={styles.colDiscount}>
                    Adj.
                  </Text>
                </View>

                {/* Rows */}
                {matchedPrices.map(price => (
                  <View key={price.territoryCode} style={styles.tableRow}>
                    <View style={styles.colTerritory}>
                      <Text variant="body">{price.countryName}</Text>
                      <Text variant="caption" color={colors.textTertiary}>
                        {price.currencyCode}
                      </Text>
                    </View>
                    <Text
                      variant="caption"
                      color={colors.textSecondary}
                      style={styles.colPPP}>
                      {price.pppIndex.toFixed(2)}
                    </Text>
                    <Text variant="body" style={styles.colPrice}>
                      {formatPrice(price.matchedPrice, 'USD')}
                    </Text>
                    <Text
                      variant="caption"
                      color={getDiscountColor(price.discountPercent)}
                      style={styles.colDiscount}>
                      {formatDiscount(price.discountPercent)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Apply Button */}
        {matchedPrices.length > 0 && (
          <View style={styles.actions}>
            <Pressable
              style={[
                styles.applyButton,
                isApplying && styles.applyButtonDisabled,
              ]}
              onPress={handleApplyPrices}
              disabled={isApplying}>
              {isApplying ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text variant="bodyMedium" color="#FFFFFF">
                  Apply PPP Prices ({matchedPrices.length} territories)
                </Text>
              )}
            </Pressable>
            <Text
              variant="caption"
              color={colors.textTertiary}
              style={styles.actionHint}>
              This will update prices for all territories shown above
            </Text>
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.xxl,
  },
  subtitle: {
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
  },
  sectionSubtitle: {
    marginBottom: spacing.md,
  },
  priceInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  priceInput: {
    backgroundColor: colors.sidebar,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.sm,
    width: 100,
    fontSize: 16,
    color: colors.textPrimary,
  },
  priceTable: {
    backgroundColor: colors.sidebar,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.border,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  colTerritory: {
    flex: 2,
  },
  colPPP: {
    width: 50,
    textAlign: 'center',
  },
  colPrice: {
    width: 80,
    textAlign: 'right',
  },
  colDiscount: {
    width: 60,
    textAlign: 'right',
  },
  actions: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  applyButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    borderRadius: radii.md,
    minWidth: 200,
    alignItems: 'center',
  },
  applyButtonDisabled: {
    opacity: 0.6,
  },
  actionHint: {
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  bottomPadding: {
    height: spacing.xxl,
  },
});
