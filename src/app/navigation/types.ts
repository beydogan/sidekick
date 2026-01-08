/**
 * Navigation type definitions for React Navigation
 */

// Pricing stack routes
export type PricingStackParamList = {
  PricingHome: {appId: string; appName: string};
  PricingDetail: {priceId: string};
};

// Subscriptions stack routes
export type SubscriptionsStackParamList = {
  SubscriptionGroups: {appId: string; appName: string};
  SubscriptionList: {groupId: string; groupName: string};
  SubscriptionPricing: {subscriptionId: string; subscriptionName: string};
};

// Settings stack routes
export type SettingsStackParamList = {
  SettingsHome: {onConnectionSuccess?: () => void} | undefined;
};

// Sidebar section identifiers
export type SidebarSection = 'pricing' | 'subscriptions' | 'settings';
