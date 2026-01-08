/**
 * Price Point Matcher
 * Matches calculated PPP prices to the nearest valid Apple price tier
 */

import type {SubscriptionPricePoint} from '../../../libs/appStoreConnect';

export interface MatchedPricePoint {
  territoryCode: string;
  targetPriceUSD: number;
  matchedPricePoint: SubscriptionPricePoint;
  matchedPrice: number;
  priceDifferencePercent: number;
}

/**
 * Find the nearest Apple price point to a target price
 */
export function findNearestPricePoint(
  targetPrice: number,
  pricePoints: SubscriptionPricePoint[],
): SubscriptionPricePoint | null {
  if (pricePoints.length === 0) return null;

  let closest = pricePoints[0];
  let closestDiff = Math.abs(
    parseFloat(closest.attributes.customerPrice) - targetPrice,
  );

  for (const point of pricePoints) {
    const price = parseFloat(point.attributes.customerPrice);
    const diff = Math.abs(price - targetPrice);
    if (diff < closestDiff) {
      closest = point;
      closestDiff = diff;
    }
  }

  return closest;
}

/**
 * Match PPP-calculated prices to Apple price tiers
 */
export function matchPricePoints(
  targetPrices: Array<{territoryCode: string; targetPriceUSD: number}>,
  pricePointsByTerritory: Record<string, SubscriptionPricePoint[]>,
): MatchedPricePoint[] {
  const results: MatchedPricePoint[] = [];

  for (const {territoryCode, targetPriceUSD} of targetPrices) {
    const pricePoints = pricePointsByTerritory[territoryCode] || [];

    if (pricePoints.length === 0) {
      continue; // Skip territories without price points
    }

    const matched = findNearestPricePoint(targetPriceUSD, pricePoints);
    if (!matched) continue;

    const matchedPrice = parseFloat(matched.attributes.customerPrice);
    const priceDifferencePercent =
      ((matchedPrice - targetPriceUSD) / targetPriceUSD) * 100;

    results.push({
      territoryCode,
      targetPriceUSD,
      matchedPricePoint: matched,
      matchedPrice,
      priceDifferencePercent: Math.round(priceDifferencePercent * 10) / 10,
    });
  }

  return results;
}

/**
 * Get a sorted list of price points by price
 */
export function sortPricePoints(
  pricePoints: SubscriptionPricePoint[],
): SubscriptionPricePoint[] {
  return [...pricePoints].sort((a, b) => {
    const priceA = parseFloat(a.attributes.customerPrice);
    const priceB = parseFloat(b.attributes.customerPrice);
    return priceA - priceB;
  });
}

/**
 * Format price for display
 */
export function formatPrice(price: number, currencyCode: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}
