/**
 * Apple App Store subscription price tiers per territory
 * Tier IDs are used to construct price point IDs: base64({"s":subscriptionId,"t":territory,"p":tier})
 */

import territoryPriceTiers from './territoryPriceTiers.json';
import exchangeRatesData from './exchangeRates.json';
import {getTerritoryCurrency} from '@libs/territories';

// Type for the imported JSON
type TerritoryPriceTiers = Record<string, Record<string, string>>;
type ExchangeRates = {base: string; date: string; rates: Record<string, number>};

const priceTiers = territoryPriceTiers as TerritoryPriceTiers;
const exchangeRates = exchangeRatesData as ExchangeRates;

/**
 * Get exchange rate for a currency (USD base)
 */
export function getExchangeRate(currencyCode: string): number {
  return exchangeRates.rates[currencyCode] ?? 1;
}

/**
 * Get exchange rate for a territory
 */
export function getExchangeRateForTerritory(territoryCode: string): number {
  const currency = getTerritoryCurrency(territoryCode);
  return getExchangeRate(currency);
}

/**
 * Get all available tiers for a territory
 */
export function getTiersForTerritory(territory: string): Record<string, string> | undefined {
  return priceTiers[territory];
}

/**
 * Find the nearest tier for a target local price in a territory
 */
export function getNearestTierForTerritory(
  territory: string,
  targetPrice: number,
): {price: number; tier: string} | undefined {
  const tiers = priceTiers[territory];
  if (!tiers) return undefined;

  const entries = Object.entries(tiers);
  if (entries.length === 0) return undefined;

  let nearest = entries[0];
  let minDiff = Math.abs(targetPrice - parseFloat(nearest[1]));

  for (const [tier, price] of entries) {
    const diff = Math.abs(targetPrice - parseFloat(price));
    if (diff < minDiff) {
      minDiff = diff;
      nearest = [tier, price];
    }
  }

  return {
    tier: nearest[0],
    price: parseFloat(nearest[1]),
  };
}

/**
 * Find the nearest tier for a target USD price
 * (Convenience function that uses USA territory)
 */
export function getNearestTier(targetUsdPrice: number): {price: number; tier: string} | undefined {
  return getNearestTierForTerritory('USA', targetUsdPrice);
}

/**
 * Find the nearest tier for a territory given a target USD price
 * Converts USD to local currency using exchange rates, then finds nearest local tier
 */
export function getNearestTierForUSDPrice(
  territory: string,
  targetUsdPrice: number,
): {tier: string; localPrice: number; usdEquivalent: number} | undefined {
  const tiers = priceTiers[territory];
  if (!tiers) return undefined;

  const exchangeRate = getExchangeRateForTerritory(territory);
  const targetLocalPrice = targetUsdPrice * exchangeRate;

  const entries = Object.entries(tiers);
  if (entries.length === 0) return undefined;

  let nearest = entries[0];
  let minDiff = Math.abs(targetLocalPrice - parseFloat(nearest[1]));

  for (const [tier, price] of entries) {
    const diff = Math.abs(targetLocalPrice - parseFloat(price));
    if (diff < minDiff) {
      minDiff = diff;
      nearest = [tier, price];
    }
  }

  const localPrice = parseFloat(nearest[1]);
  return {
    tier: nearest[0],
    localPrice,
    usdEquivalent: localPrice / exchangeRate,
  };
}

/**
 * Find tier by exact USD price (for USA territory)
 */
export function getTierForUSDPrice(usdPrice: number): string | undefined {
  const usaTiers = priceTiers['USA'];
  if (!usaTiers) return undefined;

  const priceStr = usdPrice.toFixed(2);
  for (const [tier, price] of Object.entries(usaTiers)) {
    if (price === priceStr) return tier;
  }
  return undefined;
}

/**
 * Get USD price for a tier
 */
export function getUSDPriceForTier(tier: string): number | undefined {
  const usaTiers = priceTiers['USA'];
  if (!usaTiers || !usaTiers[tier]) return undefined;
  return parseFloat(usaTiers[tier]);
}

/**
 * Construct a price point ID from components
 */
export function constructPricePointId(
  subscriptionId: string,
  territory: string,
  tier: string,
): string {
  const payload = JSON.stringify({s: subscriptionId, t: territory, p: tier});
  // @ts-ignore - btoa exists in RN macOS runtime
  return globalThis.btoa(payload);
}

/**
 * Get all available territories
 */
export function getAvailableTerritories(): string[] {
  return Object.keys(priceTiers);
}
