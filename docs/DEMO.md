# Judge demo script (~90 seconds)

## One-liner

> Every traveler overbuys mobile data and eats the loss. Solsim makes your eSIM an NFT, so unused data has a resale market instead of an expiration date.

**Open on the Plans tab.** For the resale pitch, switch to **Market** (or sell from My eSIMs).

## Setup before judging

1. Android device with **Phantom** (preferred), or emulator with **Mock MWA Wallet**
2. Devnet SOL in that wallet — [faucet.solana.com](https://faucet.solana.com) (live paths only)
3. API running with funded mint authority (`cd api && npm run dev`) — live mint / escrow
4. Install a **Metro-free** build: `cd app && npm run android:stable`
5. `adb reverse tcp:8787 tcp:8787` (marketplace + live mint)

You do **not** need Metro or `adb reverse 8081` for `android:stable`.

### Emulator + Demo mode (no Phantom)

1. Install [Mock MWA Wallet](https://github.com/solana-mobile/mock-mwa-wallet) on the AVD (`com.solana.mwallet`)
2. Set a device PIN; open **mwallet** → **Authenticate** (don’t open the QR scanner — it’s black without a camera)
3. Solsim → Connect → approve in mwallet

## Pitch path (preferred — ~60s)

1. **Market** — seed leftover (France, 6 GB left). Lead with traveler loss, then “NFT is the mechanism.”
2. Connect wallet B (or same wallet after a Demo buy) → **Buy leftover (Demo)** → lands in **My eSIMs**
3. Optional live loop: **Plans** → buy → **My eSIMs** → **Sell leftover** (deposit NFT to escrow) → switch wallet → **Buy with SOL** (pays seller) → claim QR

## Retail buy (supporting)

1. **Plans** → show total → **Buy with SOL** / **Demo mode**
2. **Reveal QR** — owner-gated + `FLAG_SECURE`
3. Phantom Collectibles for live NFT proof

## What to emphasize

- Differentiator is **resale of unused data**, not “buy eSIM with crypto”
- Keys never touch Solsim — Mobile Wallet Adapter only
- Live listings: NFT in escrow until buyer pays seller; QR stays off-chain
- Mock cellular profile (say so) with a production-shaped ownership model
- RPC via **QuickNode** (sponsor) — mention if judges ask about infra
