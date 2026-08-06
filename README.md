# Solsim

Hackathon MVP: buy a mock eSIM on **Solana devnet**, own it as an NFT, reveal a mock QR to the on-chain owner.

## Repo layout

- `app/` — React Native (Android) client with Mobile Wallet Adapter
- `api/` — Express mock catalog (`GET /health`, `GET /v1/plans`)
- `docs/PRD.md` — evening hackathon scope
- `docs/APP.md` — app structure and MWA wallet flow
- `docs/DEMO.md` — 90-second judge demo script
- `shared/` — shared TypeScript types

## Prerequisites

Already expected on this machine (see Solana Mobile [development setup](https://docs.solanamobile.com/get-started/development-setup)):

- Node.js (RN 0.86 prefers `^20.19.4 || ^22.13.0 || >=24.3.0`; avoid odd Node 23 if builds flake)
- JDK 17, Android SDK, emulator or device
- Shell env (added to `~/.zshrc`):

```bash
export JAVA_HOME="/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home"
export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH="$JAVA_HOME/bin:$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin"
```

### MWA wallet for testing

Install an MWA-compatible wallet on the emulator/device:

- [Phantom](https://play.google.com/store/apps/details?id=app.phantom), or
- [Mock MWA Wallet](https://github.com/solana-mobile/mock-mwa-wallet) (Solana Mobile docs)

Docs: [Solana Mobile overview](https://docs.solanamobile.com/get-started/overview) · [Invoke MWA directly](https://docs.solanamobile.com/get-started/react-native/invoke-mwa-sessions-directly)

## Run the API (optional — app falls back to offline mock catalog)

```bash
cd api
npm install
npm run dev          # http://localhost:8787
# curl http://localhost:8787/v1/plans
```

## Run the app

```bash
cd app
npm install
npm start          # Metro
# other terminal:
npm run android
```

Emulator reaches the API at `http://10.0.2.2:8787` (see `app/src/config/api.ts`).

Demo loop (done for judging):

- Bottom tabs: **Plans / My eSIMs / Wallet**
- MWA connect + **Buy with SOL** (memo + transfer on devnet)
- Mock provision → encrypted local ownership vault → **owner-only QR reveal**
- `FLAG_SECURE` on QR screen (Android screenshot block)
- Demo mode fallback if faucet/SOL is unavailable
- Identity: `{ name: 'Solsim', uri: 'https://solsim.so' }`, cluster `solana:devnet`

See [docs/DEMO.md](docs/DEMO.md) for the pitch script.

## Next (post-hackathon)

Purchase saga + Postgres, Metaplex collection mint, wire `decryptQrPayload` to `GET /esims/:mint/qr`.
