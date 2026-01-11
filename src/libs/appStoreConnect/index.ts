// Client
export {
  request,
  get,
  post,
  patch,
  del,
  testConnection,
  AppStoreConnectError,
  AuthenticationError,
} from './client';

// Credentials
export {
  savePrivateKey,
  saveCredentialsConfig,
  loadCredentialsConfig,
  loadCredentials,
  clearCredentials,
  hasCredentials,
} from './credentials';

// JWT
export {generateToken, clearTokenCache} from './jwt';

// Endpoints - import and re-export as namespace objects
import * as appsEndpoints from './endpoints/apps';
import * as pricingEndpoints from './endpoints/pricing';
import * as subscriptionsEndpoints from './endpoints/subscriptions';
import * as appInfoEndpoints from './endpoints/appInfo';
import * as versionsEndpoints from './endpoints/versions';

export const apps = appsEndpoints;
export const pricing = pricingEndpoints;
export const subscriptions = subscriptionsEndpoints;
export const appInfo = appInfoEndpoints;
export const versions = versionsEndpoints;

// Types
export type {
  Credentials,
  CredentialsConfig,
  App,
  AppStoreVersion,
  AppVersionState,
  Platform,
  AppInfo,
  AppInfoLocalization,
  AppStoreVersionLocalization,
  AppCategory,
  AppStoreState,
  AppStoreAgeRating,
  AppPriceSchedule,
  AppPrice,
  AppPricePoint,
  Territory,
  SubscriptionGroup,
  Subscription,
  SubscriptionPricePoint,
  SubscriptionPrice,
  CreateSubscriptionGroupRequest,
  CreateSubscriptionRequest,
  APIResponse,
  APIListResponse,
  APIError,
  APIErrorResponse,
} from './types';
