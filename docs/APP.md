# Solsim app (React Native)

Android client for the evening hackathon demo. Uses [Mobile Wallet Adapter](https://docs.solanamobile.com/get-started/react-native/invoke-mwa-sessions-directly) so keys never leave the wallet app.

## Structure

```
app/
  App.tsx                 # SafeArea + WalletProvider + tabs
  polyfill.js             # crypto/Buffer before @solana/web3.js
  src/
    config/               # APP_IDENTITY, devnet RPC
    wallet/               # MWA authorize / reauthorize / disconnect
    navigation/           # Plans stack + bottom tabs
    screens/              # Plans, PlanDetail, MyEsims, Wallet
    data/mockPlans.ts     # Local catalog until GET /plans
    components/
shared/types.ts           # EsimPlan / EsimNft shared shapes
```

## Tabs

| Tab | Purpose |
| --- | --- |
| Plans | Browse mock TH/JP plans; detail + “Buy” stub |
| My eSIMs | Ownership placeholder (chain-backed list next) |
| Wallet | Connect via MWA, show pubkey + SOL balance |

## Wallet flow

1. `transact` → `wallet.authorize({ chain: 'solana:devnet', identity })`
2. Persist `auth_token` + pubkey (AsyncStorage)
3. On launch, reauthorize with stored token; clear on failure
4. Disconnect calls `deauthorize` when possible

Identity: `{ name: 'Solsim', uri: 'https://solsim.so' }`.

## Run

See root [README.md](../README.md). Needs an MWA wallet on the device/emulator (Phantom or [mock MWA wallet](https://github.com/solana-mobile/mock-mwa-wallet)).
