import {loadCredentials} from './credentials';
import {generateToken, clearTokenCache} from './jwt';
import type {APIErrorResponse} from './types';

const BASE_URL = 'https://api.appstoreconnect.apple.com/v1';

export class AppStoreConnectError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: APIErrorResponse['errors'],
  ) {
    super(message);
    this.name = 'AppStoreConnectError';
  }
}

export class AuthenticationError extends AppStoreConnectError {
  constructor(message: string = 'Not authenticated') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  params?: Record<string, string | string[] | undefined>;
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const credentials = await loadCredentials();
  if (!credentials) {
    throw new AuthenticationError('No credentials configured');
  }

  const token = generateToken(credentials);

  let url = `${BASE_URL}${path}`;

  // Add query params
  if (options.params) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(options.params)) {
      if (value === undefined) {
        continue;
      }
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, v));
      } else {
        searchParams.append(key, value);
      }
    }
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const fetchOptions: RequestInit = {
    method: options.method || 'GET',
    headers,
  };

  if (options.body) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  let response = await fetch(url, fetchOptions);

  // Handle rate limiting with retry
  if (response.status === 429) {
    const retryAfter = parseInt(response.headers.get('Retry-After') || '60', 10);
    await sleep(retryAfter * 1000);
    response = await fetch(url, fetchOptions);
  }

  // Handle token expiry - refresh and retry once
  if (response.status === 401) {
    clearTokenCache();
    const newToken = generateToken(credentials);
    headers.Authorization = `Bearer ${newToken}`;
    fetchOptions.headers = headers;
    response = await fetch(url, fetchOptions);
  }

  if (!response.ok) {
    let errorData: APIErrorResponse | undefined;
    try {
      errorData = await response.json();
    } catch {
      // Response may not be JSON
    }

    const errorMessage =
      errorData?.errors?.[0]?.detail ||
      errorData?.errors?.[0]?.title ||
      `Request failed with status ${response.status}`;

    throw new AppStoreConnectError(
      errorMessage,
      response.status,
      errorData?.errors,
    );
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export async function get<T>(
  path: string,
  params?: Record<string, string | string[] | undefined>,
): Promise<T> {
  return request<T>(path, {method: 'GET', params});
}

export async function post<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, {method: 'POST', body});
}

export async function patch<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, {method: 'PATCH', body});
}

export async function del<T>(path: string): Promise<T> {
  return request<T>(path, {method: 'DELETE'});
}

// Fetch by full URL (for pagination)
export async function getByUrl<T>(url: string): Promise<T> {
  const credentials = await loadCredentials();
  if (!credentials) {
    throw new AuthenticationError('No credentials configured');
  }

  const token = generateToken(credentials);
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new AppStoreConnectError(`Request failed: ${response.status}`, response.status);
  }

  return response.json();
}

// Test connection by fetching current user's apps
export async function testConnection(): Promise<boolean> {
  try {
    console.log('[Client] Testing connection...');
    const result = await get('/apps', {'limit': '1'});
    console.log('[Client] Connection successful:', result);
    return true;
  } catch (err) {
    console.error('[Client] Connection failed:', err);
    throw err; // Re-throw so we can see the actual error
  }
}
