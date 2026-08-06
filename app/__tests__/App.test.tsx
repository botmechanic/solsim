/**
 * @format
 */

jest.mock('@solana-mobile/mobile-wallet-adapter-protocol-web3js', () => ({
  transact: jest.fn(),
}));

jest.mock('react-native-qrcode-svg', () => 'QRCode');

jest.mock('../src/config/solana', () => ({
  RPC_ENDPOINT: 'https://api.devnet.solana.com',
  connection: {
    getBalance: jest.fn(async () => 0),
    getLatestBlockhash: jest.fn(async () => ({
      blockhash: '11111111111111111111111111111111',
    })),
    confirmTransaction: jest.fn(async () => ({ value: { err: null } })),
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
