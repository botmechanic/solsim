import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

const ALGO = 'aes-256-gcm';
const IV_BYTES = 12;

export type EncryptedQr = {
  ciphertext: Buffer;
  iv: Buffer;
  authTag: Buffer;
  keyVersion: number;
};

function loadKey(): Buffer {
  const raw = process.env.QR_ENCRYPTION_KEY;
  if (!raw) {
    throw new Error('QR_ENCRYPTION_KEY missing');
  }
  const key = Buffer.from(raw, 'base64');
  if (key.length !== 32) {
    throw new Error('QR_ENCRYPTION_KEY must be 32 bytes base64');
  }
  return key;
}

/** Encrypt QR payload. New random IV every call. */
export function encryptQrPayload(
  plaintext: string,
  keyVersion = 1,
): EncryptedQr {
  const key = loadKey();
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv(ALGO, key, iv);
  const ciphertext = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);
  return {
    ciphertext,
    iv,
    authTag: cipher.getAuthTag(),
    keyVersion,
  };
}

/** Sole decrypt path for QR payloads (call from QR route only). */
export function decryptQrPayload(parts: EncryptedQr): string {
  const key = loadKey();
  const decipher = createDecipheriv(ALGO, key, parts.iv);
  decipher.setAuthTag(parts.authTag);
  return Buffer.concat([
    decipher.update(parts.ciphertext),
    decipher.final(),
  ]).toString('utf8');
}
