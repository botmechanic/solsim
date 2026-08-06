/**
 * @format
 */

jest.mock('@solana-mobile/mobile-wallet-adapter-protocol-web3js', () => ({
  transact: jest.fn(),
}));

jest.mock('../src/config/solana', () => ({
  RPC_ENDPOINT: 'https://api.devnet.solana.com',
  connection: {
    getBalance: jest.fn(async () => 0),
  },
}));

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

test('renders Solsim root', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
