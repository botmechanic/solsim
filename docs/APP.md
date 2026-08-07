# Solsim mobile app

Android client for Solsim — **Seeker-first** travel eSIM with Solana wallet checkout. Uses [Mobile Wallet Adapter](https://docs.solanamobile.com/get-started/react-native/invoke-mwa-sessions-directly) so keys never leave the wallet (Phantom on dev; Seed Vault on Seeker).

**Related:** [PRD.md §B](./PRD.md#b--technical-direction) (technical phases) · [BUSINESS.md §3](./BUSINESS.md#3-seeker-integration-primary-distribution) (Seeker GTM)

---

## Product direction

| Phase | App capability |
|---|---|
| **Hackathon (now)** | MWA connect, 20-plan catalog, devnet buy + mint, **Market tab (resale)**, My eSIMs + QR, Sell leftover |
| **Seeker alpha** | Mainnet USDC, wholesale provider, **one-tap eSIM install**, dApp Store build |
| **Launch** | SKR trip discounts, prepaid passes + staking opt-in, usage + expiry alerts |
| **Scale** | Partner embed SDK, Seeker Genesis perks, compressed NFT list |

---

## Target device: Solana Seeker

| Seeker feature | Solsim integration |
|---|---|
| **Seed Vault** | Primary signing path on production Seeker builds |
| **MWA** | Wallet sessions for Phantom (dev) and Seeker wallets |
| **eSIM slot** | Install travel profile via partner SDK or `EuiccManager` |
| **Seeker ID (.skr)** | Device attestation for Genesis Token perks (Phase 0.5) |
| **dApp Store** | Distribution channel; no OEM pre-install |

**Hardware constraint:** Seeker has **one active eSIM profile** on the eSIM slot. UX must support replace + top-up flows, not multi-profile switching.

**Complement positioning:** Helium Mobile on nano SIM (US daily driver) + Solsim on eSIM slot (travel abroad).

---

## Structure

```
app/
  App.tsx                 # SafeArea + WalletProvider + OwnershipProvider + tabs
  polyfill.js             # crypto/Buffer before @solana/web3.js
  src/
    config/               # APP_IDENTITY, QuickNode RPC pool
    wallet/               # MWA authorize / reauthorize / disconnect
    navigation/           # Market + Plans + My eSIMs + Wallet
    screens/              # Marketplace, Plans, SellLeftover, MyEsims, Wallet, …
    marketplace/          # listLeftover, buyListing, API client
    ownership/            # Encrypted vault + listed status
    purchase/             # Payment tx + mint request + mock provision
    data/mockPlans.ts     # Offline catalog (20 plans)
    components/
shared/types.ts           # EsimPlan / OwnedEsim / MarketplaceListing
```

### Planned additions (Phase 0.5+)

```
src/
  esim/                   # EuiccManager wrapper or partner SDK bridge
  api/                    # Typed client for Solsim REST API
  purchase/               # Payment tx builder + poll saga
  seeker/                 # Device verification, Genesis Token checks
  staking/                # Plan lock UI, SKR boost, rewards earned display
```

---

## Navigation

| Tab | Hackathon (shipped) | Production |
|---|---|---|
| **Market** *(first)* | Leftover listings; Demo / live buy from seller | Full secondary market + usage-backed remaining GB |
| **Plans** | Browse 20 plans → Buy with SOL (or Demo) → provision | Live catalog; country search |
| **My eSIMs** | Owned profiles → Reveal QR; **Sell leftover** | NFT-backed + install / live usage |
| **Wallet** | MWA connect; pubkey + SOL; QuickNode credit | + USDC; SKR stake status |

Future: **Settings** tab (notifications, language, support) in Phase 1.

**Prepaid / staking checkout (Phase 1):** on Quarter+ plans, show “Stake & Earn” toggle — lock term, bonus data estimate, optional SKR boost slider, explicit expiry + no-rollover disclaimer (Annual tier shows rollover rules).

---

## Purchase path (retail)

1. MWA `authorize` + sign payment (memo + SOL transfer on **devnet**); app submits via QuickNode RPC
2. Confirm payment via RPC
3. `POST /v1/mints` — API verifies payment and mints Metaplex NFT to the buyer
4. Mock-provision ICCID + `LPA:` QR (local vault; mint address from API; mock `dataRemainingMb`)
5. My eSIMs lists ownership; QR screen re-checks connected wallet == owner

## Marketplace path (differentiatior)

1. **Sell leftover** — Demo: soft `POST /listings` (`demo: true`). Live: deposit NFT to escrow (mint authority) then create listing
2. **Market** tab lists public cards (no QR / ICCID)
3. **Buy leftover** — Demo: soft claim. Live: buyer pays **seller** in SOL → `POST /listings/:id/purchase` → escrow `transferV1` → buyer vault + QR
4. Seller’s local record marked `listed`; buyer becomes `owner` for reveal

## Wallet flow

1. `transact` → `wallet.authorize({ chain, identity })`
2. Persist `auth_token` + pubkey (AsyncStorage)
3. On launch, reauthorize; clear on failure
4. Disconnect → `deauthorize` when possible

**Identity:**

```ts
{ name: 'Solsim', uri: 'https://solsim.so', icon: 'favicon.ico' }
```

**Cluster:**

| Build | Chain identifier |
|---|---|
| Hackathon | `solana:devnet` |
| Production | `solana:mainnet` |

On Seeker production builds, prefer **Seed Vault** as the default signer when available; fall back to MWA-compatible installed wallets.

---

## Purchase flow (target)

```
PlanDetail → confirm price
    → MWA sign USDC transfer to treasury
    → POST /purchases { planId, idempotencyKey, paymentSignature }
    → poll GET /purchases/:id (2–3s interval, ~90s max)
    → status active → navigate to My eSIMs
    → trigger eSIM install (SDK or system UI)
```

**Hackathon:** payment + API integration is stubbed; mock plans are local.

**Error states:** insufficient balance, payment not confirmed, provisioning failed (show retry + support), signature expired.

---

## eSIM install (Phase 0.5)

Priority order for provisioning delivery:

1. **Partner SDK** (1GLOBAL or eSIM Access) — one-tap install inside app
2. **Android EuiccManager** — programmatic download if LPA available
3. **Manual LPA / QR fallback** — show QR + copy activation code (owner-only, from API)

Never store LPA in app logs, analytics, or NFT metadata.

Post-install: show ICCID (truncated), data remaining, expiry; link to top-up when Phase 1.

---

## API client (Phase 0.5)

All authenticated requests include:

```
X-Wallet: <pubkey>
X-Signature: <sig of solsim-auth:...>
X-Timestamp: <unix>
```

Endpoints consumed by app: `GET /plans`, `POST /purchases`, `GET /purchases/:id`, `GET /esims`, `GET /esims/:mint/qr`.

Use `uuid` for `idempotencyKey` per purchase attempt.

---

## Seeker / dApp Store requirements

| Requirement | Implementation |
|---|---|
| MWA integration | `@solana-mobile/mobile-wallet-adapter-protocol-web3js` |
| App identity | Registered name + URI matching dApp Store listing |
| Permissions | `WRITE_EMBEDDED_SUBSCRIPTIONS` / eSIM-related Android perms per SDK docs |
| Privacy policy | URL in store listing; no PII on-chain |
| Device attestation | Wallet-sign flow for Genesis perks (match Helium pattern) |

Submission checklist: [Solana Mobile dApp Store docs](https://docs.solanamobile.com/).

---

## Security (client)

- Never request or persist seed phrases
- Use `FLAG_SECURE` on QR / LPA screens (production)
- Clear sensitive state on background where OS allows
- Validate API TLS; pin optional for production
- Truncate pubkeys in UI; no full LPA in screenshots path

---

## Run

See root [README.md](../README.md).

**Dev wallet:** [Phantom](https://play.google.com/store/apps/details?id=app.phantom) or [Mock MWA Wallet](https://github.com/solana-mobile/mock-mwa-wallet) on emulator/device.

**Seeker testing:** deploy release build to physical Seeker via dApp Store beta or sideload when available.

---

## Document history

| Version | Date | Changes |
|---|---|---|
| 1.0 | 2026-08-06 | Hackathon app structure |
| 2.0 | 2026-08-06 | Seeker-first direction, eSIM install path, purchase saga, dApp Store reqs |
