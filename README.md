# Solsim

**Seeker-native DeFi eSIM** — buy travel data with USDC/SKR, own it on-chain, install in one tap.

Hackathon MVP: buy a mock eSIM on **Solana devnet**, mint a **real Metaplex NFT** to the buyer, reveal a mock QR only to the owning wallet. Production path: wholesale provider (1GLOBAL / eSIM Access), Solana dApp Store, mainnet USDC.

## Documentation

| Doc | Contents |
|---|---|
| [docs/BUSINESS.md](./docs/BUSINESS.md) | Vision, GTM, Seeker strategy, wholesale partners, marketing |
| [docs/IMPLEMENTATION.md](./docs/IMPLEMENTATION.md) | Business & marketing execution plan (90-day, workstreams, app sync) |
| [docs/PRD.md](./docs/PRD.md) | Product requirements, technical phases, hackathon scope (§C) |
| [docs/APP.md](./docs/APP.md) | React Native client, MWA, eSIM install, dApp Store |
| [docs/DEMO.md](./docs/DEMO.md) | 90-second judge demo script |

## Repo layout

- `app/` — React Native (Android) client with Mobile Wallet Adapter
- `api/` — Express catalog + Metaplex mint (`GET /v1/plans`, `POST /v1/mints`)
- `shared/` — Shared TypeScript types
- `docs/` — Business, product, and app specs

## Prerequisites

See Solana Mobile [development setup](https://docs.solanamobile.com/get-started/development-setup):

- Node.js (`^20.19.4 || ^22.13.0 || >=24.3.0`)
- JDK 17, Android SDK, emulator or device
- MWA wallet: [Phantom](https://play.google.com/store/apps/details?id=app.phantom) or [Mock MWA Wallet](https://github.com/solana-mobile/mock-mwa-wallet)

## Run the API (required for live Buy with SOL mint)

```bash
cd api
npm install
cp .env.example .env

# Generate mint authority (once), fund it on devnet, paste secret into .env
npm run create-mint-authority
# → fund printed pubkey at https://faucet.solana.com (~1–2 SOL)
# → set MINT_AUTHORITY_SECRET=... and TREASURY_PUBKEY (must match app)

npm run dev          # http://localhost:8787
# curl http://localhost:8787/v1/plans
```

Emulator reaches the API at `http://10.0.2.2:8787`. Also:

```bash
adb reverse tcp:8787 tcp:8787
adb reverse tcp:8081 tcp:8081
```

Without the API (or mint authority), **Demo mode** still works offline. Live buys will fail at the mint step with a clear error.

NFT metadata JSON/SVG lives in `api/public/nft/` and is referenced via GitHub raw URLs so Phantom can fetch images after push.

## Run the app

```bash
cd app
npm install
npm start          # Metro
# other terminal:
npm run android
```

Demo loop (done for judging):

- Bottom tabs: **Plans / My eSIMs / Wallet**
- MWA connect + **Buy with SOL** (memo + transfer on devnet)
- API mints Metaplex NFT → Phantom Collectibles (devnet)
- Mock QR in encrypted local vault → **owner-only reveal**
- `FLAG_SECURE` on QR screen
- Demo mode fallback if faucet/SOL/API is unavailable
- Identity: `{ name: 'Solsim', uri: 'https://solsim.so' }`, cluster `solana:devnet`

See [docs/DEMO.md](docs/DEMO.md) for the pitch script.

## Next

**Post-hackathon (eng):** Postgres purchase saga, collection NFT, wire `decryptQrPayload` to `GET /esims/:mint/qr`. See [PRD §C](./docs/PRD.md#c--hackathon-mvp-scoped-build).

**Product:** Wholesale POC on Seeker → mainnet → dApp Store. See [BUSINESS.md](./docs/BUSINESS.md) and [IMPLEMENTATION.md](./docs/IMPLEMENTATION.md).
