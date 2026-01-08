/**
 * BigMac Index PPP Data
 * Source: The Economist Big Mac Index (January 2024)
 * USD is base (pppIndex = 1.0)
 *
 * pppIndex < 1.0 = currency undervalued (country is cheaper, give discount)
 * pppIndex > 1.0 = currency overvalued (country is more expensive)
 */

import {getTerritory, getTerritoryName, getTerritoryCurrency} from '../../../libs/territories';

export interface PPPIndexEntry {
  territoryCode: string;
  countryName: string;
  currencyCode: string;
  pppIndex: number;
}

/**
 * Big Mac Index PPP values by territory code
 * Only stores the PPP index - territory metadata comes from centralized territories
 */
export const BIG_MAC_PPP_INDEX: Record<string, number> = {
  // Base - United States
  USA: 1.0,

  // Europe
  GBR: 0.92,
  DEU: 0.95,
  FRA: 0.95,
  ITA: 0.88,
  ESP: 0.85,
  NLD: 0.93,
  BEL: 0.92,
  AUT: 0.93,
  CHE: 1.25,
  IRL: 0.9,
  PRT: 0.82,
  SWE: 0.85,
  NOR: 1.05,
  DNK: 0.95,
  FIN: 0.92,
  POL: 0.55,
  CZE: 0.6,
  ROU: 0.5,
  HUN: 0.52,
  GRC: 0.78,
  HRV: 0.7,
  TUR: 0.35,
  RUS: 0.32,
  UKR: 0.35,

  // Americas
  CAN: 0.9,
  MEX: 0.58,
  BRA: 0.55,
  ARG: 0.4,
  CHL: 0.65,
  COL: 0.45,
  PER: 0.5,
  CRI: 0.6,
  URY: 0.65,

  // East Asia
  JPN: 0.53,
  CHN: 0.48,
  KOR: 0.65,
  TWN: 0.55,
  HKG: 0.55,

  // Southeast Asia
  SGP: 0.85,
  MYS: 0.5,
  THA: 0.55,
  IDN: 0.4,
  PHL: 0.48,
  VNM: 0.42,

  // South Asia
  IND: 0.35,
  PAK: 0.32,
  LKA: 0.35,
  BGD: 0.38,

  // Oceania
  AUS: 0.88,
  NZL: 0.82,

  // Middle East
  SAU: 0.6,
  ARE: 0.75,
  ISR: 0.85,
  QAT: 0.7,
  KWT: 0.65,
  BHR: 0.6,
  JOR: 0.55,

  // Africa
  ZAF: 0.42,
  EGY: 0.3,
  NGA: 0.28,
  KEN: 0.38,
  MAR: 0.5,
};

// Default PPP index for territories not in the list
export const DEFAULT_PPP_INDEX = 1.0;

/**
 * Get PPP index for a territory
 */
export function getPPPIndex(territoryCode: string): number {
  return BIG_MAC_PPP_INDEX[territoryCode] ?? DEFAULT_PPP_INDEX;
}

/**
 * Get full PPP entry for a territory (combines PPP data with territory metadata)
 */
export function getPPPEntry(territoryCode: string): PPPIndexEntry | undefined {
  const pppIndex = BIG_MAC_PPP_INDEX[territoryCode];
  if (pppIndex === undefined) return undefined;

  const territory = getTerritory(territoryCode);
  return {
    territoryCode,
    countryName: territory?.name ?? territoryCode,
    currencyCode: territory?.currency ?? 'USD',
    pppIndex,
  };
}

/**
 * @deprecated Use getPPPEntry instead
 */
export function getBigMacEntry(territoryCode: string): PPPIndexEntry | undefined {
  return getPPPEntry(territoryCode);
}

/**
 * Get all territories with PPP data
 */
export function getTerritoriesWithPPPData(): string[] {
  return Object.keys(BIG_MAC_PPP_INDEX);
}

/**
 * Check if territory has PPP data
 */
export function hasPPPData(territoryCode: string): boolean {
  return territoryCode in BIG_MAC_PPP_INDEX;
}

/**
 * Get territory name (from centralized data)
 */
export function getTerritoryNameForPPP(territoryCode: string): string {
  return getTerritoryName(territoryCode);
}

/**
 * Get territory currency (from centralized data)
 */
export function getTerritoryCurrencyForPPP(territoryCode: string): string {
  return getTerritoryCurrency(territoryCode);
}
