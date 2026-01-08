// App Store Connect API Types

export interface Credentials {
  apiKeyId: string;
  issuerId: string;
  privateKey: string;
}

export interface CredentialsConfig {
  apiKeyId: string;
  issuerId: string;
  privateKeyPath: string;
}

// JSON:API response wrapper
export interface APIResponse<T> {
  data: T;
  links?: {
    self: string;
    next?: string;
  };
  meta?: {
    paging?: {
      total: number;
      limit: number;
    };
  };
}

export interface APIListResponse<T> {
  data: T[];
  links?: {
    self: string;
    next?: string;
  };
  included?: unknown[];
  meta?: {
    paging?: {
      total: number;
      limit: number;
    };
  };
}

// App types
export interface App {
  type: 'apps';
  id: string;
  attributes: {
    name: string;
    bundleId: string;
    sku: string;
    primaryLocale: string;
    contentRightsDeclaration?: string;
  };
  relationships?: {
    appPriceSchedule?: {
      links: {
        related: string;
        self: string;
      };
    };
  };
}

// Pricing types
export interface AppPriceSchedule {
  type: 'appPriceSchedules';
  id: string;
  relationships?: {
    app?: {
      data: {type: 'apps'; id: string};
    };
    baseTerritory?: {
      data: {type: 'territories'; id: string};
    };
    manualPrices?: {
      links: {related: string};
    };
    automaticPrices?: {
      links: {related: string};
    };
  };
}

export interface AppPrice {
  type: 'appPrices';
  id: string;
  attributes: {
    startDate?: string;
    endDate?: string;
    manual?: boolean;
  };
  relationships?: {
    appPricePoint?: {
      data: {type: 'appPricePoints'; id: string};
    };
    territory?: {
      data: {type: 'territories'; id: string};
    };
  };
}

export interface AppPricePoint {
  type: 'appPricePoints';
  id: string;
  attributes: {
    customerPrice: string;
    proceeds: string;
    priceTier?: string;
  };
  relationships?: {
    territory?: {
      data: {type: 'territories'; id: string};
    };
  };
}

export interface Territory {
  type: 'territories';
  id: string;
  attributes: {
    currency: string;
  };
}

// Subscription types
export interface SubscriptionGroup {
  type: 'subscriptionGroups';
  id: string;
  attributes: {
    referenceName: string;
  };
  relationships?: {
    subscriptions?: {
      links: {related: string};
    };
  };
}

export interface Subscription {
  type: 'subscriptions';
  id: string;
  attributes: {
    name: string;
    productId: string;
    state:
      | 'MISSING_METADATA'
      | 'READY_TO_SUBMIT'
      | 'WAITING_FOR_REVIEW'
      | 'IN_REVIEW'
      | 'DEVELOPER_ACTION_NEEDED'
      | 'PENDING_BINARY_APPROVAL'
      | 'APPROVED'
      | 'DEVELOPER_REMOVED_FROM_SALE'
      | 'REMOVED_FROM_SALE'
      | 'REJECTED';
    familySharable: boolean;
    subscriptionPeriod:
      | 'ONE_WEEK'
      | 'ONE_MONTH'
      | 'TWO_MONTHS'
      | 'THREE_MONTHS'
      | 'SIX_MONTHS'
      | 'ONE_YEAR';
    reviewNote?: string;
    groupLevel: number;
  };
  relationships?: {
    group?: {
      data: {type: 'subscriptionGroups'; id: string};
    };
    prices?: {
      links: {related: string};
    };
    pricePoints?: {
      links: {related: string};
    };
  };
}

export interface SubscriptionPricePoint {
  type: 'subscriptionPricePoints';
  id: string;
  attributes: {
    customerPrice: string;
    proceeds: string;
    proceedsYear2?: string;
  };
  relationships?: {
    territory?: {
      data: {type: 'territories'; id: string};
    };
  };
}

export interface SubscriptionPrice {
  type: 'subscriptionPrices';
  id: string;
  attributes: {
    startDate?: string;
    preserved?: boolean;
  };
  relationships?: {
    subscriptionPricePoint?: {
      data: {type: 'subscriptionPricePoints'; id: string};
    };
    territory?: {
      data: {type: 'territories'; id: string};
    };
  };
}

// Creation request types
export interface CreateSubscriptionGroupRequest {
  referenceName: string;
}

export interface CreateSubscriptionRequest {
  name: string;
  productId: string;
  subscriptionPeriod: Subscription['attributes']['subscriptionPeriod'];
  familySharable?: boolean;
  groupLevel?: number;
  reviewNote?: string;
}

// API Error
export interface APIError {
  id?: string;
  status: string;
  code: string;
  title: string;
  detail: string;
}

export interface APIErrorResponse {
  errors: APIError[];
}
