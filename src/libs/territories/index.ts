/**
 * Centralized App Store Territory Data
 * Single source of truth for territory codes, names, and currencies
 * Complete list of all 175 App Store territories
 */

export interface Territory {
  code: string;
  name: string;
  currency: string;
}

/**
 * App Store territories with their metadata
 * Codes match Apple's App Store Connect API territory identifiers
 */
export const TERRITORIES: Record<string, Territory> = {
  AFG: {code: 'AFG', name: 'Afghanistan', currency: 'USD'},
  AGO: {code: 'AGO', name: 'Angola', currency: 'USD'},
  AIA: {code: 'AIA', name: 'Anguilla', currency: 'USD'},
  ALB: {code: 'ALB', name: 'Albania', currency: 'USD'},
  ARE: {code: 'ARE', name: 'United Arab Emirates', currency: 'AED'},
  ARG: {code: 'ARG', name: 'Argentina', currency: 'USD'},
  ARM: {code: 'ARM', name: 'Armenia', currency: 'USD'},
  ATG: {code: 'ATG', name: 'Antigua and Barbuda', currency: 'USD'},
  AUS: {code: 'AUS', name: 'Australia', currency: 'AUD'},
  AUT: {code: 'AUT', name: 'Austria', currency: 'EUR'},
  AZE: {code: 'AZE', name: 'Azerbaijan', currency: 'USD'},
  BEL: {code: 'BEL', name: 'Belgium', currency: 'EUR'},
  BEN: {code: 'BEN', name: 'Benin', currency: 'USD'},
  BFA: {code: 'BFA', name: 'Burkina Faso', currency: 'USD'},
  BGR: {code: 'BGR', name: 'Bulgaria', currency: 'EUR'},
  BHR: {code: 'BHR', name: 'Bahrain', currency: 'USD'},
  BHS: {code: 'BHS', name: 'Bahamas', currency: 'USD'},
  BIH: {code: 'BIH', name: 'Bosnia and Herzegovina', currency: 'EUR'},
  BLR: {code: 'BLR', name: 'Belarus', currency: 'USD'},
  BLZ: {code: 'BLZ', name: 'Belize', currency: 'USD'},
  BMU: {code: 'BMU', name: 'Bermuda', currency: 'USD'},
  BOL: {code: 'BOL', name: 'Bolivia', currency: 'USD'},
  BRA: {code: 'BRA', name: 'Brazil', currency: 'BRL'},
  BRB: {code: 'BRB', name: 'Barbados', currency: 'USD'},
  BRN: {code: 'BRN', name: 'Brunei', currency: 'USD'},
  BTN: {code: 'BTN', name: 'Bhutan', currency: 'USD'},
  BWA: {code: 'BWA', name: 'Botswana', currency: 'USD'},
  CAN: {code: 'CAN', name: 'Canada', currency: 'CAD'},
  CHE: {code: 'CHE', name: 'Switzerland', currency: 'CHF'},
  CHL: {code: 'CHL', name: 'Chile', currency: 'CLP'},
  CHN: {code: 'CHN', name: 'China', currency: 'CNY'},
  CIV: {code: 'CIV', name: 'Ivory Coast', currency: 'USD'},
  CMR: {code: 'CMR', name: 'Cameroon', currency: 'USD'},
  COD: {code: 'COD', name: 'Democratic Republic of the Congo', currency: 'USD'},
  COG: {code: 'COG', name: 'Republic of the Congo', currency: 'USD'},
  COL: {code: 'COL', name: 'Colombia', currency: 'COP'},
  CPV: {code: 'CPV', name: 'Cape Verde', currency: 'USD'},
  CRI: {code: 'CRI', name: 'Costa Rica', currency: 'USD'},
  CYM: {code: 'CYM', name: 'Cayman Islands', currency: 'USD'},
  CYP: {code: 'CYP', name: 'Cyprus', currency: 'EUR'},
  CZE: {code: 'CZE', name: 'Czech Republic', currency: 'CZK'},
  DEU: {code: 'DEU', name: 'Germany', currency: 'EUR'},
  DMA: {code: 'DMA', name: 'Dominica', currency: 'USD'},
  DNK: {code: 'DNK', name: 'Denmark', currency: 'DKK'},
  DOM: {code: 'DOM', name: 'Dominican Republic', currency: 'USD'},
  DZA: {code: 'DZA', name: 'Algeria', currency: 'USD'},
  ECU: {code: 'ECU', name: 'Ecuador', currency: 'USD'},
  EGY: {code: 'EGY', name: 'Egypt', currency: 'EGP'},
  ESP: {code: 'ESP', name: 'Spain', currency: 'EUR'},
  EST: {code: 'EST', name: 'Estonia', currency: 'EUR'},
  FIN: {code: 'FIN', name: 'Finland', currency: 'EUR'},
  FJI: {code: 'FJI', name: 'Fiji', currency: 'USD'},
  FRA: {code: 'FRA', name: 'France', currency: 'EUR'},
  FSM: {code: 'FSM', name: 'Micronesia', currency: 'USD'},
  GAB: {code: 'GAB', name: 'Gabon', currency: 'USD'},
  GBR: {code: 'GBR', name: 'United Kingdom', currency: 'GBP'},
  GEO: {code: 'GEO', name: 'Georgia', currency: 'USD'},
  GHA: {code: 'GHA', name: 'Ghana', currency: 'USD'},
  GMB: {code: 'GMB', name: 'Gambia', currency: 'USD'},
  GNB: {code: 'GNB', name: 'Guinea-Bissau', currency: 'USD'},
  GRC: {code: 'GRC', name: 'Greece', currency: 'EUR'},
  GRD: {code: 'GRD', name: 'Grenada', currency: 'USD'},
  GTM: {code: 'GTM', name: 'Guatemala', currency: 'USD'},
  GUY: {code: 'GUY', name: 'Guyana', currency: 'USD'},
  HKG: {code: 'HKG', name: 'Hong Kong', currency: 'HKD'},
  HND: {code: 'HND', name: 'Honduras', currency: 'USD'},
  HRV: {code: 'HRV', name: 'Croatia', currency: 'EUR'},
  HUN: {code: 'HUN', name: 'Hungary', currency: 'HUF'},
  IDN: {code: 'IDN', name: 'Indonesia', currency: 'IDR'},
  IND: {code: 'IND', name: 'India', currency: 'INR'},
  IRL: {code: 'IRL', name: 'Ireland', currency: 'EUR'},
  IRQ: {code: 'IRQ', name: 'Iraq', currency: 'USD'},
  ISL: {code: 'ISL', name: 'Iceland', currency: 'USD'},
  ISR: {code: 'ISR', name: 'Israel', currency: 'ILS'},
  ITA: {code: 'ITA', name: 'Italy', currency: 'EUR'},
  JAM: {code: 'JAM', name: 'Jamaica', currency: 'USD'},
  JOR: {code: 'JOR', name: 'Jordan', currency: 'USD'},
  JPN: {code: 'JPN', name: 'Japan', currency: 'JPY'},
  KAZ: {code: 'KAZ', name: 'Kazakhstan', currency: 'KZT'},
  KEN: {code: 'KEN', name: 'Kenya', currency: 'USD'},
  KGZ: {code: 'KGZ', name: 'Kyrgyzstan', currency: 'USD'},
  KHM: {code: 'KHM', name: 'Cambodia', currency: 'USD'},
  KNA: {code: 'KNA', name: 'Saint Kitts and Nevis', currency: 'USD'},
  KOR: {code: 'KOR', name: 'South Korea', currency: 'KRW'},
  KWT: {code: 'KWT', name: 'Kuwait', currency: 'USD'},
  LAO: {code: 'LAO', name: 'Laos', currency: 'USD'},
  LBN: {code: 'LBN', name: 'Lebanon', currency: 'USD'},
  LBR: {code: 'LBR', name: 'Liberia', currency: 'USD'},
  LBY: {code: 'LBY', name: 'Libya', currency: 'USD'},
  LCA: {code: 'LCA', name: 'Saint Lucia', currency: 'USD'},
  LKA: {code: 'LKA', name: 'Sri Lanka', currency: 'USD'},
  LTU: {code: 'LTU', name: 'Lithuania', currency: 'EUR'},
  LUX: {code: 'LUX', name: 'Luxembourg', currency: 'EUR'},
  LVA: {code: 'LVA', name: 'Latvia', currency: 'EUR'},
  MAC: {code: 'MAC', name: 'Macau', currency: 'USD'},
  MAR: {code: 'MAR', name: 'Morocco', currency: 'USD'},
  MDA: {code: 'MDA', name: 'Moldova', currency: 'USD'},
  MDG: {code: 'MDG', name: 'Madagascar', currency: 'USD'},
  MDV: {code: 'MDV', name: 'Maldives', currency: 'USD'},
  MEX: {code: 'MEX', name: 'Mexico', currency: 'MXN'},
  MKD: {code: 'MKD', name: 'North Macedonia', currency: 'USD'},
  MLI: {code: 'MLI', name: 'Mali', currency: 'USD'},
  MLT: {code: 'MLT', name: 'Malta', currency: 'EUR'},
  MMR: {code: 'MMR', name: 'Myanmar', currency: 'USD'},
  MNE: {code: 'MNE', name: 'Montenegro', currency: 'EUR'},
  MNG: {code: 'MNG', name: 'Mongolia', currency: 'USD'},
  MOZ: {code: 'MOZ', name: 'Mozambique', currency: 'USD'},
  MRT: {code: 'MRT', name: 'Mauritania', currency: 'USD'},
  MSR: {code: 'MSR', name: 'Montserrat', currency: 'USD'},
  MUS: {code: 'MUS', name: 'Mauritius', currency: 'USD'},
  MWI: {code: 'MWI', name: 'Malawi', currency: 'USD'},
  MYS: {code: 'MYS', name: 'Malaysia', currency: 'MYR'},
  NAM: {code: 'NAM', name: 'Namibia', currency: 'USD'},
  NER: {code: 'NER', name: 'Niger', currency: 'USD'},
  NGA: {code: 'NGA', name: 'Nigeria', currency: 'NGN'},
  NIC: {code: 'NIC', name: 'Nicaragua', currency: 'USD'},
  NLD: {code: 'NLD', name: 'Netherlands', currency: 'EUR'},
  NOR: {code: 'NOR', name: 'Norway', currency: 'NOK'},
  NPL: {code: 'NPL', name: 'Nepal', currency: 'USD'},
  NRU: {code: 'NRU', name: 'Nauru', currency: 'USD'},
  NZL: {code: 'NZL', name: 'New Zealand', currency: 'NZD'},
  OMN: {code: 'OMN', name: 'Oman', currency: 'USD'},
  PAK: {code: 'PAK', name: 'Pakistan', currency: 'PKR'},
  PAN: {code: 'PAN', name: 'Panama', currency: 'USD'},
  PER: {code: 'PER', name: 'Peru', currency: 'PEN'},
  PHL: {code: 'PHL', name: 'Philippines', currency: 'PHP'},
  PLW: {code: 'PLW', name: 'Palau', currency: 'USD'},
  PNG: {code: 'PNG', name: 'Papua New Guinea', currency: 'USD'},
  POL: {code: 'POL', name: 'Poland', currency: 'PLN'},
  PRT: {code: 'PRT', name: 'Portugal', currency: 'EUR'},
  PRY: {code: 'PRY', name: 'Paraguay', currency: 'USD'},
  QAT: {code: 'QAT', name: 'Qatar', currency: 'QAR'},
  ROU: {code: 'ROU', name: 'Romania', currency: 'RON'},
  RUS: {code: 'RUS', name: 'Russia', currency: 'RUB'},
  RWA: {code: 'RWA', name: 'Rwanda', currency: 'USD'},
  SAU: {code: 'SAU', name: 'Saudi Arabia', currency: 'SAR'},
  SEN: {code: 'SEN', name: 'Senegal', currency: 'USD'},
  SGP: {code: 'SGP', name: 'Singapore', currency: 'SGD'},
  SLB: {code: 'SLB', name: 'Solomon Islands', currency: 'USD'},
  SLE: {code: 'SLE', name: 'Sierra Leone', currency: 'USD'},
  SLV: {code: 'SLV', name: 'El Salvador', currency: 'USD'},
  SRB: {code: 'SRB', name: 'Serbia', currency: 'EUR'},
  STP: {code: 'STP', name: 'Sao Tome and Principe', currency: 'USD'},
  SUR: {code: 'SUR', name: 'Suriname', currency: 'USD'},
  SVK: {code: 'SVK', name: 'Slovakia', currency: 'EUR'},
  SVN: {code: 'SVN', name: 'Slovenia', currency: 'EUR'},
  SWE: {code: 'SWE', name: 'Sweden', currency: 'SEK'},
  SWZ: {code: 'SWZ', name: 'Eswatini', currency: 'USD'},
  SYC: {code: 'SYC', name: 'Seychelles', currency: 'USD'},
  TCA: {code: 'TCA', name: 'Turks and Caicos Islands', currency: 'USD'},
  TCD: {code: 'TCD', name: 'Chad', currency: 'USD'},
  THA: {code: 'THA', name: 'Thailand', currency: 'THB'},
  TJK: {code: 'TJK', name: 'Tajikistan', currency: 'USD'},
  TKM: {code: 'TKM', name: 'Turkmenistan', currency: 'USD'},
  TON: {code: 'TON', name: 'Tonga', currency: 'USD'},
  TTO: {code: 'TTO', name: 'Trinidad and Tobago', currency: 'USD'},
  TUN: {code: 'TUN', name: 'Tunisia', currency: 'USD'},
  TUR: {code: 'TUR', name: 'Turkey', currency: 'TRY'},
  TWN: {code: 'TWN', name: 'Taiwan', currency: 'TWD'},
  TZA: {code: 'TZA', name: 'Tanzania', currency: 'TZS'},
  UGA: {code: 'UGA', name: 'Uganda', currency: 'USD'},
  UKR: {code: 'UKR', name: 'Ukraine', currency: 'USD'},
  URY: {code: 'URY', name: 'Uruguay', currency: 'USD'},
  USA: {code: 'USA', name: 'United States', currency: 'USD'},
  UZB: {code: 'UZB', name: 'Uzbekistan', currency: 'USD'},
  VCT: {code: 'VCT', name: 'Saint Vincent and the Grenadines', currency: 'USD'},
  VEN: {code: 'VEN', name: 'Venezuela', currency: 'USD'},
  VGB: {code: 'VGB', name: 'British Virgin Islands', currency: 'USD'},
  VNM: {code: 'VNM', name: 'Vietnam', currency: 'VND'},
  VUT: {code: 'VUT', name: 'Vanuatu', currency: 'USD'},
  XKS: {code: 'XKS', name: 'Kosovo', currency: 'EUR'},
  YEM: {code: 'YEM', name: 'Yemen', currency: 'USD'},
  ZAF: {code: 'ZAF', name: 'South Africa', currency: 'ZAR'},
  ZMB: {code: 'ZMB', name: 'Zambia', currency: 'USD'},
  ZWE: {code: 'ZWE', name: 'Zimbabwe', currency: 'USD'},
};

/**
 * Get territory by code
 */
export function getTerritory(code: string): Territory | undefined {
  return TERRITORIES[code];
}

/**
 * Get all territory codes
 */
export function getAllTerritoryCodes(): string[] {
  return Object.keys(TERRITORIES);
}

/**
 * Get territory name
 */
export function getTerritoryName(code: string): string {
  return TERRITORIES[code]?.name ?? code;
}

/**
 * Get territory currency
 */
export function getTerritoryCurrency(code: string): string {
  return TERRITORIES[code]?.currency ?? 'USD';
}

/**
 * Get all territories as array
 */
export function getAllTerritories(): Territory[] {
  return Object.values(TERRITORIES);
}

/**
 * Get territories by currency
 */
export function getTerritoriesByCurrency(currency: string): Territory[] {
  return Object.values(TERRITORIES).filter(t => t.currency === currency);
}
