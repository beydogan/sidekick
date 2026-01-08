/**
 * PPP Price Calculator
 * Calculates Purchasing Power Parity adjusted prices for different territories
 */

import {
  getPPPIndex,
  getBigMacEntry,
  DEFAULT_PPP_INDEX,
} from './bigMacIndex';

export interface PPPCalculationResult {
  territoryCode: string;
  countryName: string;
  currencyCode: string;
  basePriceUSD: number;
  pppIndex: number;
  calculatedPriceUSD: number;
  discountPercent: number; // Negative = discount, positive = premium
  hasPPPData: boolean;
}

export interface CalculatePPPOptions {
  basePriceUSD: number;
  territories: string[];
  minDiscountPercent?: number; // e.g., -70 (max 70% discount)
  maxPremiumPercent?: number; // e.g., 30 (max 30% premium)
}

/**
 * Calculate PPP-adjusted prices for multiple territories
 */
export function calculatePPPPrices(
  options: CalculatePPPOptions,
): PPPCalculationResult[] {
  const {
    basePriceUSD,
    territories,
    minDiscountPercent = -70,
    maxPremiumPercent = 30,
  } = options;

  return territories.map(territoryCode => {
    const entry = getBigMacEntry(territoryCode);
    const pppIndex = entry?.pppIndex ?? DEFAULT_PPP_INDEX;
    const hasPPPData = !!entry;

    // Calculate PPP-adjusted price
    let calculatedPriceUSD = basePriceUSD * pppIndex;

    // Calculate discount/premium percentage
    let discountPercent =
      ((calculatedPriceUSD - basePriceUSD) / basePriceUSD) * 100;

    // Clamp to bounds
    if (discountPercent < minDiscountPercent) {
      discountPercent = minDiscountPercent;
      calculatedPriceUSD = basePriceUSD * (1 + minDiscountPercent / 100);
    }
    if (discountPercent > maxPremiumPercent) {
      discountPercent = maxPremiumPercent;
      calculatedPriceUSD = basePriceUSD * (1 + maxPremiumPercent / 100);
    }

    return {
      territoryCode,
      countryName: entry?.countryName ?? territoryCode,
      currencyCode: entry?.currencyCode ?? 'USD',
      basePriceUSD,
      pppIndex,
      calculatedPriceUSD: Math.round(calculatedPriceUSD * 100) / 100,
      discountPercent: Math.round(discountPercent),
      hasPPPData,
    };
  });
}

/**
 * Calculate PPP-adjusted price for a single territory
 */
export function calculatePPPPrice(
  basePriceUSD: number,
  territoryCode: string,
): PPPCalculationResult {
  return calculatePPPPrices({
    basePriceUSD,
    territories: [territoryCode],
  })[0];
}

/**
 * Get discount color based on percentage
 * Used for UI display
 */
export function getDiscountColor(discountPercent: number): string {
  if (discountPercent <= -30) return '#34C759'; // Strong discount - green
  if (discountPercent < 0) return '#30D158'; // Mild discount - light green
  if (discountPercent === 0) return '#8E8E93'; // No change - gray
  if (discountPercent <= 15) return '#FF9500'; // Mild premium - orange
  return '#FF3B30'; // Strong premium - red
}

/**
 * Format discount percentage for display
 */
export function formatDiscount(discountPercent: number): string {
  if (discountPercent === 0) return 'No change';
  const sign = discountPercent > 0 ? '+' : '';
  return `${sign}${discountPercent}%`;
}
