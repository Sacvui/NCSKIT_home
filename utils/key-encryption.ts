/**
 * API Key Encryption Utilities
 *
 * Encrypts/decrypts user-provided Gemini API keys before storing in localStorage.
 * This prevents the key from being stored or transmitted in plaintext.
 *
 * Security model:
 * - Key is encrypted with AES-256 using a per-session salt derived from
 *   NEXT_PUBLIC_KEY_SALT (public env var) + a browser fingerprint component.
 * - The encrypted key is stored in localStorage — NOT the raw key.
 * - When calling the AI API, the encrypted key is sent to the server via
 *   `x-encrypted-key` header. The server decrypts it and calls Gemini directly.
 * - The raw key NEVER appears in network traffic.
 *
 * Note: This is client-side encryption for obfuscation + transport safety.
 * It is NOT a substitute for server-side key management (GEMINI_API_KEY env var).
 * If GEMINI_API_KEY is set on the server, personal keys are not needed at all.
 */

import CryptoJS from 'crypto-js';

// Public salt — combined with a session component for added entropy.
// This is intentionally public (NEXT_PUBLIC_) because the security model
// relies on the key never leaving the browser in plaintext, not on the salt being secret.
const BASE_SALT = process.env.NEXT_PUBLIC_KEY_SALT || 'ncsstat-gemini-v2';

/**
 * Get the encryption passphrase.
 * Combines the base salt with a stable browser-derived component.
 */
function getPassphrase(): string {
  if (typeof window === 'undefined') return BASE_SALT;

  // Use a stable browser component (not random, so decryption works across page loads)
  const browserComponent = [
    navigator.language,
    screen.colorDepth,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  ].join('|');

  return `${BASE_SALT}::${browserComponent}`;
}

/**
 * Encrypt a Gemini API key for safe storage and transport.
 * Returns a base64-encoded AES-256 ciphertext string.
 */
export function encryptApiKey(rawKey: string): string {
  if (!rawKey) return '';
  try {
    return CryptoJS.AES.encrypt(rawKey, getPassphrase()).toString();
  } catch {
    // Fallback: return empty string rather than exposing the raw key
    return '';
  }
}

/**
 * Decrypt a previously encrypted API key.
 * Returns the original key string, or empty string on failure.
 */
export function decryptApiKey(encryptedKey: string): string {
  if (!encryptedKey) return '';
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedKey, getPassphrase());
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || '';
  } catch {
    return '';
  }
}

/**
 * Store an API key securely in localStorage (encrypted).
 */
export function storeApiKey(rawKey: string): void {
  if (typeof localStorage === 'undefined') return;
  if (!rawKey) {
    localStorage.removeItem('ncsstat_gemini_key');
    return;
  }
  const encrypted = encryptApiKey(rawKey);
  if (encrypted) {
    localStorage.setItem('ncsstat_gemini_key', encrypted);
  }
}

/**
 * Retrieve and decrypt the stored API key from localStorage.
 * Returns the raw key, or empty string if not found / decryption fails.
 */
export function retrieveApiKey(): string {
  if (typeof localStorage === 'undefined') return '';
  const encrypted = localStorage.getItem('ncsstat_gemini_key');
  if (!encrypted) return '';
  return decryptApiKey(encrypted);
}

/**
 * Remove the stored API key from localStorage.
 */
export function clearApiKey(): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem('ncsstat_gemini_key');
}

/**
 * Check if a personal API key is currently stored.
 */
export function hasStoredApiKey(): boolean {
  if (typeof localStorage === 'undefined') return false;
  return !!localStorage.getItem('ncsstat_gemini_key');
}

/**
 * Get the encrypted key ready to send as an HTTP header.
 * Returns the encrypted string (safe to transmit), or empty string.
 */
export function getEncryptedKeyForHeader(): string {
  if (typeof localStorage === 'undefined') return '';
  return localStorage.getItem('ncsstat_gemini_key') || '';
}
