import {apps, subscriptions} from '@libs/appStoreConnect';
import type {ToolDefinition, ToolHandler} from '../types';

// Tool definitions
export const listAppsDefinition: ToolDefinition = {
  name: 'list_apps',
  description: 'List all apps from App Store Connect',
  inputSchema: {
    type: 'object',
    properties: {},
  },
};

export const getAppDefinition: ToolDefinition = {
  name: 'get_app',
  description: 'Get details for a specific app from App Store Connect',
  inputSchema: {
    type: 'object',
    properties: {
      appId: {
        type: 'string',
        description: 'The App Store Connect app ID',
      },
    },
    required: ['appId'],
  },
};

export const listSubscriptionGroupsDefinition: ToolDefinition = {
  name: 'list_subscription_groups',
  description: 'List all subscription groups for an app',
  inputSchema: {
    type: 'object',
    properties: {
      appId: {
        type: 'string',
        description: 'The App Store Connect app ID',
      },
    },
    required: ['appId'],
  },
};

export const listSubscriptionsDefinition: ToolDefinition = {
  name: 'list_subscriptions',
  description: 'List all subscriptions in a subscription group',
  inputSchema: {
    type: 'object',
    properties: {
      groupId: {
        type: 'string',
        description: 'The subscription group ID',
      },
    },
    required: ['groupId'],
  },
};

export const getSubscriptionPricesDefinition: ToolDefinition = {
  name: 'get_subscription_prices',
  description: 'Get current prices for a subscription across all territories',
  inputSchema: {
    type: 'object',
    properties: {
      subscriptionId: {
        type: 'string',
        description: 'The subscription ID',
      },
    },
    required: ['subscriptionId'],
  },
};

// Tool handlers
export const listAppsHandler: ToolHandler = async () => {
  const response = await apps.listApps();
  return response.data.map(app => ({
    id: app.id,
    name: app.attributes.name,
    bundleId: app.attributes.bundleId,
    sku: app.attributes.sku,
  }));
};

export const getAppHandler: ToolHandler = async (params) => {
  const {appId} = params as {appId: string};
  const response = await apps.getApp(appId);
  return {
    id: response.data.id,
    name: response.data.attributes.name,
    bundleId: response.data.attributes.bundleId,
    sku: response.data.attributes.sku,
  };
};

export const listSubscriptionGroupsHandler: ToolHandler = async (params) => {
  const {appId} = params as {appId: string};
  const response = await subscriptions.listSubscriptionGroups(appId);
  return response.data.map(group => ({
    id: group.id,
    referenceName: group.attributes.referenceName,
  }));
};

export const listSubscriptionsHandler: ToolHandler = async (params) => {
  const {groupId} = params as {groupId: string};
  const response = await subscriptions.listSubscriptions(groupId);
  return response.data.map(sub => ({
    id: sub.id,
    name: sub.attributes.name,
    productId: sub.attributes.productId,
    state: sub.attributes.state,
    subscriptionPeriod: sub.attributes.subscriptionPeriod,
  }));
};

export const getSubscriptionPricesHandler: ToolHandler = async (params) => {
  const {subscriptionId} = params as {subscriptionId: string};
  const response = await subscriptions.getSubscriptionPrices(subscriptionId);
  return response.data.map(price => ({
    id: price.id,
    territory: price.relationships?.territory?.data?.id,
    startDate: price.attributes?.startDate,
  }));
};

// Export all tools as array for easy registration
export const ascTools = [
  {definition: listAppsDefinition, handler: listAppsHandler},
  {definition: getAppDefinition, handler: getAppHandler},
  {definition: listSubscriptionGroupsDefinition, handler: listSubscriptionGroupsHandler},
  {definition: listSubscriptionsDefinition, handler: listSubscriptionsHandler},
  {definition: getSubscriptionPricesDefinition, handler: getSubscriptionPricesHandler},
];
