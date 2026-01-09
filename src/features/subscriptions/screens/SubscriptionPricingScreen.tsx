/**
 * SubscriptionPricingScreen - Configure PPP pricing for a subscription
 * Refined macOS-native table design
 */

import React, {useState, useMemo, useCallback, useEffect} from 'react';
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
import {colors, spacing, radii, typography} from '@theme';
import {
  useApplyPPPPrices,
  useSubscriptionPrices,
  type TerritoryStatus,
} from '@features/subscriptions/hooks/useSubscriptions';
import {
  calculatePPPPrices,
  formatDiscount,
  getDiscountColor,
} from '@features/subscriptions/utils/pppCalculator';
import {
  getNearestTierForUSDPrice,
  constructPricePointId,
  getAvailableTerritories,
  getExchangeRateForTerritory,
} from '@features/subscriptions/utils/priceTiers';
import type {SubscriptionsStackParamList} from '@app/navigation/types';

type RouteProps = RouteProp<SubscriptionsStackParamList, 'SubscriptionPricing'>;

// Status indicator with clear visual states
function StatusIndicator({status}: {status?: TerritoryStatus}) {
  if (status === 'saving') {
    return (
      <View style={statusStyles.container}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }
  if (status === 'saved') {
    return (
      <View style={[statusStyles.container, statusStyles.savedContainer]}>
        <Text style={statusStyles.savedIcon}>✓</Text>
      </View>
    );
  }
  if (status === 'error') {
    return (
      <View style={[statusStyles.container, statusStyles.errorContainer]}>
        <Text style={statusStyles.errorIcon}>!</Text>
      </View>
    );
  }
  // Pending/default - subtle dot
  return (
    <View style={statusStyles.container}>
      <View style={statusStyles.pendingDot} />
    </View>
  );
}

const statusStyles = StyleSheet.create({
  container: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pendingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.borderLight,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  savedContainer: {
    backgroundColor: colors.success,
    borderRadius: 11,
  },
  savedIcon: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  errorContainer: {
    backgroundColor: colors.error,
    borderRadius: 11,
  },
  errorIcon: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

// Editable price cell component
function PriceCell({
  value,
  isOverridden,
  onChange,
  onClear,
}: {
  value: string;
  isOverridden: boolean;
  onChange: (v: string) => void;
  onClear: () => void;
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={priceCellStyles.wrapper}>
      <View style={[
        priceCellStyles.container,
        isOverridden && priceCellStyles.overriddenContainer,
        isFocused && priceCellStyles.focusedContainer,
      ]}>
        <Text style={priceCellStyles.currency}>$</Text>
        <TextInput
          style={priceCellStyles.input}
          value={value}
          onChangeText={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          keyboardType="decimal-pad"
          // @ts-ignore - macOS specific prop
          enableFocusRing={false}
        />
      </View>
      {isOverridden && (
        <Pressable onPress={onClear} style={priceCellStyles.clearButton}>
          <View style={priceCellStyles.clearButtonInner}>
            <Text style={priceCellStyles.clearIcon}>×</Text>
          </View>
        </Pressable>
      )}
    </View>
  );
}

const priceCellStyles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radii.md,
    backgroundColor: colors.sidebar,
    borderWidth: 1,
    borderColor: 'transparent',
    minWidth: 80,
  },
  overriddenContainer: {
    backgroundColor: 'rgba(255, 149, 0, 0.12)',
    borderColor: 'rgba(255, 149, 0, 0.25)',
  },
  focusedContainer: {
    backgroundColor: colors.content,
    borderColor: colors.primary,
  },
  currency: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    marginRight: 4,
  },
  input: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    textAlign: 'right' as const,
    padding: 0,
    flex: 1,
    outlineStyle: 'none' as any, // macOS specific
    outlineWidth: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  clearButton: {
    padding: 2,
    opacity: 0.7,
  },
  clearButtonInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.warning,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearIcon: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: -1,
  },
});

// Price display with hover tooltip for local currency
function PriceWithTooltip({
  currentUsd,
  newUsd,
  currentLocal,
  newLocal,
  currencyCode,
  hasChange,
}: {
  currentUsd: number | null;
  newUsd: number;
  currentLocal: number | null;
  newLocal: number;
  currencyCode: string;
  hasChange: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <View
      style={tooltipStyles.wrapper}
      // @ts-ignore - macOS specific props
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <View style={tooltipStyles.priceRow}>
        <Text style={tooltipStyles.currentPrice}>
          {currentUsd !== null ? `$${currentUsd.toFixed(2)}` : '—'}
        </Text>
        <Text style={tooltipStyles.arrow}>→</Text>
        <Text style={[tooltipStyles.newPrice, hasChange && tooltipStyles.newPriceChanged]}>
          ${newUsd.toFixed(2)}
        </Text>
      </View>
      {isHovered && (
        <View style={tooltipStyles.tooltip}>
          <View style={tooltipStyles.tooltipArrow} />
          <View style={tooltipStyles.tooltipContent}>
            <Text style={tooltipStyles.tooltipLabel}>Local price</Text>
            <Text style={tooltipStyles.tooltipValue}>
              {currentLocal !== null
                ? `${currencyCode} ${currentLocal.toFixed(2)} → ${currencyCode} ${newLocal.toFixed(2)}`
                : `${currencyCode} ${newLocal.toFixed(2)}`}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const tooltipStyles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  currentPrice: {
    ...typography.body,
    color: colors.textTertiary,
    fontVariant: ['tabular-nums'],
  },
  arrow: {
    ...typography.body,
    color: colors.textTertiary,
  },
  newPrice: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  newPriceChanged: {
    color: colors.primary,
  },
  tooltip: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: 6,
    zIndex: 1000,
  },
  tooltipArrow: {
    position: 'absolute',
    top: -4,
    right: 16,
    width: 8,
    height: 8,
    backgroundColor: colors.sidebar,
    transform: [{rotate: '45deg'}],
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: colors.border,
  },
  tooltipContent: {
    backgroundColor: colors.sidebar,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minWidth: 160,
  },
  tooltipLabel: {
    ...typography.caption,
    color: colors.textTertiary,
    marginBottom: 2,
  },
  tooltipValue: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
});

// Index value with indicator for territories without PPP data
function IndexValueWithIndicator({
  value,
  hasPPPData,
}: {
  value: number;
  hasPPPData: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <View
      style={indexIndicatorStyles.wrapper}
      // @ts-ignore - macOS specific props
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <Text style={indexIndicatorStyles.value}>
        {value.toFixed(2)}
        {!hasPPPData && <Text style={indexIndicatorStyles.asterisk}>*</Text>}
      </Text>
      {isHovered && !hasPPPData && (
        <View style={indexIndicatorStyles.popover}>
          <View style={indexIndicatorStyles.popoverArrow} />
          <View style={indexIndicatorStyles.popoverContent}>
            <Text style={indexIndicatorStyles.popoverText}>
              No BigMac Index data available.{'\n'}Using base USD price.
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const indexIndicatorStyles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    alignItems: 'flex-end',
  },
  value: {
    ...typography.body,
    color: colors.textSecondary,
    fontVariant: ['tabular-nums'],
  },
  asterisk: {
    ...typography.body,
    color: colors.warning,
    marginLeft: 1,
  },
  popover: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: 6,
    zIndex: 1000,
  },
  popoverArrow: {
    position: 'absolute',
    top: -4,
    right: 12,
    width: 8,
    height: 8,
    backgroundColor: colors.sidebar,
    transform: [{rotate: '45deg'}],
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: colors.border,
  },
  popoverContent: {
    backgroundColor: colors.sidebar,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minWidth: 180,
  },
  popoverText: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 16,
  },
});

export function SubscriptionPricingScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProps>();
  const {subscriptionId, subscriptionName} = route.params;

  const [basePriceUSD, setBasePriceUSD] = useState('9.99');
  const [isApplying, setIsApplying] = useState(false);
  const [territoryStatus, setTerritoryStatus] = useState<Record<string, TerritoryStatus>>({});
  const [priceOverrides, setPriceOverrides] = useState<Record<string, string>>({});

  // Get all available territories (from price tiers data)
  const allTerritories = useMemo(() => getAvailableTerritories(), []);

  // Fetch current prices
  const {data: currentPricesData, isLoading: pricesLoading} = useSubscriptionPrices(subscriptionId);

  // Build map of territory -> current local price
  const currentPrices = useMemo(() => {
    const map: Record<string, {localPrice: string; pricePointId: string}> = {};
    if (!currentPricesData?.data) return map;

    for (const price of currentPricesData.data) {
      const territoryId = price.relationships?.territory?.data?.id;
      const pricePointId = price.relationships?.subscriptionPricePoint?.data?.id;
      if (territoryId && pricePointId) {
        // Find the price point in included data
        const pricePoint = currentPricesData.included?.find(
          (inc: any) => inc.type === 'subscriptionPricePoints' && inc.id === pricePointId
        ) as any;
        if (pricePoint) {
          map[territoryId] = {
            localPrice: pricePoint.attributes?.customerPrice || '0',
            pricePointId,
          };
        }
      }
    }
    return map;
  }, [currentPricesData]);

  // Set base price from USA when data loads
  const [hasInitializedFromAPI, setHasInitializedFromAPI] = useState(false);
  useEffect(() => {
    if (currentPrices['USA'] && !hasInitializedFromAPI) {
      setBasePriceUSD(currentPrices['USA'].localPrice);
      setHasInitializedFromAPI(true);
    }
  }, [currentPrices, hasInitializedFromAPI]);

  // Callback to update territory status
  const handleProgress = useCallback((territoryCode: string, status: TerritoryStatus) => {
    setTerritoryStatus(prev => ({...prev, [territoryCode]: status}));
  }, []);

  const applyPPPPrices = useApplyPPPPrices();

  // Calculate PPP prices for all territories
  const pppPrices = useMemo(() => {
    const price = parseFloat(basePriceUSD);
    if (isNaN(price) || price <= 0) return [];

    return calculatePPPPrices({
      basePriceUSD: price,
      territories: allTerritories,
    });
  }, [basePriceUSD, allTerritories]);

  // Match to Apple price tiers using static lookup with exchange rate conversion
  const matchedPrices = useMemo(() => {
    if (pppPrices.length === 0) return [];

    return pppPrices
      .map(ppp => {
        // Check for price override (in USD)
        const overrideStr = priceOverrides[ppp.territoryCode];
        const overridePrice = overrideStr ? parseFloat(overrideStr) : null;
        const targetUsdPrice = overridePrice && !isNaN(overridePrice) ? overridePrice : ppp.calculatedPriceUSD;

        // Find nearest tier in local currency using exchange rates
        const result = getNearestTierForUSDPrice(ppp.territoryCode, targetUsdPrice);
        if (!result) return null;

        // Construct the price point ID directly
        const pricePointId = constructPricePointId(subscriptionId, ppp.territoryCode, result.tier);

        // Get current price for this territory
        const current = currentPrices[ppp.territoryCode];
        const currentLocalPrice = current ? parseFloat(current.localPrice) : null;
        const hasChange = currentLocalPrice !== null && currentLocalPrice !== result.localPrice;

        // Calculate USD equivalent of current price
        const exchangeRate = getExchangeRateForTerritory(ppp.territoryCode);
        const currentUsdEquivalent = currentLocalPrice !== null ? currentLocalPrice / exchangeRate : null;

        return {
          ...ppp,
          pricePointId,
          currentLocalPrice,
          currentUsdEquivalent,
          newLocalPrice: result.localPrice,
          newUsdEquivalent: result.usdEquivalent,
          matchedTier: result.tier,
          isOverridden: overridePrice !== null && !isNaN(overridePrice),
          hasChange,
        };
      })
      .filter((p): p is NonNullable<typeof p> => p !== null)
      .sort((a, b) => a.countryName.localeCompare(b.countryName));
  }, [pppPrices, priceOverrides, subscriptionId, currentPrices]);

  // Handle price override change
  const handlePriceOverride = useCallback((territoryCode: string, value: string) => {
    setPriceOverrides(prev => ({...prev, [territoryCode]: value}));
  }, []);

  // Clear override for a territory
  const clearOverride = useCallback((territoryCode: string) => {
    setPriceOverrides(prev => {
      const next = {...prev};
      delete next[territoryCode];
      return next;
    });
  }, []);

  const handleApplyPrices = async () => {
    if (matchedPrices.length === 0) return;

    setIsApplying(true);
    // Reset all statuses to pending
    setTerritoryStatus({});

    try {
      const pricesToApply = matchedPrices.map(p => ({
        pricePointId: p.pricePointId,
        territoryCode: p.territoryCode,
      }));

      await applyPPPPrices.mutateAsync({
        subscriptionId,
        prices: pricesToApply,
        onProgress: handleProgress,
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
          <View style={styles.basePriceContainer}>
            <View style={styles.basePriceInputWrapper}>
              <Text style={styles.basePriceCurrency}>$</Text>
              <TextInput
                style={styles.basePriceInput}
                value={basePriceUSD}
                onChangeText={setBasePriceUSD}
                keyboardType="decimal-pad"
                placeholder="9.99"
                placeholderTextColor={colors.textTertiary}
              />
            </View>
            <Text variant="caption" color={colors.textTertiary}>
              USD / month
            </Text>
          </View>
        </View>

        {/* Loading state */}
        {pricesLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={colors.primary} />
            <Text variant="caption" color={colors.textSecondary} style={{marginTop: spacing.sm}}>
              Loading current prices...
            </Text>
          </View>
        )}

        {/* PPP Price Preview */}
        {!pricesLoading && matchedPrices.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text variant="bodyMedium">PPP Price Preview</Text>
              <Text variant="caption" color={colors.textTertiary}>
                {matchedPrices.length} territories
              </Text>
            </View>
            <Text
              variant="caption"
              color={colors.textSecondary}
              style={styles.sectionSubtitle}>
              Prices adjusted based on BigMac Index · Click any price to override
            </Text>

            <View style={styles.tableContainer}>
                {/* Table Header */}
                <View style={styles.tableHeader}>
                  <View style={styles.colStatus} />
                  <Text style={[styles.headerText, styles.colTerritory]}>
                    Territory
                  </Text>
                  <Text style={[styles.headerText, styles.colIndex]}>
                    Index
                  </Text>
                  <Text style={[styles.headerText, styles.colPrice]}>
                    Price (USD)
                  </Text>
                  <Text style={[styles.headerText, styles.colAdjustment]}>
                    Adj.
                  </Text>
                </View>

                {/* Table Body */}
                <View style={styles.tableBody}>
                  {matchedPrices.map((price, index) => (
                    <View
                      key={price.territoryCode}
                      style={[
                        styles.tableRow,
                        index % 2 === 1 && styles.tableRowAlt,
                        index === matchedPrices.length - 1 && styles.tableRowLast,
                      ]}>
                      <View style={styles.colStatus}>
                        <StatusIndicator status={territoryStatus[price.territoryCode]} />
                      </View>
                      <View style={styles.colTerritory}>
                        <Text style={styles.countryName}>{price.countryName}</Text>
                        <Text style={styles.currencyCode}>{price.currencyCode}</Text>
                      </View>
                      <View style={styles.colIndex}>
                        <IndexValueWithIndicator
                          value={price.pppIndex}
                          hasPPPData={price.hasPPPData}
                        />
                      </View>
                      <View style={styles.colPrice}>
                        <PriceWithTooltip
                          currentUsd={price.currentUsdEquivalent}
                          newUsd={price.newUsdEquivalent}
                          currentLocal={price.currentLocalPrice}
                          newLocal={price.newLocalPrice}
                          currencyCode={price.currencyCode}
                          hasChange={price.hasChange}
                        />
                      </View>
                      <View style={styles.colAdjustment}>
                        <View
                          style={[
                            styles.adjustmentBadge,
                            {backgroundColor: `${getDiscountColor(price.discountPercent)}15`},
                          ]}>
                          <Text
                            style={[
                              styles.adjustmentValue,
                              {color: getDiscountColor(price.discountPercent)},
                            ]}>
                            {formatDiscount(price.discountPercent)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
          </View>
        )}

        {/* Apply Button */}
        {!pricesLoading && matchedPrices.length > 0 && (
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
                <Text style={styles.applyButtonText}>
                  Apply PPP Prices
                </Text>
              )}
            </Pressable>
            <Text
              variant="caption"
              color={colors.textTertiary}
              style={styles.actionHint}>
              Updates prices for all {matchedPrices.length} territories
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
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
  },
  sectionSubtitle: {
    marginBottom: spacing.md,
  },

  // Base price input
  basePriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  basePriceInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.content,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  basePriceCurrency: {
    ...typography.body,
    color: colors.textSecondary,
    marginRight: spacing.xs,
  },
  basePriceInput: {
    ...typography.body,
    color: colors.textPrimary,
    minWidth: 60,
    padding: 0,
  },

  // Table
  loadingContainer: {
    padding: spacing.xxxl,
    alignItems: 'center',
  },
  tableContainer: {
    borderRadius: radii.xl,
    backgroundColor: colors.content,
    borderWidth: 1,
    borderColor: colors.borderLight,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.sidebar,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerText: {
    ...typography.caption,
    color: colors.textTertiary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  tableBody: {
    backgroundColor: colors.content,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    minHeight: 56,
  },
  tableRowAlt: {
    backgroundColor: 'rgba(0, 0, 0, 0.015)',
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },

  // Columns
  colStatus: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colTerritory: {
    flex: 1,
    paddingRight: spacing.lg,
  },
  colIndex: {
    width: 64,
    alignItems: 'flex-end',
    paddingRight: spacing.lg,
  },
  colPrice: {
    width: 200,
    alignItems: 'flex-end',
    paddingRight: spacing.md,
  },
  colAdjustment: {
    width: 72,
    alignItems: 'flex-end',
  },

  // Cell content
  countryName: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  currencyCode: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: 2,
    letterSpacing: 0.3,
  },
  adjustmentBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radii.md,
  },
  adjustmentValue: {
    ...typography.bodyMedium,
    fontVariant: ['tabular-nums'],
  },

  // Actions
  actions: {
    alignItems: 'center',
    paddingTop: spacing.xl,
  },
  applyButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxxl,
    borderRadius: radii.lg,
    minWidth: 200,
    alignItems: 'center',
  },
  applyButtonDisabled: {
    opacity: 0.6,
  },
  applyButtonText: {
    ...typography.bodyMedium,
    color: '#FFFFFF',
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  actionHint: {
    marginTop: spacing.md,
  },
  bottomPadding: {
    height: spacing.xxl,
  },
});
