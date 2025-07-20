/**
 * PKCE (Proof Key for Code Exchange) utilities for secure OAuth 2.0 flows
 */

// Generate a cryptographically secure random string
function generateRandomString(length: number): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Base64 URL encode (without padding)
function base64URLEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// Generate PKCE code verifier (43-128 characters)
export function generateCodeVerifier(): string {
  return generateRandomString(32); // 64 hex characters
}

// Generate PKCE code challenge using S256 method
export async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return base64URLEncode(digest);
}

// Generate state parameter for CSRF protection
export function generateState(): string {
  return generateRandomString(16); // 32 hex characters
}

// PKCE data storage in sessionStorage
export function storePKCEData(codeVerifier: string, state: string): void {
  sessionStorage.setItem('pkce_code_verifier', codeVerifier);
  sessionStorage.setItem('oauth_state', state);
}

// Retrieve and clean up PKCE data
export function retrieveAndClearPKCEData(): { codeVerifier: string | null; state: string | null } {
  const codeVerifier = sessionStorage.getItem('pkce_code_verifier');
  const state = sessionStorage.getItem('oauth_state');
  
  // Clean up
  sessionStorage.removeItem('pkce_code_verifier');
  sessionStorage.removeItem('oauth_state');
  
  return { codeVerifier, state };
}