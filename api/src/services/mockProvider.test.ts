import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { MockProvider } from './mockProvider.js';

describe('MockProvider', () => {
  it('lists plans and filters by country', async () => {
    const provider = new MockProvider();
    const all = await provider.listPlans();
    assert.equal(all.length, 2);
    const th = await provider.listPlans('TH');
    assert.equal(th.length, 1);
    assert.equal(th[0]?.country, 'TH');
  });

  it('orders idempotently', async () => {
    const provider = new MockProvider();
    const a = await provider.orderEsim('mock_th_5gb_30d', 'idem-1');
    const b = await provider.orderEsim('mock_th_5gb_30d', 'idem-1');
    assert.equal(a.iccid, b.iccid);
    assert.equal(a.qrPayload, b.qrPayload);
    assert.match(a.qrPayload, /^LPA:1\$/);
  });

  it('rejects unknown plans', async () => {
    const provider = new MockProvider();
    await assert.rejects(
      () => provider.orderEsim('nope', 'idem-2'),
      /Unknown plan/,
    );
  });
});
