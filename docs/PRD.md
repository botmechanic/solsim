# Solsim — Evening Hackathon PRD

**Version:** 2.0 (hackathon) **Audience:** AI coding agent + solo engineer **Target:** Demoable vertical slice in one evening (~4–6 hours) **Repo layout:** monorepo — `/app` (React Native), `/api` (Node/Express)

---

## 0. How to use this document

**Goal tonight:** Wallet connects → browse a mock plan → “buy” on **devnet** → see an eSIM NFT → show a mock QR. That is the whole product for the demo.

**For the agent:**

- Treat §3 (Invariants) and §10 (Guardrails) as hard constraints.
- Build only §8 tasks, in order. Do not start marketplace, top-up, Anchor, or a real provider.
- When ambiguous, STOP and ask. Prefer the happy path + one obvious failure state over exhaustive edge cases.
- Do not add dependencies not listed in §2 without asking.

**For the human:**

- Demo on **devnet** with MockProvider. Real eSIM Access and mainnet are out of scope tonight.
- If time runs short, cut in this order: polish → QR screen polish → Metaplex mint (show DB-backed eSIM instead) → auth hardening. Never cut the browse → purchase → “I own this” loop.

---

## 1. System overview

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

**Trust model:** Chain ownership is authoritative for QR access. DB indexes purchases and holds the encrypted mock QR. No real money, no real eSIM inventory tonight.

---

## 2. Locked technology choices

Do not substitute. Do not add.

| Layer      | Choice                                                 |
| ---------- | ------------------------------------------------------ |
| Mobile     | React Native + TypeScript                              |
| Navigation | `@react-navigation/native` + bottom-tabs               |
| Wallet     | `@solana-mobile/mobile-wallet-adapter-protocol-web3js` |
| Chain SDK  | `@solana/web3.js`                                      |
| NFT        | `@metaplex-foundation/js` (or umi equivalent)          |
| API        | Express + TypeScript                                   |
| DB         | PostgreSQL + `pg` (parameterized only)                 |
| Cluster    | **devnet only**                                        |
| Validation | `zod`                                                  |

**Explicitly out of scope tonight:** Anchor programs, marketplace, top-up, real eSIM provider, mainnet, iOS, ORMs, GraphQL, IPFS, Firebase, any token/coin.

---

## 3. Invariants

1. **The API never holds, requests, logs, or transmits a user private key or seed phrase.** Signing only via MWA / wallet.
2. **QR payload is never stored in plaintext**, never logged, never returned except `GET /esims/:mint/qr` to the verified on-chain owner.
3. **On-chain ownership is authoritative** for QR access. Re-read owner from chain before returning QR. On RPC failure → 503, not DB fallback.
4. **Purchases are idempotent** on `idempotency_key`.
5. **All SQL is parameterized.**
6. **Money values are integers** (lamports as `bigint` / string on the wire). No floats.
7. **Secrets only from** `process.env`.

---

## 4. Domain model (minimal)

```ts
type CountryCode = 'TH' | 'JP'; // two countries is enough for demo

type EsimStatus = 'provisioning' | 'active' | 'failed';

interface EsimPlan {
  planId: string;
  country: CountryCode;
  dataMb: number;
  validityDays: number;
  priceLamports: string; // fixed demo price on devnet
  providerId: 'mock';
}

interface EsimNft {
  mint: string;
  owner: string; // from chain
  country: CountryCode;
  dataMb: number;
  validUntil: string;
  status: EsimStatus;
  iccid: string; // mock id, not secret
}
```

One or two hard-coded plans in MockProvider is enough. No marketplace listing type.

---

## 5. API contract

Base: `http://localhost:3000/v1` for the hackathon. JSON only.

### 5.1 Auth

```
X-Wallet: <base58 pubkey>
X-Signature: <base58 sig of message below>
X-Timestamp: <unix seconds>
```

Signed message (exact, no trailing newline):

```
solsim-auth:<pubkey>:<unix_timestamp>
```

Verify with `nacl.sign.detached.verify`. Reject if `|now - timestamp| > 300`.

### 5.2 Endpoints (only these)

| Method | Path                | Auth | Purpose                   |
| ------ | ------------------- | ---- | ------------------------- |
| GET    | `/health`           | no   | Liveness                  |
| GET    | `/plans`            | no   | Mock catalog              |
| POST   | `/purchases`        | yes  | Buy eSIM (async)          |
| GET    | `/purchases/:id`    | yes  | Poll status               |
| GET    | `/esims`            | yes  | Caller's eSIMs            |
| GET    | `/esims/:mint/qr`   | yes  | Decrypted QR (owner only) |

### 5.3 `POST /purchases`

```jsonc
// request
{
  "planId": "mock_th_5gb_30d",
  "idempotencyKey": "uuid-v4",
  "paymentSignature": "base58 txn sig" // SOL sent to treasury on devnet
}
// 202
{ "purchaseId": "uuid", "status": "provisioning" }
```

Server order:

1. Idempotency lookup → return existing if found.
2. Verify payment on **devnet**: confirmed, ≥ plan lamports, to treasury, from `X-Wallet`.
3. Persist purchase as `provisioning`, return 202, finish async: MockProvider → encrypt QR → mint NFT → `active`.

Client polls every 2–3s for up to ~90s, then shows “still working / check My eSIMs.”

### 5.4 `GET /esims/:mint/qr`

1. Fetch mint owner from chain. 2. `owner === X-Wallet` else 403. 3. Decrypt and return. RPC fail → 503.

```jsonc
{ "mint": "...", "qrPayload": "LPA:1$mock.solsim.so$DEMO123", "iccid": "8900..." }
```

### 5.5 Errors

```jsonc
{ "error": { "code": "NOT_OWNER", "message": "Human readable.", "retriable": false } }
```

Keep codes small: `UNAUTHORIZED`, `SIGNATURE_INVALID`, `SIGNATURE_EXPIRED`, `NOT_OWNER`, `INSUFFICIENT_PAYMENT`, `PAYMENT_NOT_CONFIRMED`, `PROVISIONING_FAILED`, `INTERNAL`. Never put QR / secrets / stack traces in messages.

---

## 6. Mock provider

```ts
interface EsimProvider {
  listPlans(): Promise<EsimPlan[]>;
  orderEsim(
    planId: string,
    idemKey: string,
  ): Promise<{ iccid: string; qrPayload: string; validUntil: string }>;
}

class MockProvider implements EsimProvider {
  // 2 static plans; orderEsim returns LPA:1$mock... and a fake ICCID
}
```

No live provider adapter tonight. `PROVIDER_MODE=mock` only.

---

## 7. Secrets and encryption

- QR at rest: AES-256-GCM. Key = `QR_ENCRYPTION_KEY` (32 bytes base64). Store `iv`, `authTag`, `ciphertext`.
- Decrypt only in `decryptQrPayload()`, called only from `GET /esims/:mint/qr`.
- Redact log values matching `/LPA:1\$/` or keys named `qr`, `qrPayload`, `secret`, `key`.

---

## 8. Evening task graph

Build in order. Stop when the demo loop works; polish only if time remains.

| ID  | Task                                      | Depends | Done when                                              |
| --- | ----------------------------------------- | ------- | ------------------------------------------------------ |
| 1   | Monorepo scaffold (`/app`, `/api`, shared types) | —    | `typecheck` passes                                     |
| 2   | Postgres tables + Express `/health`       | 1       | migrate + health 200                                   |
| 3   | Auth middleware                           | 2       | valid/expired/bad sig covered                          |
| 4   | MockProvider + `GET /plans`               | 2       | 2 plans returned                                       |
| 5   | RN app: tabs + brand + MWA connect        | 1       | Phantom connects on device (or emulator if needed)     |
| 6   | Browse plans UI                           | 4, 5    | list + detail render                                   |
| 7   | Encrypt/decrypt QR helpers                | 2       | round-trip test                                        |
| 8   | Payment verify + mint + purchase handler  | 3, 4, 7 | one happy-path purchase on devnet end-to-end           |
| 9   | Purchase UI + poll screen                 | 6, 8    | user can buy from the app                              |
| 10  | My eSIMs + QR screen                      | 8, 9    | owner sees QR; non-owner would 403                     |

**Optional if time left:** nicer empty/error states, truncated pubkey + SOL balance, `FLAG_SECURE` on QR screen, README demo script.

**Do not start:** marketplace, listings table usage, top-up, Anchor, real provider, mainnet, rate limits, admin tools.

---

## 9. Simplified purchase flow

Happy path only for the demo (still persist state so retries don’t double-order):

```
payment_verified → provisioned (MockProvider) → secret_stored → minted → complete
```

On any hard failure after payment: mark `failed`, show a clear error in the app. No automated refund tonight — note it verbally in the demo (“devnet SOL; we’d refund in prod”).

Idempotency on `idempotency_key` is required. A full retry worker is nice-to-have; an inline async continuation after `POST /purchases` is enough for the evening.

---

## 10. Guardrails — never do these

1. Never store/log/transmit private keys or seed phrases.
2. Never return QR without a fresh on-chain owner check.
3. Never interpolate SQL strings.
4. Never use floats for money.
5. Never add marketplace, top-up, tokens, or a real provider tonight.
6. Never target mainnet.
7. Never commit `.env`, keypairs, or credentials.
8. Never claim the mock QR is a real installable eSIM in the pitch — say “mock profile; same ownership model.”

---

## 11. Database schema

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
  status            TEXT NOT NULL, -- provisioning | active | failed
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

### NFT metadata

```jsonc
{
  "name": "Solsim TH 5GB",
  "symbol": "SOLSIM",
  "description": "Hackathon demo eSIM plan for Thailand.",
  "image": "https://solsim.so/nft/th-5gb.png",
  "attributes": [
    { "trait_type": "Country", "value": "Thailand" },
    { "trait_type": "Data", "value": "5120 MB" },
    { "trait_type": "Provider", "value": "Mock" },
  ],
}
```

QR payload must never appear in metadata.

---

## 12. Environment

```bash
NODE_ENV=development
DATABASE_URL=
SOLANA_RPC_URL=            # devnet RPC
SOLANA_CLUSTER=devnet
TREASURY_PUBKEY=
MINT_AUTHORITY_SECRET=     # mint authority only; no user funds
QR_ENCRYPTION_KEY=         # base64, 32 bytes
PROVIDER_MODE=mock
```

A fresh clone with `PROVIDER_MODE=mock` should run without eSIM vendor credentials.

---

## 13. Definition of done (tonight)

The evening is done when you can demo, without apology:

1. Connect Phantom.
2. Browse at least one plan.
3. Pay on **devnet** and complete a purchase.
4. See the eSIM under My eSIMs (NFT mint visible).
5. Open the mock QR as the owner.

Ship that loop. Everything else is bonus.

---

## 14. Gap vs original 5-week PRD (living backlog)

### Shipped (hackathon-shaped)

- MWA connect / reauth / disconnect + **EncryptedStorage** (auth + owned vault, AsyncStorage migrate)
- Browse plans + plan detail with **total breakdown before sign**
- Catalog from **`GET /v1/plans`** when API is up; offline mock fallback
- Devnet purchase (memo + SOL transfer) + mock provision + local ownership vault
- My eSIMs + owner-gated QR reveal
- **`FLAG_SECURE`** on QR screen (Android native module)
- **Install guide** screen (Android steps)
- **Solscan** links (payment tx, wallet address)
- **Share** address / LPA string
- Wallet **balance refresh on focus**
- Minimal **`/api`**: health, plans, MockProvider, log redactor, AES-256-GCM helpers

### Next lowest-hanging (still high demo value)

| Fruit | Why | Effort |
| --- | --- | --- |
| Postgres + migrate runner | Original §1.2 / purchase table | Medium |
| Signed-message auth middleware | Original §5.1 | Medium |
| Metaplex mint on devnet | Phantom-visible NFT | Medium–large |
| `GET /esims/:mint/qr` with chain owner check | Wire existing `decryptQrPayload` | Medium |

### Explicitly deferred (original phases 3–4)

Marketplace / Auction House, Anchor escrow, real eSIM Access, mainnet, top-up, Postgres purchase saga, rate limits, country expansion beyond demo catalog.
