/**
 * AES-256-GCM Encryption Module
 * Menggunakan Web Crypto API (built-in browser, no dependencies)
 * 
 * Mengenkripsi data sensitif (NPWP, data keuangan) sebelum disimpan ke database
 */

// Derive a CryptoKey from a passphrase using PBKDF2
async function deriveKey(passphrase, salt) {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 310000, // OWASP recommended minimum
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// Generate a random salt
function generateSalt() {
  return crypto.getRandomValues(new Uint8Array(16));
}

// Generate a random IV (Initialization Vector)
function generateIV() {
  return crypto.getRandomValues(new Uint8Array(12));
}

// Convert ArrayBuffer to Base64 string
function bufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Convert Base64 string to ArrayBuffer
function base64ToBuffer(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Encrypt plaintext using AES-256-GCM
 * @param {string} plaintext - Data to encrypt
 * @param {string} passphrase - Secret key (from env or user-derived)
 * @returns {string} Encrypted string in format: base64(salt):base64(iv):base64(ciphertext)
 */
export async function encrypt(plaintext, passphrase) {
  if (!plaintext) return '';
  
  const encoder = new TextEncoder();
  const salt = generateSalt();
  const iv = generateIV();
  const key = await deriveKey(passphrase, salt);

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    encoder.encode(plaintext)
  );

  // Format: salt:iv:ciphertext (all base64 encoded)
  return `${bufferToBase64(salt)}:${bufferToBase64(iv)}:${bufferToBase64(ciphertext)}`;
}

/**
 * Decrypt ciphertext using AES-256-GCM
 * @param {string} encryptedData - Encrypted string from encrypt()
 * @param {string} passphrase - Same secret key used for encryption
 * @returns {string} Decrypted plaintext
 */
export async function decrypt(encryptedData, passphrase) {
  if (!encryptedData) return '';

  const [saltB64, ivB64, ciphertextB64] = encryptedData.split(':');
  if (!saltB64 || !ivB64 || !ciphertextB64) {
    throw new Error('Invalid encrypted data format');
  }

  const salt = base64ToBuffer(saltB64);
  const iv = base64ToBuffer(ivB64);
  const ciphertext = base64ToBuffer(ciphertextB64);
  const key = await deriveKey(passphrase, salt);

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    ciphertext
  );

  return new TextDecoder().decode(decrypted);
}

/**
 * Encrypt sensitive fields in an object
 * @param {Object} data - Object with fields to encrypt
 * @param {string[]} fields - Array of field names to encrypt
 * @param {string} passphrase - Encryption key
 * @returns {Object} Object with specified fields encrypted
 */
export async function encryptFields(data, fields, passphrase) {
  const result = { ...data };
  for (const field of fields) {
    if (result[field] && typeof result[field] === 'string') {
      result[field] = await encrypt(result[field], passphrase);
    }
  }
  return result;
}

/**
 * Decrypt sensitive fields in an object
 * @param {Object} data - Object with encrypted fields
 * @param {string[]} fields - Array of field names to decrypt
 * @param {string} passphrase - Decryption key
 * @returns {Object} Object with specified fields decrypted
 */
export async function decryptFields(data, fields, passphrase) {
  const result = { ...data };
  for (const field of fields) {
    if (result[field] && typeof result[field] === 'string' && result[field].includes(':')) {
      try {
        result[field] = await decrypt(result[field], passphrase);
      } catch {
        // Field might not be encrypted, leave as-is
      }
    }
  }
  return result;
}

// The encryption passphrase — loaded from env
export const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'zakatax-default-key-change-in-production';

// Convenience: fields that should be encrypted
export const SENSITIVE_FIELDS = ['npwp'];
