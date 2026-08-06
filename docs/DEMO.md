# Judge demo script (~90 seconds)

## One-liner

**Solsim** turns a travel eSIM into a Solana-owned asset: pay with your wallet, hold the profile as an NFT-shaped mint, and reveal the install QR only if you still own it.

Open on the **Plans** tab — clean flat UI, Solsim wordmark + one-line pitch before you tap a plan.

## Setup before judging

1. Emulator or Android device with Phantom (or Mock MWA Wallet)
2. Devnet SOL in that wallet — [faucet.solana.com](https://faucet.solana.com)
3. `cd app && npm start` + `npm run android`

## Live path (preferred)

1. **Wallet** tab → Connect wallet (MWA approve); optionally **Share address** / Solscan
2. **Plans** → Thailand → show **total before you sign** → **Buy with SOL** → approve in wallet
3. Watch provisioning complete → **View payment on Solscan** (proof)
4. **Reveal QR** — LPA gated to this wallet → note screenshot block (`FLAG_SECURE`) → **Install steps** if asked
5. Pitch: “QR never lives in public metadata; ownership check is the gate. Secrets stay in EncryptedStorage / encrypted vault.”

## Fallback if faucet is down

Plan detail → **Demo mode (skip payment)** — still binds the mock eSIM to the connected wallet and shows the QR reveal UX. Call it out honestly.

## What to emphasize

- Keys never touch Solsim — Mobile Wallet Adapter only
- Payment is a real Solana devnet transaction (memo + transfer)
- Mock cellular profile (say so) with a production-shaped ownership model
- Next: Metaplex collection mint + API-encrypted QR vault (see PRD)
