# Solsim — Product Requirements Document

**Version:** 3.0  
**Date:** August 6, 2026  
**Status:** Draft  
**Audience:** Engineering, Product, AI coding agents

**Related docs:** [BUSINESS.md](./BUSINESS.md) (strategy & GTM) · [APP.md](./APP.md) (mobile client)

---

## How to read this document

| Section | Purpose | Audience |
|---|---|---|
| **§A Product vision** | What we are building and why | Everyone |
| **§B Technical direction** | Phased architecture, integrations, evolution from MVP | Eng + agents |
| **§C Hackathon MVP** | Tonight’s scoped build — hard constraints | Agent + solo eng |

**Agents:** For hackathon work, treat **§C invariants and guardrails as law**. Do not expand scope into §B Phase 1+ unless explicitly asked.

---

# §A — Product vision

## A.1 Summary

Solsim is a **Seeker-native DeFi eSIM platform**. Users browse travel data plans, pay with **USDC/SKR** via Mobile Wallet Adapter, receive real or mock eSIM profiles, and **own plan entitlements on-chain** (NFT model).

**Near-term wedge:** Crypto-native Seeker owners who want instant eSIM activation in 190+ countries without card friction.

**Long-term:** Embeddable connectivity API for wallets, travel apps, and Web3 protocols — “Stripe for data” on Solana.

Full business strategy: [BUSINESS.md](./BUSINESS.md).

## A.2 Problem

1. **Payment friction** — card declines, FX, geo-blocked app stores at the airport
2. **Fragmented accounts** — new provider app and email every trip
3. **No portability** — unused data expires; plans cannot transfer
4. **Partner gap** — wallets and travel apps lack telecom infrastructure to embed connectivity

## A.3 Personas (priority order)

| Persona | Phase | Success criteria |
|---|---|---|
| **Seeker traveler** | 0 | Pay USDC → one-tap install → connected in <5 min |
| **Wallet user (partner-acquired)** | 1 | Buy plan inside Phantom/Backpack without leaving app |
| **B2B integrator** | 1 | REST API live in <4 weeks; rev share on autopilot |
| **DAO / event organizer** | 2 | Treasury buys bulk credits; attendees claim via wallet |

## A.4 Product pillars

```
┌─────────────────────────────────────────────────────────────┐
│                      SOLSIM PLATFORM                        │
├──────────────┬──────────────┬──────────────┬────────────────┤
│ Seeker App   │ Partner API  │ DeFi Rails   │ eSIM Orchestr. │
├──────────────┼──────────────┼──────────────┼────────────────┤
│ Browse/ buy  │ White-label  │ USDC / SKR   │ SM-DP+ via     │
│ One-tap      │ checkout     │ NFT ownship  │ wholesale API  │
│ install      │ Webhooks     │ Refunds      │ Multi-MNO route│
└──────────────┴──────────────┴──────────────┴────────────────┘
```

## A.5 Roadmap phases

| Phase | Timeline | Deliverables |
|---|---|---|
| **0 — Hackathon MVP** | Now | Devnet purchase → mock eSIM → NFT → owner-only QR |
| **0.5 — Seeker alpha** | +4–8 wks | Mainnet USDC, 1 wholesale provider, in-app install SDK, dApp Store |
| **1 — Launch** | +3–6 mo | 100 countries, prepaid passes (3/6/12 mo), staking rewards beta, partner API |
| **2 — Scale** | +6–12 mo | Partner SDK GA, 8 integrations, fiat on-ramp, compressed NFTs |
| **3 — Platform** | +12–24 mo | Subscription SFTs, DePIN routing, enterprise M2M |

## A.6 Functional requirements (product-level)

### Consumer (P0 → P2)

| ID | Requirement | Phase |
|---|---|---|
| F-001 | Browse plans by country with $/GB transparency | 0.5 |
| F-002 | MWA wallet connect + signed-message auth | 0 |
| F-003 | Pay USDC on Solana mainnet | 0.5 |
| F-004 | eSIM install via Android eSIM API / partner SDK | 0.5 |
| F-005 | Order history linked to wallet | 0 |
| F-006 | Usage remaining + expiry | 1 |
| F-007 | Top-up existing ICCID | 1 |
| F-008 | SKR trip discount (non-staked SKUs) | 2 |
| F-009 | Seeker Genesis Token perks | 0.5 |
| F-010 | Fiat on-ramp fallback | 2 |
| F-011 | Prepaid passes: 3 / 6 / 12 month pooled GB SKUs | 1 |
| F-012 | eSIM Staking Rewards: lock plan SFT + optional SKR boost | 1 |
| F-013 | Utilization + expiry alerts (data remaining, days left) | 1 |
| F-014 | Breakage-aware finance tagging at ICCID expiry | 1 |

### Partner API (P1)

| ID | Requirement | Phase |
|---|---|---|
| P-001 | REST: catalog, quote, order, provision, usage | 1 |
| P-002 | Signed webhooks + idempotency | 1 |
| P-003 | Sandbox mirroring production catalog | 1 |
| P-004 | Partner dashboard (GMV, rev share) | 2 |

### Admin & ops (P0)

| ID | Requirement | Phase |
|---|---|---|
| A-001 | Order mgmt + manual refund | 0.5 |
| A-002 | MNO routing config per country | 1 |
| A-003 | KYC tier enforcement | 0.5 |
| A-004 | OFAC wallet screening | 0.5 |
| A-005 | Staking rewards pool ledger + quarterly cap enforcement | 1 |
| A-006 | Breakage / utilization reporting by SKU | 1 |

## A.7 Non-functional requirements

| Category | Target |
|---|---|
| API availability | 99.9% |
| Provisioning latency | P95 < 60s post-payment |
| Security | No private keys on server; QR encrypted at rest |
| Privacy | GDPR-aligned; minimize PII on-chain |
| Seeker install success | ≥95% one-tap on supported routes |

---

# §B — Technical direction

## B.1 Architecture evolution

### Phase 0 (hackathon — current repo)

```
React Native (Android) ──HTTPS──► Express API ──► MockProvider
       │                               │
       MWA / Phantom                   ├── PostgreSQL
       │                               └── Solana devnet (Metaplex NFT)
```

### Phase 0.5 (Seeker alpha)

```
Seeker App (RN + eSIM SDK) ──► Solsim API ──► EsimProvider adapter
       │                            │              ├── 1GLOBAL / eSIM Access
       Seed Vault / MWA             │              └── SM-DP+ provision
       Android EuiccManager         ├── PostgreSQL
                                    ├── Payment listener (Solana mainnet)
                                    └── Metaplex / cNFT mint
```

### Phase 1+ (platform)

Add: partner API gateway, webhook dispatcher, treasury multisig, KYC service, usage polling from wholesale provider, **plan stake program (locked SFT)**, **rewards pool accrual**, rate limits, observability (order → payment → provision trace).

## B.2 Wholesale provider integration

**Interface** (extends hackathon `EsimProvider`):

```ts
interface EsimProvider {
  listPlans(): Promise<EsimPlan[]>;
  orderEsim(
    planId: string,
    idempotencyKey: string,
  ): Promise<{
    iccid: string;
    qrPayload: string; // LPA:1$...
    activationCode?: string;
    validUntil: string;
  }>;
  getUsage?(iccid: string): Promise<{ dataMbRemaining: number; expiresAt: string }>;
  topUp?(iccid: string, planId: string, idempotencyKey: string): Promise<void>;
}
```

**Adapter priority:** `MockProvider` (Phase 0) → `EsimAccessProvider` or `OneGlobalProvider` (Phase 0.5) → multi-provider router (Phase 1).

**Selection criteria for POC:** in-app Android install SDK, P95 provision time, wholesale $/GB, Seeker hardware compatibility. See [BUSINESS.md §4](./BUSINESS.md#4-wholesale-esim-supply).

## B.3 Seeker mobile stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | React Native + TypeScript | Already in `/app` |
| Wallet | `@solana-mobile/mobile-wallet-adapter-protocol-web3js` | Seed Vault on Seeker |
| eSIM install | Partner SDK (1GLOBAL / eSIM Access) or `EuiccManager` | Prefer SDK; fallback QR |
| Chain | Solana mainnet (devnet for hackathon) | USDC SPL; SKR when live |
| NFT | Metaplex (Phase 0) → compressed NFT (Phase 2) | Ownership gates QR access |
| Distribution | Solana dApp Store | See [APP.md](./APP.md) |

## B.4 Payment flow (production)

1. Client requests quote → server locks price (15 min)
2. Client signs USDC transfer to treasury via MWA
3. Server verifies tx on-chain (confirmed, amount, recipient, sender)
4. Idempotent `POST /purchases` → async provision → encrypt LPA → mint NFT
5. Client polls or receives push → triggers in-app eSIM install
6. On failure after payment: auto USDC refund + `failed` status

## B.5 Security invariants (all phases)

1. **API never holds user private keys** — signing via MWA only
2. **QR/LPA never stored plaintext** — AES-256-GCM at rest; never in logs or NFT metadata
3. **On-chain ownership authoritative** for QR access — re-read owner before decrypt; RPC fail → 503
4. **Purchases idempotent** on `idempotency_key`
5. **Parameterized SQL only**; money as integer lamports
6. **Secrets from env only**; OFAC screen on mainnet

## B.6 Repo layout (target)

```
solsim/
  app/           # React Native Seeker client
  api/           # Express API (Phase 0 hackathon)
  shared/        # Shared TypeScript types
  docs/
    BUSINESS.md  # Strategy & GTM
    PRD.md       # This file
    APP.md       # Mobile client spec
```

## B.7 Technology choices

| Layer | Phase 0 (hackathon) | Phase 0.5+ |
|---|---|---|
| Mobile | RN + MWA | + eSIM partner SDK |
| API | Express + TS + zod | + rate limit, webhooks |
| DB | PostgreSQL + pg | Same |
| Chain | Solana devnet | Solana mainnet |
| NFT | `@metaplex-foundation/js` | cNFT at scale |
| Provider | MockProvider | 1GLOBAL / eSIM Access |

## B.8 Open technical decisions

| # | Question | Default if no decision |
|---|---|---|
| 1 | NFT vs. SFT for plan entitlement | NFT (Phase 0–1) |
| 2 | Single provider vs. router | Single for alpha; router Phase 1 |
| 3 | Inline async provision vs. job queue | Inline for MVP; queue Phase 1 |
| 4 | Indexer vs. direct RPC for payment verify | Direct RPC (MVP) |

---

# §C — Hackathon MVP (scoped build)

> **Goal tonight:** Wallet connects → browse mock plan → “buy” on **devnet** → see eSIM NFT → show mock QR.  
> Real eSIM Access, mainnet, and Seeker SDK are **out of scope tonight**.

## C.1 System overview

```
┌─────────────────────────────────────────┐
│  React Native app (Android)             │
│  - Mobile Wallet Adapter → Phantom      │
│  - Signs txns, never holds keys         │
└───────────────┬─────────────────────────┘
                │ HTTPS + signed-message auth
┌───────────────▼─────────────────────────┐
│  Express API (Node 18, TypeScript)      │
│  - Mock catalog + purchase              │
│  - Encrypts mock QR at rest             │
│  - Mints NFT on Solana devnet           │
└──────┬──────────────────┬───────────────┘
       │                  │
┌──────▼────────┐  ┌──────▼───────────────┐
│ MockProvider  │  │ Solana devnet        │
│ (in-process)  │  │ - Metaplex NFT       │
└───────────────┘  └──────────────────────┘
                            │
                   ┌────────▼─────────┐
                   │ PostgreSQL       │
                   │ (purchases + QR) │
                   └──────────────────┘
```

**Trust model:** Chain ownership is authoritative for QR access. DB indexes purchases and holds encrypted mock QR. No real money, no real eSIM inventory tonight.

## C.2 Locked technology choices (hackathon)

Do not substitute. Do not add.

| Layer | Choice |
|---|---|
| Mobile | React Native + TypeScript |
| Navigation | `@react-navigation/native` + bottom-tabs |
| Wallet | `@solana-mobile/mobile-wallet-adapter-protocol-web3js` |
| Chain SDK | `@solana/web3.js` |
| NFT | `@metaplex-foundation/js` (or umi equivalent) |
| API | Express + TypeScript |
| DB | PostgreSQL + `pg` (parameterized only) |
| Cluster | **devnet only** |
| Validation | `zod` |

**Explicitly out of scope tonight:** Anchor, marketplace, top-up, real eSIM provider, mainnet, iOS, ORMs, GraphQL, IPFS, Firebase, tokens.

## C.3 Invariants

1. API never holds, requests, logs, or transmits user private keys
2. QR payload never stored plaintext, never logged, never returned except to verified on-chain owner
3. On-chain ownership authoritative for QR access
4. Purchases idempotent on `idempotency_key`
5. All SQL parameterized
6. Money values are integers (lamports)
7. Secrets only from `process.env`

## C.4 Domain model

```ts
type CountryCode = 'TH' | 'JP';

type EsimStatus = 'provisioning' | 'active' | 'failed';

interface EsimPlan {
  planId: string;
  country: CountryCode;
  dataMb: number;
  validityDays: number;
  priceLamports: string;
  providerId: 'mock';
}

interface EsimNft {
  mint: string;
  owner: string;
  country: CountryCode;
  dataMb: number;
  validUntil: string;
  status: EsimStatus;
  iccid: string;
}
```

## C.5 API contract

Base: `http://localhost:3000/v1`. JSON only.

### Auth

```
X-Wallet: <base58 pubkey>
X-Signature: <base58 sig>
X-Timestamp: <unix seconds>
```

Message: `solsim-auth:<pubkey>:<unix_timestamp>` (no trailing newline). Reject if `|now - timestamp| > 300`.

### Endpoints

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/health` | no | Liveness |
| GET | `/plans` | no | Mock catalog |
| POST | `/purchases` | yes | Buy eSIM (async) |
| GET | `/purchases/:id` | yes | Poll status |
| GET | `/esims` | yes | Caller's eSIMs |
| GET | `/esims/:mint/qr` | yes | Decrypted QR (owner only) |

### `POST /purchases`

```jsonc
{ "planId": "mock_th_5gb_30d", "idempotencyKey": "uuid-v4", "paymentSignature": "base58" }
// 202 → { "purchaseId": "uuid", "status": "provisioning" }
```

Server: idempotency → verify devnet payment → persist → async MockProvider → encrypt QR → mint NFT → `active`.

### `GET /esims/:mint/qr`

Fetch mint owner from chain → `owner === X-Wallet` else 403 → decrypt. RPC fail → 503.

## C.6 Mock provider

```ts
class MockProvider implements EsimProvider {
  // 2 static plans; orderEsim returns LPA:1$mock... and fake ICCID
}
```

`PROVIDER_MODE=mock` only.

## C.7 Encryption

- AES-256-GCM; key = `QR_ENCRYPTION_KEY` (32 bytes base64)
- Decrypt only in owner-verified QR handler
- Redact logs matching `/LPA:1\$/` or sensitive key names

## C.8 Evening task graph

| ID | Task | Done when |
|---|---|---|
| 1 | Monorepo scaffold | typecheck passes |
| 2 | Postgres + `/health` | migrate + 200 |
| 3 | Auth middleware | sig tests pass |
| 4 | MockProvider + `GET /plans` | 2 plans |
| 5 | RN: tabs + MWA | Phantom connects |
| 6 | Browse plans UI | list + detail |
| 7 | Encrypt/decrypt helpers | round-trip test |
| 8 | Payment + mint + purchase | happy path E2E |
| 9 | Purchase UI + poll | user can buy |
| 10 | My eSIMs + QR | owner sees QR |

**Do not start:** marketplace, top-up, Anchor, real provider, mainnet.

## C.9 Database schema

```sql
CREATE TABLE users (
  wallet     VARCHAR(44) PRIMARY KEY,
  first_seen TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE purchases (
  id                UUID PRIMARY KEY,
  idempotency_key   UUID UNIQUE NOT NULL,
  wallet            VARCHAR(44) NOT NULL REFERENCES users(wallet),
  plan_id           TEXT NOT NULL,
  price_lamports    BIGINT NOT NULL,
  payment_signature VARCHAR(88) UNIQUE NOT NULL,
  status            TEXT NOT NULL,
  nft_mint          VARCHAR(44) UNIQUE,
  iccid             VARCHAR(22),
  last_error        TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE esim_secrets (
  nft_mint    VARCHAR(44) PRIMARY KEY,
  iccid       VARCHAR(22) NOT NULL,
  ciphertext  BYTEA NOT NULL,
  iv          BYTEA NOT NULL,
  auth_tag    BYTEA NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## C.10 Environment

```bash
NODE_ENV=development
DATABASE_URL=
SOLANA_RPC_URL=
SOLANA_CLUSTER=devnet
TREASURY_PUBKEY=
MINT_AUTHORITY_SECRET=
QR_ENCRYPTION_KEY=
PROVIDER_MODE=mock
```

## C.11 Guardrails — never do these

1. Never store/log/transmit private keys
2. Never return QR without fresh on-chain owner check
3. Never interpolate SQL strings
4. Never use floats for money
5. Never add marketplace, top-up, tokens, or real provider tonight
6. Never target mainnet
7. Never commit `.env` or keypairs
8. Never claim mock QR is real installable eSIM — say “mock profile; same ownership model”

## C.12 Definition of done (hackathon)

1. Connect Phantom
2. Browse at least one plan
3. Pay on devnet and complete purchase
4. See eSIM under My eSIMs (NFT mint visible)
5. Open mock QR as owner

---

## Document history

| Version | Date | Changes |
|---|---|---|
| 2.0 | 2026-08-06 | Hackathon scope |
| 3.0 | 2026-08-06 | Added product vision (§A), technical direction (§B), Seeker integration path; preserved hackathon as §C |
| 3.1 | 2026-08-06 | Prepaid passes + eSIM staking rewards; breakage tracking requirements |
| 3.2 | 2026-08-06 | Gap vs shipped hackathon backlog (§14) |

---

## 14. Gap vs original 5-week PRD (living backlog)

### Shipped (hackathon-shaped)

- MWA connect / reauth / disconnect + **EncryptedStorage** (auth + owned vault, AsyncStorage migrate)
- Browse plans + plan detail with **total breakdown before sign**
- Catalog from **`GET /v1/plans`** when API is up; offline mock fallback
- Devnet purchase (memo + SOL transfer) + mock provision + local ownership vault
- **`POST /v1/mints`** — Metaplex Token Metadata NFT to buyer after payment verify
- My eSIMs + owner-gated QR reveal
- **`FLAG_SECURE`** on QR screen (Android native module)
- **Install guide** screen (Android steps)
- **Solscan** links (payment tx, NFT mint, wallet address)
- **Share** address / LPA string
- Wallet **balance refresh on focus**
- Minimal **`/api`**: health, plans, mint, MockProvider, log redactor, AES-256-GCM helpers
- Flat polished UI (DM Sans)

### Next lowest-hanging (still high demo value)

| Fruit | Why | Effort |
| --- | --- | --- |
| Postgres + migrate runner | Original §1.2 / purchase table | Medium |
| Signed-message auth middleware | Original §5.1 | Medium |
| Collection NFT / verified creator | Filter wallet NFTs | Medium |
| `GET /esims/:mint/qr` with chain owner check | Wire existing `decryptQrPayload` | Medium |

### Explicitly deferred (original phases 3–4)

Marketplace / Auction House, Anchor escrow, real eSIM Access, mainnet, top-up, Postgres purchase saga, rate limits, country expansion beyond demo catalog.
