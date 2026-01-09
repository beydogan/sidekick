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
  CreateSubscription: {appId: string; appName: string};
};

// Settings stack routes
export type SettingsStackParamList = {
  SettingsHome: {onConnectionSuccess?: () => void} | undefined;
};

// App Info stack routes
export type AppInfoStackParamList = {
  AppInfoHome: {appId: string; appName: string};
};

// App Settings stack routes
export type AppSettingsStackParamList = {
  AppSettingsHome: {appId: string; appName: string};
};

// Sidebar section identifiers
export type SidebarSection =
  | 'app-info'
  | 'app-settings'
  | 'pricing'
  | 'subscriptions'
  | 'settings';
