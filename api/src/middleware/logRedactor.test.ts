import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { redactForLog } from './logRedactor.js';

describe('log redactor', () => {
  it('redacts LPA payloads in strings', () => {
    const out = redactForLog({
      note: 'ok',
      blob: 'LPA:1$rsp.example.com$ABC123',
    });
    assert.match(out, /ok/);
    assert.match(out, /\[REDACTED\]/);
    assert.doesNotMatch(out, /LPA:1/);
  });

  it('redacts sensitive keys', () => {
    const out = redactForLog({
      qrPayload: 'secret-stuff',
      iccid: '8944',
    });
    assert.match(out, /8944/);
    assert.match(out, /\[REDACTED\]/);
    assert.doesNotMatch(out, /secret-stuff/);
  });
});
