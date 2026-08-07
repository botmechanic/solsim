# Solsim — Business & Marketing Implementation Plan

**Version:** 1.0  
**Date:** August 6, 2026  
**Status:** Active  
**Audience:** Product, Marketing, Partnerships, Engineering  
**Related:** [BUSINESS.md](./BUSINESS.md) · [PRD.md](./PRD.md) · [APP.md](./APP.md)

---

## 1. Purpose

This document turns [BUSINESS.md](./BUSINESS.md) strategy into an **executable plan** tied to app milestones. Each workstream has owners, deliverables, dependencies, and success criteria mapped to product phases.

**Implementation horizon:** 24 months (Hackathon → Seeker alpha → Launch → Scale)

---

## 2. Phase overview

| Phase | Timeline | Business goal | Marketing goal | App gate |
|---|---|---|---|---|
| **0 — Hackathon** | Week 0 | Prove ownership model story | Demo narrative for judges / CT | Devnet purchase + NFT + QR |
| **0.5 — Seeker alpha** | Wks 1–8 | Sign wholesale; dApp Store live | Seeker launch PR; first 500 MAE | Mainnet USDC + in-app install |
| **1 — Launch** | Mo 3–6 | Prepaid passes + staking beta | Nomad SEO; 1 wallet partner | 3/6/12 mo SKUs + Stake & Earn |
| **2 — Scale** | Mo 6–12 | 8 partners; 40% partner GMV | Conference + referral flywheel | Partner API; SKR boost live |
| **3 — Platform** | Mo 12–24 | DePIN pilot; enterprise M2M | Category leadership on Seeker | Subscription SFTs; fiat on-ramp |

---

## 3. Workstreams

### WS-A — Brand & positioning

| ID | Deliverable | Phase | Owner | Due |
|---|---|---|---|---|
| A-1 | Lock name **Solsim** + tagline (“Travel data for Seeker”) | 0 | Marketing | Wk 0 |
| A-2 | Brand kit: logo, colors, app store assets, NFT art template | 0.5 | Design | Wk 2 |
| A-3 | Messaging doc: 4 pillars (Speed, Ownership, Native, Earn) | 0.5 | Marketing | Wk 2 |
| A-4 | Competitive battlecard vs. Unbound | 0.5 | Marketing | Wk 3 |
| A-5 | “Stake & Earn” one-pager for checkout + FAQ | 1 | Product + Marketing | Mo 4 |
| A-6 | Partner co-brand guidelines (L1–L4 white-label) | 2 | Marketing | Mo 8 |

**Success:** Consistent copy across app, dApp Store listing, and landing page; NPS survey mentions “Seeker-native” unprompted ≥20% of respondents (Phase 1).

---

### WS-B — Go-to-market & channels

#### B.1 Phase 0 — Hackathon (immediate)

| Task | Action | Output |
|---|---|---|
| Demo script | 60s flow: connect → buy → NFT → QR | `docs/demo-script.md` or README section |
| Social teaser | Thread: “eSIM you own on-chain” + demo clip | Farcaster + X post |
| Repo public | Docs + app scaffold on GitHub | This repo |

#### B.2 Phase 0.5 — Seeker alpha (Wks 1–8)

| Week | Channel | Campaign | KPI |
|---|---|---|---|
| 1–2 | Solana Mobile | dApp Store submission + listing copy | Approved listing |
| 2–3 | Crypto Twitter / Farcaster | “First Seeker eSIM with on-chain ownership” | 50k impressions |
| 3–4 | Seeker Discord / forums | Beta invite codes (100 devices) | 100 installs |
| 4–6 | Nomad SEO | Landing pages: US→EU, US→JP, “eSIM USDC Seeker” | 5 indexed pages |
| 6–8 | Solana Mobile co-marketing | Apply for featured placement / Season quest | 1 co-marketing slot |

**Closed beta criteria:** 500 wallet connects, 200 paid activations, P95 install <60s.

#### B.3 Phase 1 — Launch (Mo 3–6)

| Initiative | Description | Target |
|---|---|---|
| **Corridor blitz** | Paid + organic for US→EU, US→JP/KR, US→LATAM | 5K MAE |
| **Genesis bundle** | Seeker Genesis Token: +20% bonus data first purchase | 30% attach on eligible devices |
| **Referral v1** | Wallet-native invite link; both sides get data credit | 15% of new users referred |
| **Conference kit** | Breakpoint / Solana event plans + QR redeem | 500 event activations |
| **Staking launch** | “Stake your pass, earn bonus data + SKR” campaign | 30% opt-in on Quarter+ SKUs |

#### B.4 Phase 2 — Scale (Mo 6–12)

| Initiative | Description | Target |
|---|---|---|
| Partner embed GTM | 1 flagship wallet live with in-app tab | 25% GMV partner-attributed |
| SEO scale | 50 country landing pages | 20% organic checkout |
| Ambassador program | 20 crypto nomad creators | 10K MAE from creator codes |
| Breakage transparency blog | “How prepaid data works” — trust play | Reduce support tickets on expiry 20% |

---

### WS-C — Product marketing (in-app)

Maps directly to app screens and release trains.

| App surface | Phase | Marketing / business requirement |
|---|---|---|
| **Onboarding** | 0.5 | Value prop carousel: pay USDC, one-tap install, own on-chain |
| **Plans browse** | 0.5 | Country flags + $/GB transparency; “Popular on Seeker” badges |
| **Plan detail** | 1 | Trip vs. Pass tabs; staking CTA on Quarter+ |
| **Checkout** | 0.5 → 1 | USDC default; SKR option Phase 1; “Stake & Earn” toggle + terms |
| **Post-purchase** | 0.5 | Share card: “I just bought data on-chain” (optional, no QR leak) |
| **My eSIMs** | 1 | Usage bar + expiry countdown; push opt-in for alerts |
| **Staking dashboard** | 1 | Rewards earned, lock end date, SKR boost status |
| **Wallet tab** | 1 | SKR balance + link to stake boost |
| **Empty states** | 0.5 | Corridor suggestions based on locale |

**In-app copy principles:**

- Lead with **time-to-connect** (“Connected in 60 seconds”)
- Always show **expiry + GB remaining** (breakage transparency)
- Staking = **bonus data + perks**, not investment language

---

### WS-D — Partnerships

| Priority | Partner type | Target | Phase | Integration |
|---|---|---|---|---|
| P0 | Solana Mobile | Co-marketing + dApp Store | 0.5 | Listing, quests |
| P0 | Wholesale eSIM | 1GLOBAL or eSIM Access signed | 0.5 | API + SDK |
| P1 | Wallet (Phantom / Backpack) | 1 embed pilot | 1 | L2 embedded checkout |
| P1 | Nomad community | Nomad List / remote work newsletter | 1 | L1 referral |
| P2 | Exchange / CEX wallet | OKX or similar | 2 | L2 embed |
| P2 | Event DAO | Breakpoint, Solana IRL | 1–2 | Bulk treasury SKUs |
| P3 | Neobank / remittance | 1 design partner | 2 | L3 co-brand |

**Partner launch playbook (each integration):**

1. Sandbox API key + 10 test eSIMs  
2. Joint press line + asset swap  
3. 2-week soft launch → GA  
4. QBR at 90 days: conversion, GMV, support volume  

**MSA checklist:** attribution definition, breakage-inclusive net revenue, rev share tier table, fraud clawback.

---

### WS-E — Prepaid, breakage & staking (commercial rollout)

Aligned with [BUSINESS.md §6](./BUSINESS.md#6-economics-breakage-prepaid--staking-rewards).

| Step | Action | Phase | Dependency |
|---|---|---|---|
| E-1 | Finance model: breakage by SKU (20–55%) | 0.5 | Wholesale quotes |
| E-2 | Price 3/6/12 mo passes (8–15% headline vs monthly) | 1 | E-1 |
| E-3 | Legal review: staking rewards = utility not yield | 1 | Counsel |
| E-4 | App: “Stake & Earn” checkout + lock UX | 1 | PRD F-012 |
| E-5 | Rewards pool funding rule (20–30% breakage share) | 1 | Finance sign-off |
| E-6 | SKR boost tiers (500 / 1K / 2.5K) | 1 | SKR mainnet availability |
| E-7 | Expiry alert push (7/3/1 day + 80% data) | 1 | PRD F-013 |
| E-8 | Annual rollover bank + renewal flow | 2 | Utilization data from E-1 |

**Launch sequence for staking:**

```
Week 1: Internal dogfood (team Seeker devices)
Week 2: Closed beta (100 stakers, 3 mo pass only)
Week 3: Add 6 mo pass + SKR boost
Week 4: Public GA + 12 mo Annual pass
```

**Metrics dashboard (weekly):**

- GB utilization rate (sold vs consumed)  
- Staking opt-in % on eligible SKUs  
- Breakage-adjusted margin by SKU  
- Rewards pool burn vs accrual  
- Early unstake / forfeiture rate  

---

### WS-F — Compliance & trust (marketing-enabling)

| Item | Phase | Blocks |
|---|---|---|
| Terms of Service + prepaid expiry disclosure | 0.5 | dApp Store |
| Privacy policy (wallet-only Tier 0) | 0.5 | dApp Store |
| OFAC wallet screening | 0.5 | Mainnet |
| KYC Tier 1 vendor (Sumsub / Persona) | 1 | Passes >$100 |
| Staking program legal memo | 1 | Stake & Earn GA |
| MAP policy for partner SKUs | 2 | Partner scale |

**Trust marketing:** publish utilization aggregate quarterly; never claim “unlimited” without fair-use footnote.

---

### WS-G — Content & SEO calendar (Phase 0.5–1)

| Month | Asset | Target keyword / audience |
|---|---|---|
| M1 | “How to install eSIM on Seeker” | Seeker owners |
| M1 | “USDC eSIM guide” | Crypto travelers |
| M2 | “Solsim vs Unbound” comparison | Evaluation traffic |
| M2 | “Helium + travel eSIM setup” | US Seeker users |
| M3 | “Stake your data plan” explainer | Nomads, SKR holders |
| M3 | Country pages ×10 (JP, TH, EU, MX, …) | Long-tail travel |
| M4–6 | Country pages ×40; corridor calculators | Organic GMV |

**Content distribution:** blog on solsim.so, mirror to Mirror/Farcaster, syndicate to partner wallets where embed exists.

---

### WS-H — Metrics & reporting

#### North star

**Monthly Active eSIMs (MAE)** — ≥1 data session in period.

#### Phase gates

| Gate | Criteria to advance |
|---|---|
| Hackathon → Alpha | Demo loop works; wholesale POC signed |
| Alpha → Launch | 500 MAE, 99% provision success, dApp Store live |
| Launch → Scale | 5K MAE, 30% staking opt-in on passes, 1 wallet partner |
| Scale → Platform | 15K MAE, 40% partner GMV, breakage model within 5 pts of forecast |

#### Weekly marketing standup (15 min)

1. MAE / installs / conversion funnel  
2. dApp Store ranking + reviews  
3. Partner pipeline status  
4. Content published + organic traffic  
5. Support themes (expiry confusion = product marketing fix)  

#### Tooling (recommended)

| Function | Tool |
|---|---|
| Analytics | Mixpanel or Amplitude (funnel: install → connect → buy → install eSIM) |
| Attribution | Branch or custom ref codes on-chain + `?ref=` |
| SEO | Plausible + Search Console |
| Social | Buffer / native scheduling |
| CRM (partners) | Notion or HubSpot free tier |

---

## 4. App release ↔ marketing sync

| Release | App version | Business/marketing milestone |
|---|---|---|
| **v0.1** | Hackathon | Demo day; GitHub public; social teaser |
| **v0.5** | Seeker alpha | dApp Store submit; closed beta invites |
| **v1.0** | Public launch | PR + corridor campaigns; Genesis bundle |
| **v1.1** | Staking beta | Stake & Earn campaign; nomad creator push |
| **v1.2** | SKR boost | SKR holder targeting; Solana Mobile co-marketing |
| **v2.0** | Partner API | Wallet embed launch; B2B press |

**Rule:** no major marketing spend until **v0.5 provision success ≥99%** on 50 consecutive orders.

---

## 5. Budget sketch (Y1 directional)

| Category | Y1 range | Notes |
|---|---|---|
| Wholesale float / prepay | $15–30K | eSIM Access / 1GLOBAL minimums |
| Paid acquisition | $20–40K | Corridor tests; cap CAC < $15 |
| Content / SEO | $5–10K | Freelance writers + landing pages |
| Events / conferences | $10–20K | Breakpoint booth + event plans |
| Staking rewards pool | $25–50K | Breakage-funded + SKR grant |
| Design / brand | $5–8K | dApp Store assets, NFT art |
| Legal / compliance | $10–15K | ToS, staking memo, MSA template |
| **Total** | **~$90–170K** | Excludes eng salaries |

---

## 6. RACI (core team)

| Workstream | Responsible | Accountable | Consulted | Informed |
|---|---|---|---|---|
| Brand & positioning | Marketing | Founder | Product | Partners |
| GTM & channels | Marketing | Founder | Product | Solana Mobile |
| In-app product marketing | Product | Founder | Marketing | Eng |
| Partnerships | BD / Founder | Founder | Legal | Marketing |
| Staking / breakage commercial | Finance + Product | Founder | Legal | Marketing |
| Compliance | Legal | Founder | Product | Marketing |
| App delivery | Eng | Founder | Product | Marketing |

*Solo founder: one person covers multiple R cells; use this when hiring or delegating.*

---

## 7. 90-day action plan (starting now)

### Days 1–14

- [ ] Complete hackathon demo (PRD §C)  
- [ ] Publish GitHub repo with full docs  
- [ ] Book wholesale demos: 1GLOBAL, eSIM Access, Telna  
- [ ] Draft dApp Store listing copy (title, description, screenshots plan)  
- [ ] Post launch teaser on Farcaster / X  

### Days 15–45

- [ ] Sign wholesale agreement; 10 Seeker test activations  
- [ ] Submit dApp Store build (v0.5 alpha)  
- [ ] Launch landing page + 3 corridor pages  
- [ ] Closed beta: 100 Seeker users (invite codes)  
- [ ] Finalize brand kit + competitive battlecard  

### Days 46–90

- [ ] Hit 500 MAE or document blockers  
- [ ] Apply Solana Mobile co-marketing  
- [ ] Ship v1.0 public launch (mainnet USDC)  
- [ ] Genesis Token perk live  
- [ ] Begin staking pass SKU pricing (E-1/E-2)  
- [ ] Sign 1 wallet partner LOI for Phase 1 embed  

---

## 8. Risks to implementation

| Risk | Impact | Mitigation |
|---|---|---|
| dApp Store rejection / delay | No Seeker distribution | Pre-submission review; MWA compliance checklist |
| Unbound captures narrative first | Higher CAC | SKR + staking differentiation; ownership story |
| Breakage backlash | Trust / reviews hit | Expiry alerts; transparent FAQ before staking GA |
| Staking legal friction | Delay v1.1 | Utility-only framing; cap pool; counsel early |
| Wholesale margin squeeze | Can't fund rewards | Multi-provider; pass pricing tied to utilization model |

---

## 9. Document history

| Version | Date | Changes |
|---|---|---|
| 1.0 | 2026-08-06 | Initial business/marketing implementation plan |
