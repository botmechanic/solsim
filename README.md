# Solsim

Hackathon MVP: buy a mock eSIM on **Solana devnet**, mint a **real Metaplex NFT** to the buyer, reveal a mock QR only to the owning wallet.

## Repo layout

- `app/` — React Native (Android) client with Mobile Wallet Adapter
- `api/` — Express catalog + Metaplex mint (`GET /v1/plans`, `POST /v1/mints`)
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

## Next (post-hackathon)

Postgres purchase saga, collection NFT, wire `decryptQrPayload` to `GET /esims/:mint/qr`.
