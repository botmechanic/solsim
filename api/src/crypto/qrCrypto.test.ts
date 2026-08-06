import assert from 'node:assert/strict';
import { describe, it, before } from 'node:test';
import { decryptQrPayload, encryptQrPayload } from './qrCrypto.js';

describe('qr crypto', () => {
  before(() => {
    process.env.QR_ENCRYPTION_KEY = Buffer.alloc(32, 7).toString('base64');
  });

  it('round-trips and uses unique IVs', () => {
    const a = encryptQrPayload('LPA:1$rsp.example.com$ABC');
    const b = encryptQrPayload('LPA:1$rsp.example.com$ABC');
    assert.notEqual(a.iv.toString('hex'), b.iv.toString('hex'));
    assert.equal(decryptQrPayload(a), 'LPA:1$rsp.example.com$ABC');
    assert.equal(decryptQrPayload(b), 'LPA:1$rsp.example.com$ABC');
  });

  it('fails on tamper', () => {
    const enc = encryptQrPayload('LPA:1$rsp.example.com$ABC');
    enc.ciphertext[0] ^= 0xff;
    assert.throws(() => decryptQrPayload(enc));
  });
});
