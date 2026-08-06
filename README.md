# Solsim

Hackathon MVP: buy a mock eSIM on **Solana devnet**, own it as an NFT, reveal a mock QR to the on-chain owner.

## Repo layout

- `app/` — React Native (Android) client with Mobile Wallet Adapter
- `docs/PRD.md` — evening hackathon scope
- `docs/APP.md` — app structure and MWA wallet flow
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

## Run the app

```bash
cd app
npm install
npm start          # Metro
# other terminal:
npm run android
```

Core bootstrap (done):

- Bottom tabs: **Plans / My eSIMs / Wallet**
- MWA `authorize` / reauthorize / disconnect (`@solana-mobile/mobile-wallet-adapter-protocol-web3js`)
- Mock plan catalog (local) until `GET /plans` exists
- Identity: `{ name: 'Solsim', uri: 'https://solsim.so' }`, cluster `solana:devnet`

## Next (per PRD)

API purchase saga → pay on devnet → mint NFT → My eSIMs + owner-only QR.
