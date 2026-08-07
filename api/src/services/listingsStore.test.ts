import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  getListing,
  listActiveListings,
  seedDemoListing,
  upsertListing,
} from './listingsStore.js';

describe('listings store', () => {
  it('seeds a demo leftover listing', () => {
    seedDemoListing();
    const active = listActiveListings();
    assert.ok(active.length >= 1);
    const seed = active.find(item => item.listingId === 'seed-leftover-fr');
    assert.ok(seed);
    assert.equal(seed?.demo, true);
    assert.equal(seed?.dataRemainingMb, 6144);
  });

  it('marks listings sold', () => {
    upsertListing({
      listingId: 'test-list-1',
      mint: 'Mint111111111111111111111111111111111111111',
      seller: 'Seller111111111111111111111111111111111111',
      priceLamports: '1000000',
      country: 'TH',
      dataMb: 5120,
      dataRemainingMb: 3072,
      planId: 'mock_th_5gb_30d',
      validUntil: new Date().toISOString(),
      status: 'active',
      createdAt: new Date().toISOString(),
      demo: true,
      iccid: '8901',
      qrPayload: 'LPA:1$mock$TEST',
    });
    const record = getListing('test-list-1');
    assert.ok(record);
    record!.status = 'sold';
    upsertListing(record!);
    assert.equal(
      listActiveListings().find(item => item.listingId === 'test-list-1'),
      undefined,
    );
  });
});
