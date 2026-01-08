import {KJUR, KEYUTIL} from 'jsrsasign';
import type {Credentials} from './types';

const TOKEN_EXPIRY_SECONDS = 20 * 60; // 20 minutes (Apple's max)
const TOKEN_REFRESH_BUFFER = 5 * 60 * 1000; // Refresh 5 min before expiry

interface CachedToken {
  token: string;
  expiresAt: number;
}

let cachedToken: CachedToken | null = null;

function isTokenValid(): boolean {
  if (!cachedToken) {
    return false;
  }
  return Date.now() < cachedToken.expiresAt - TOKEN_REFRESH_BUFFER;
}

export function generateToken(credentials: Credentials): string {
  if (isTokenValid() && cachedToken) {
    console.log('[JWT] Using cached token');
    return cachedToken.token;
  }

  console.log('[JWT] Generating new token...');
  console.log('[JWT] API Key ID:', credentials.apiKeyId);
  console.log('[JWT] Issuer ID:', credentials.issuerId);
  console.log('[JWT] Private key length:', credentials.privateKey?.length || 0);

  const now = Math.floor(Date.now() / 1000);
  const exp = now + TOKEN_EXPIRY_SECONDS;

  try {
    // Parse the PEM key
    const privateKey = KEYUTIL.getKey(credentials.privateKey);
    console.log('[JWT] Private key parsed successfully');

    const header = {
      alg: 'ES256',
      kid: credentials.apiKeyId,
      typ: 'JWT',
    };

    const payload = {
      iss: credentials.issuerId,
      iat: now,
      exp: exp,
      aud: 'appstoreconnect-v1',
    };

    // Sign using the parsed key object
    const sHeader = JSON.stringify(header);
    const sPayload = JSON.stringify(payload);

    // Cast to expected type - we know it's ECDSA for ES256
    const token = KJUR.jws.JWS.sign('ES256', sHeader, sPayload, privateKey as KJUR.crypto.ECDSA);

    console.log('[JWT] Token generated successfully');
    console.log('[JWT] Token preview:', token.substring(0, 50) + '...');

    cachedToken = {
      token,
      expiresAt: exp * 1000,
    };

    return token;
  } catch (err) {
    console.error('[JWT] Error generating token:', err);
    throw err;
  }
}

export function clearTokenCache(): void {
  cachedToken = null;
}
