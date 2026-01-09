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
    appInfos?: {
      links: {
        related: string;
        self: string;
      };
    };
  };
}

// App Info types
export type AppStoreState =
  | 'ACCEPTED'
  | 'DEVELOPER_REMOVED_FROM_SALE'
  | 'DEVELOPER_REJECTED'
  | 'IN_REVIEW'
  | 'INVALID_BINARY'
  | 'METADATA_REJECTED'
  | 'PENDING_APPLE_RELEASE'
  | 'PENDING_CONTRACT'
  | 'PENDING_DEVELOPER_RELEASE'
  | 'PREPARE_FOR_SUBMISSION'
  | 'PREORDER_READY_FOR_SALE'
  | 'PROCESSING_FOR_APP_STORE'
  | 'READY_FOR_REVIEW'
  | 'READY_FOR_SALE'
  | 'REJECTED'
  | 'REMOVED_FROM_SALE'
  | 'WAITING_FOR_EXPORT_COMPLIANCE'
  | 'WAITING_FOR_REVIEW'
  | 'REPLACED_WITH_NEW_VERSION'
  | 'NOT_APPLICABLE';

export type AppStoreAgeRating =
  | 'FOUR_PLUS'
  | 'NINE_PLUS'
  | 'TWELVE_PLUS'
  | 'SEVENTEEN_PLUS'
  | 'UNRATED';

export type BrazilAgeRating =
  | 'L'
  | 'TEN'
  | 'TWELVE'
  | 'FOURTEEN'
  | 'SIXTEEN'
  | 'EIGHTEEN';

export type KidsAgeBand = 'FIVE_AND_UNDER' | 'SIX_TO_EIGHT' | 'NINE_TO_ELEVEN';

export interface AppInfo {
  type: 'appInfos';
  id: string;
  attributes: {
    appStoreState?: AppStoreState;
    state?: string;
    appStoreAgeRating?: AppStoreAgeRating;
    brazilAgeRating?: BrazilAgeRating;
    brazilAgeRatingV2?: BrazilAgeRating;
    kidsAgeBand?: KidsAgeBand;
  };
  relationships?: {
    app?: {
      data: {type: 'apps'; id: string};
    };
    primaryCategory?: {
      data: {type: 'appCategories'; id: string} | null;
    };
    secondaryCategory?: {
      data: {type: 'appCategories'; id: string} | null;
    };
    appInfoLocalizations?: {
      links: {related: string};
    };
  };
}

export interface AppInfoLocalization {
  type: 'appInfoLocalizations';
  id: string;
  attributes: {
    locale: string;
    name?: string;
    subtitle?: string;
    privacyPolicyUrl?: string;
    privacyChoicesUrl?: string;
    privacyPolicyText?: string;
  };
  relationships?: {
    appInfo?: {
      data: {type: 'appInfos'; id: string};
    };
  };
}

export interface AppCategory {
  type: 'appCategories';
  id: string;
  attributes: {
    platforms: string[];
  };
  relationships?: {
    subcategories?: {
      links: {related: string};
    };
    parent?: {
      data: {type: 'appCategories'; id: string} | null;
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
