# Judge demo script (~90 seconds)

## One-liner

**Solsim** turns a travel eSIM into a Solana-owned asset: pay with your wallet, receive a real Metaplex NFT on devnet, and reveal the install QR only if you still own it.

Open on the **Plans** tab — clean flat UI, Solsim wordmark + one-line pitch before you tap a plan.

## Setup before judging

1. Android device with **Phantom** (preferred), or emulator with **Mock MWA Wallet**
2. Devnet SOL in that wallet — [faucet.solana.com](https://faucet.solana.com) (live Buy only)
3. API running with funded mint authority (`cd api && npm run dev`) — live mint only
4. Install a **Metro-free** build: `cd app && npm run android:stable`
5. `adb reverse tcp:8787 tcp:8787` (only needed for live mint / live catalog)

You do **not** need Metro or `adb reverse 8081` for `android:stable`.

### Emulator + Demo mode (no Phantom)

1. Install [Mock MWA Wallet](https://github.com/solana-mobile/mock-mwa-wallet) on the AVD (`com.solana.mwallet`)
2. Set a device PIN; open **mwallet** → **Authenticate** (don’t open the QR scanner — it’s black without a camera)
3. Solsim → Connect → approve in mwallet
4. Plan detail → **Demo mode** → Reveal QR

## Live path (preferred)

1. **Wallet** tab → Connect wallet (MWA approve)
2. **Plans** → Thailand → show **total before you sign** → **Buy with SOL** → approve in wallet
3. Watch steps: confirm → **Mint NFT** → provision → **View NFT on Solscan**
4. Open Phantom → **Collectibles** (devnet) — show the Solsim NFT
5. **Reveal QR** — LPA gated to this wallet → note screenshot block (`FLAG_SECURE`)
6. Pitch: “Payment and NFT are on-chain; the QR never appears in public metadata.”

## Fallback if faucet / API is down

Plan detail → **Demo mode** — binds a mock eSIM locally (no real mint). Call it out honestly. Still requires a connected wallet (Mock MWA is fine).

## What to emphasize

- Keys never touch Solsim — Mobile Wallet Adapter only
- Payment is a real Solana devnet transaction (memo + transfer)
- NFT is a real Metaplex mint to the buyer (Phantom Collectibles)
- Mock cellular profile (say so) with a production-shaped ownership model
