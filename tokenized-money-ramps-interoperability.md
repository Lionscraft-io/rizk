# Tokenized-money ramps & interoperability — gathered findings

**Prepared for:** Lionscraft briefing note to a multilateral development bank, as a companion to `tokenized-money-disbursement-research.md`.
**Research date:** 2026-06-13. All "as of" dates noted inline; treat figures as point-in-time.
**Core question:** Who is building **convertibility / redemption / clearing infrastructure** that lets one class of tokenized money convert into another — **tokenized bank deposit ↔ tokenized money-market fund (MMF) ↔ stablecoin** (and, in the regulated world, ↔ wholesale CBDC / tokenized central-bank reserves) — across issuers, chains, and jurisdictions.

**Three-layer sourcing and figure tags** as in the companion report: `[project's own claim]`, `[independently observable: <source>]`, `[no independent source found]`. For each item: **which instrument classes it bridges**, **intra- vs cross-issuer**, and **atomic/instant vs T+n**.

> **METHODOLOGICAL CAVEAT (whole document).** Direct WebFetch was HTTP-403-blocked across nearly every primary domain in this environment (issuer sites, BIS, SIFMA, block explorers). Figures were read via search-engine summaries of those pages and need direct screen-verification before publication. Re-verification lists are embedded.

**Instrument-class legend:** TD = tokenized commercial-bank deposit; wCBDC/CeBM = wholesale CBDC / tokenized central-bank reserves; UST = tokenized Treasuries/government bonds; MMF = tokenized money-market fund; SC = regulated stablecoin.

---

## Map at a glance

**Two structurally different "ramp" archetypes appear, and they are converging:**

1. **Private-sector / market rails (Part A)** — already live. Mostly **bilateral, atomic, 24/7 swap contracts** between one tokenized fund and one stablecoin (BUIDL↔USDC, BUIDL↔USDtb, USYC↔USDC, OUSG↔USDC, BUIDL/VBILL↔RLUSD), with **Securitize** recurring as the transfer-agent rail underneath fund↔stablecoin swaps and **Circle** as the stablecoin teller. On top of these sit **many-to-many "clearing" or shared-reserve layers** that aspire to true cross-issuer fungibility: **Ubyx** (a stablecoin clearing house — priority item), **M^0** (shared $M reserve), **Paxos Global Dollar Network**, **Circle Payments Network**, and the card networks (**Mastercard MTN**, **Visa**).
2. **Regulated / consortium / central-bank networks (Part B)** — mostly PoC/pilot, a few live. These aim to settle **multiple money classes on one shared ledger**: **RSN (US)** is the clearest multi-class example (deposits + Treasuries + simulated central-bank money); **BIS Project Agorá** does deposits + central-bank reserves cross-border (explicitly excludes stablecoins); **MAS BLOOM** and **Australia's Project Acacia** explicitly include stablecoins alongside bank money; **HKMA EnsembleTX** uniquely links tokenized deposits ↔ tokenized MMFs with real-value transactions.

**What a human should look at first:**

- **Ubyx** — the clearest attempt to build "singleness of money" for stablecoins (par redemption across issuers via a clearing house). Founded by the ex-Citi architect of the Regulated Liability Network; well-funded; but **live-production status is unconfirmed** and it appears to clear stablecoins, not tokenized deposits/MMFs.
- **RSN (US)** and **BIS Agorá** — the institutionally weightiest multi-class settlement efforts, both still pre-production.
- **The key structural gap (cross-confirmed by both research passes):** **no network — private or regulated — has been shown to atomically settle stablecoin ↔ tokenized deposit ↔ tokenized MMF together at real value in one transaction.** They coexist as separate apps or convert pairwise. This is the white space.
- **Dormancy flags:** Mountain **USDM** primary market closed (wind-down concluded 2025-08-22); Agora **AUSD** redemption window framed as open only until 2026-09-28.

---

## Part A — Private-sector / issuer rails

### A1. Bilateral atomic swap contracts (the most concrete cross-class ramps, live)

These are mostly **cross-issuer but pairwise**, mediated by **Securitize** (transfer agent) or a **Circle/Ondo** smart-contract teller. All are 24/7 and near-instant/atomic within capacity.

- **BUIDL → USDC** (Circle smart contract). **Bridges MMF→SC. Cross-issuer (Circle↔BlackRock/Securitize). Near-instant, 24/7, one-directional.** Announced **2024-04-11**; a Circle smart contract buys BUIDL for USDC. `[independently observable: Circle pressroom / BusinessWire 2024-04-11]` Reported impact (single secondary source, re-verify): BUIDL ~$3.2B AUM with ~15% routed through the USDC channel by Apr 2026; ~$150M Circle protocol fees from BUIDL-USDC in 2025. `[no independent source found — single article]`
- **BUIDL ↔ USDtb** (Ethena + Securitize). **MMF↔SC. Cross-issuer. 24/7/365 atomic swaps** via a dedicated liquidity-fund smart contract; BUIDL ≈ 90% of USDtb reserves; reserve mix shifted some to fiat from 2025-10-15 to speed redemptions. `[independently observable: The Block, Bitcoin.com]`
- **BUIDL / VBILL ↔ RLUSD** (Ripple + Securitize). **MMF↔SC. Cross-issuer. Instant 24/7** — holders of BlackRock BUIDL and VanEck VBILL swap shares for Ripple's RLUSD on demand. `[independently observable: Ripple press, The Block]`
- **USYC ↔ USDC** (Circle/Hashnote). **MMF↔SC. Intra-issuer (Circle owns both since the Jan 2025 Hashnote acquisition). Near-instant within capacity (one block); above capacity T+0/T+1.** A smart-contract "Teller"; reported zero-fee tier up to $1M/day. `[project's own claim; acquisition independently observable]`
- **OUSG ↔ USDC** (Ondo). **MMF↔SC. Intra-issuer at OUSG layer, cross-issuer underneath (OUSG holds BUIDL). 24/7 instant, $5,000 min, 0% mint/redeem fees.** `[project's own claim: Ondo docs]`
- **USTB → USDC** (Superstate). **MMF→SC. Intra-issuer. Instant, one transaction** (call `redeem`, burn USTB, receive USDC). `[project's own claim: Superstate docs]`
- **Cross-border first (May 2026):** Ondo + **J.P. Morgan Kinexys + Mastercard + Ripple** completed what Ondo called the first near-real-time cross-border redemption of a tokenized Treasury fund (OUSG), settling on the **XRP Ledger in <5 seconds** outside banking hours. **MMF→cross-border settlement, multi-party, cross-issuer.** `[independently observable: CoinDesk 2026-05-07, crypto.news]`

**Securitize is the single most recurring rail** beneath fund↔stablecoin swaps (BUIDL, VBILL across USDtb, RLUSD, USDC); it is BUIDL's fund transfer agent (BlackRock = manager, BNY Mellon = admin/custodian). A specific "sToken" product was referenced but not detailed. `[no independent source found]`

### A2. Clearing houses & many-to-many / shared-reserve layers (aspire to true cross-issuer fungibility)

**Ubyx — multi-issuer stablecoin CLEARING HOUSE (PRIORITY ITEM).** **Bridges SC→fiat bank/fintech deposit at par; cross-issuer by design; 24/7 via issuer pre-funded accounts at a settlement bank (intra-day, not strictly on-chain-atomic).**
- *Say:* "The stablecoin clearing system" — connects multiple issuers with multiple receiving institutions so any compliant stablecoin redeems **for fiat at par** into existing bank/fintech accounts; a common **Ubyx Rulebook**; planned **DAO + Ubyx token**; frames its goal as the **"singleness of money"** for stablecoins. Founded by **Tony McLaughlin** (ex-Citi; architect of Citi's Regulated Liability Network), launched **March 2025**. `[project's own claim, corroborated by multiple outlets]`
- *Observable:* **$10M seed led by Galaxy Ventures, announced 2025-06-17**, with Coinbase Ventures, Founders Fund, VanEck, Paxos; **Barclays** also disclosed as an investor. Announced issuer participants: **Ripple, Paxos, Agora, Monerium, GMO Trust, BiLira, Juno (Bitso), Brale, Transfero, Minteo, Tokenised GBP, Avenia, Agant, AllUnity, Eurodollar.** Announced chains: Aptos, Arbitrum, Avalanche, Base, Canton, Concordium, Hedera, Polygon, Solana, Starknet, Stellar, Sui, XDC, XRPL, ZKsync. Stated plan to **launch in Q4 2025.** `[independently observable: CoinDesk 2025-06-17, PRNewswire, Ledger Insights, American Banker]`
- *Couldn't find:* Any confirmation Ubyx is **live in production** or any cleared-volume figure (Q4 2025 target unconfirmed); the settlement-bank identity; whether it clears **tokenized deposits or MMF shares** (appears stablecoin→fiat focused). Both ubyx.xyz and a stablewatch deep-dive returned 403. `[no independent source found]`

**M^0 ($M shared reserve base).** **Bridges multiple branded stablecoins via a shared reserve; wrappers natively interconvertible 1:1 by wrap/unwrap to $M. Cross-brand within the network; permissionless mint/burn (instant).** Powers branded coins for **PayPal, MoneyGram, MetaMask (mUSD), KAST, Exodus**; regulated issuance via Anchorage Digital, Bridge, MoonPay, 1Money, MXON; **$40M raise (2025).** `[project's own claim; raise independently observable: PYMNTS]` Whether wrappers redeem directly into each other vs each to $M: `[no independent source found]`

**Paxos USDG / Global Dollar Network (GDN).** **Bridges one coin (USDG) across many distributors with shared economics (revenue-share); multi-jurisdiction issuance.** Partners can receive **up to 100% of returns** on USDG-backed assets held on their platform — a departure from the issuer-keeps-yield model. Founding drivers (Nov 2024): Anchorage, Bullish, Galaxy, Kraken, Nuvei, Paxos, Robinhood. Issued by **Paxos Digital Singapore (MAS)** and **Paxos Issuance Europe (MiCA / FIN-FSA)**. **~$2.75B circulating, 130+ partners as of May 2026.** `[independently observable: Paxos newsroom; supply secondary — re-verify]` Plus **Lift Dollar (USDL)**, a yield-bearing stablecoin (Paxos International, ADGM/FSRA).

**Circle Payments Network (CPN) + CCTP V2 + Circle Mint.** **CPN bridges cross-border fiat ↔ USDC/EURC settlement (cross-institution "SWIFT for stablecoins").** Launched April 2025; **CPN Managed Payments** (Apr 2026) lets banks/PSPs settle in USDC without handling crypto; early members include Standard Chartered, Deutsche Bank, SG-FORGE, Santander, BNY Mellon (custodian), dLocal, Yellow Card, Coins.ph; **~90 participants by Q1 2026.** **CCTP V2** (cross-chain native USDC, burn-and-mint, mainnet 2025-03-11, 13+ chains, Solana Oct 2025). **Circle Mint** mints/redeems USDC and EURC 1:1 in 185 countries; EURC↔USDC via a Cross-Currency API. `[independently observable: Circle pressroom, coverage — participant counts re-verify]`

**Card / network rails.**
- **Mastercard Multi-Token Network (MTN)** — **network-level multi-stablecoin settlement.** Supports USDC, EURC, PYUSD, USDG, FIUSD, and (per 2026 reporting) SoFiUSD; Mastercard crypto-partner program ~85 companies. `[independently observable: Mastercard news; coverage]`
- **Visa Tokenized Asset Platform (VTAP) + Visa stablecoin settlement** — VTAP (Oct 2024, BBVA pilot 2025) gives banks infra to issue fiat-backed tokens on public chains; separately Visa settles card flows in stablecoins (~$3.5B annualized run-rate as of 2025-11-30; **USDC settlement live in US 2025-12-16** with Cross River Bank and Lead Bank, over Solana). `[independently observable: Visa, coverage — re-verify run-rate]`
- **PayPal PYUSD** — direct 1:1 redemption (via PayPal/Paxos); cross-chain to 13 networks via LayerZero (Arbitrum added July 2025). `[independently observable: PayPal SEC filings, newsroom]`

**Issuance platforms (convertibility at the mint/burn layer).**
- **Stripe / Bridge "Open Issuance"** (announced ~Oct 2025): businesses launch/manage custom stablecoins, mint/burn freely, customize the cash/Treasury reserve ratio, and **choose reserve partners — BlackRock, Fidelity, Superstate** named; first customers Phantom, Hyperliquid, ConsenSys/MetaMask. Stripe acquired Bridge Feb 2025 (~$1.1B); Visa×Bridge stablecoin-linked cards to 100+ countries. `[independently observable: Stripe blog, Ledger Insights]`
- **Brale** — regulated stablecoin issuance/orchestration (expanded to Algorand, Stellar); also a named Ubyx issuer participant. `[project's own claim; expansion independently observable]`
- **Mansa** — stablecoin **liquidity** (credit lines/pre-funding) for PSPs, not a token-to-token converter; Dubai-HQ, Africa-focused; **$10M Feb 2025** ($3M equity led by Tether + $7M revolving credit); **$100M processed**. `[independently observable: TechCrunch, AfroTech — figures company-provided]`
- **"Beam"** — could not be identified unambiguously in this landscape (name ambiguity). `[no independent source found]`

### A3. Tokenized-MMF → stablecoin off-ramps (instrument-by-instrument)

- **BlackRock BUIDL:** BUIDL→USDC (Circle), BUIDL↔USDtb (Securitize/Ethena), BUIDL→RLUSD (Ripple/Securitize). Cross-issuer, near-instant/atomic 24/7.
- **Circle USYC:** USYC↔USDC near-instant (Circle Teller). Intra-issuer.
- **Ondo OUSG:** OUSG↔USDC 24/7 instant; plus **Ondo Nexus** (below).
- **Superstate USTB:** USTB→USDC one-transaction redeem; USTB/USCC freely transferable between allowlisted addresses.
- **Franklin BENJI (FOBXX):** Franklin + **Zero Hash** embed USDC funding rails for purchase/redemption, 24/7/365 near-real-time. `[independently observable: Franklin/Zero Hash press]`
- **WisdomTree WTGXX:** **24/7 trading + instant settlement against USDC** via a dealer-principal model (broker-dealer as principal); SEC exemptive relief + FINRA approval; announced ~2026-02-24; $730M AUM (2026-02-23). `[independently observable: WisdomTree IR, Decrypt]`
- **VanEck VBILL:** VBILL→RLUSD via Securitize (24/7); direct VBILL→USDC instant-redeem not separately confirmed. `[independently observable for RLUSD path]`

**Ondo Nexus — the clearest confirmed third-party (cross-issuer) MMF→stablecoin liquidity aggregator.** **Bridges third-party tokenized Treasuries → multiple stablecoins. Cross-issuer. Leverages OUSG instant mint/redeem.** Launched **Feb 2025**; lets investors in third-party tokenized Treasuries redeem against a variety of stablecoins; named sources Franklin Templeton, WisdomTree, Wellington, Fundbridge; 24/7 liquidity from BlackRock and PayPal. `[independently observable: Ondo X post 2025-02-04, Markets Media, AInvest]`

### A4. "Token-backing-token" redemption loops (stablecoin reserves into a tokenized MMF + par redemption — ramp mechanics)

- **Ethena USDtb** ↔ BUIDL atomic 24/7 (A1); ~90% BUIDL reserves.
- **Frax frxUSD** — mint/redeem against USDC, USDT, PYUSD, bank wires, or tokenized Treasuries; governance-approved "enshrined custodians." Instant-vs-T+n timing not confirmed. `[project's own claim]`
- **Mountain USDM** — **DORMANCY FLAG: concluded Phase 2 of an orderly wind-down 2025-08-22; primary market closed**, holders directed to secondary markets. `[independently observable: Mountain Protocol]`
- **Agora AUSD** — par redemption; reserves cash + T-bills + repo, State Street custody, VanEck managed; standard redemption window stated open **until 2026-09-28**, after which enhanced KYC/fees may apply. `[independently observable: coverage]`
- **Usual USD0** — par-redemption design; redemption mechanics not retrieved this pass (historically contentious). `[no independent source found]`
- **MegaETH USDm** — chain-native stablecoin on Ethena's USDtb stack (→ BUIDL underneath); reserve yield funds sequencer costs. `[independently observable: The Block]`

---

## Part B — Regulated / consortium / central-bank networks

### B1. Multi-class shared-ledger networks (the institutional core)

**Regulated Settlement Network (RSN) — US PoC. [ON-TOPIC CORE — the clearest US multi-class example].** **Connects TD + wCBDC/CeBM (simulated) + UST/regulated securities on ONE shared ledger.**
- *Say:* "An interoperable settlement network for multi-asset and cross-network transactions" testing "simultaneous and coordinated, 24/7 settlement" of "tokenised central and commercial bank deposits, US Treasury securities, and other regulated assets" — addressing that these settle today on "separate, siloed systems." `[project's own claim — SIFMA]`
- *Observable:* SIFMA-led; PoC launched ~July 2023, **findings published 2024-12-05.** Participants: **Citi, JPMorgan, Mastercard, SWIFT, TD Bank, U.S. Bank, USDF Consortium, Wells Fargo, Visa, Zions, BNY Mellon, Broadridge, DTCC, ISDA, Tassat** (+MITRE). Core platform by **Digital Asset (Daml/Canton-family)**; cross-network interlinking by **SWIFT**; legal Sullivan & Cromwell; advisory Deloitte. **Status: PoC, not live; no production date; the central-bank-reserves leg used a simulated token, not actual Fed reserves.** `[independently observable: SIFMA, Deloitte, Citi]` Throughput/latency figures: `[no independent source found — in the PDF]`

**Regulated Liability Network (RLN) — US (2022–2023) and UK.** The conceptual parent of RSN: put **central-bank money + commercial-bank deposits + (eventually) regulated stablecoins** as "regulated liabilities on a common ledger," with **wCBDC as the shared bridge/settlement asset.**
- *RLN US:* NY Fed Innovation Center published PoC findings **July 2023** — simulated wholesale USD payments in TD settled in a **theoretical wCBDC**; participants BNY Mellon, Citi, HSBC, Mastercard, PNC, TD, Truist, U.S. Bank, Wells Fargo; tech SETL + Digital Asset on AWS. RSN is effectively the successor/expansion. `[independently observable: NY Fed]`
- *RLN UK:* Coordinated by **UK Finance**; Discovery Phase Sept 2023, Experimentation Phase technical report **Sept 2024**; 11 banks + Mastercard/Visa; demonstrated retail-CBDC issuance models and **wCBDC settlement of TD transactions**. Not live; no BoE commitment to issue UK wCBDC. `[independently observable: UK Finance]`
- *Note:* MMFs are NOT in scope for either RLN; stablecoins are "contemplated when regulated."

**BIS "unified ledger" concept + Project Agorá / Pine / Rialto / Meridian.**
- **Unified ledger (BIS AER 2025, press 2025-06-24):** the "trilogy" — tokenized central-bank reserves + tokenized commercial-bank money + tokenized government bonds on one programmable platform; BIS explicitly framed it as offering "better solutions than stablecoins." The intellectual frame under RSN/RLN/Agorá. `[independently observable: BIS, PYMNTS]`
- **Project Agorá (BIS + IIF):** **wholesale cross-border, connecting tokenized central-bank reserves + TD; explicitly EXCLUDES private tokens/stablecoins.** 7–8 central banks (incl. NY Fed, Bank of England, Bank of Canada). **2026-05-27:** prototype done, **advancing to real-value testing.** Pre-production. `[independently observable: BIS, ECB, CoinDesk]`
- **Project Pine** (NY Fed + BIS, 2025): prototype for central-bank monetary-policy ops in a tokenized world (interest on reserves, OMO, collateral). PoC. **Project Rialto:** instant cross-border via modular FX + settlement in tokenized wholesale central-bank money. PoC. **Project Meridian / Meridian FX** (Bank of England + BIS): synchronization/DvP for FX and securities. `[independently observable: BIS bulletins, NY Fed]`

### B2. Networks explicitly including STABLECOINS alongside bank money

**MAS BLOOM (under Project Guardian). [EXPLICIT TD ↔ STABLECOIN].** **Connects tokenized bank liabilities (TD) + well-regulated stablecoins; a bank can "exchange a bank balance for a stablecoin, or a stablecoin for a tokenised deposit."** Multi-currency (G10 + Asian). Launched/announced **October 2025**; initial participants **Circle, Coinbase, DBS, OCBC, UOB, Partior, Stripe, Ant International, StraitsX** (JPMorgan reported joining). Builds on Project Orchid (retail CBDC + purpose-bound money settling on "Orchid Compatible Ledgers"). **Status: newly launched collaboration phase; no completed volumes or go-live date.** `[independently observable: MAS, Ledger Insights, TNGlobal]`

**Australia — RBA / DFCRC Project Acacia. [BROADEST money-class mix incl. SC].** **Connects TD (deposit tokens) + stablecoins + pilot wholesale CBDC + new uses of exchange settlement accounts, settling tokenized securities.** Led by RBA + DFCRC; ASIC granted regulatory relief; participants/use cases announced **July 2025** (ASIC 25-129MR): **24 use cases — 19 pilots with real money + real assets, 5 PoCs.** Participants include Fireblocks, Redbelly, Australian Bond Exchange, Fasanara, plus major banks. ~6-month testing; **final report expected Q1 2026.** `[independently observable: ASIC 25-129MR, RBA mr-25-18]`

### B3. Live / real-value networks (and the deposit↔MMF link)

**HKMA Project Ensemble / EnsembleTX. [TD + tokenized MMF + planned wCBDC — and LIVE real-value].** Uniquely **links tokenized deposits ↔ tokenized MMF transactions** and manages liquidity in real time, with planned upgrade to tokenized CeBM. Project Ensemble launched **March 2024**, sandbox **Aug 2024**; **EnsembleTX pilot announced 2025-11-13**, runs through 2026, interbank settlement initially via HKD RTGS upgrading toward tokenized CeBM. **First live cross-bank transaction: HSBC processed HK$3.8M in tokenized deposits for Ant International (Nov 2025).** 7 banks providing TD. **Status: pilot with real-value transactions (rare).** Whether the tokenized-MMF leg has executed real-value vs sandbox: `[no independent source found]`; HK$3.8M figure is HSBC-sourced. `[independently observable: HKMA 2025-11-13, info.gov.hk; HSBC figure project's own claim]`

**Canton Network (Global Synchronizer). [MULTI-APP ATOMIC: UST + TD + MMF in one venue].** "Public, permissionless blockchain purpose-built for institutional finance"; Global Synchronizer enables atomic cross-application settlement. Mainnet **July 2024** (Daml). Hosts: **DTCC + Digital Asset to tokenize DTC-custodied US Treasuries (Dec 2025; MVP H1 2026, production H2 2026); Franklin BENJI (tokenized MMF); LSEG DiSH tokenized deposits;** JPMorgan JPMD deposit token planned. **Dec 2025:** cross-border intraday repo across multiple asset classes/currencies using tokenized deposits at LSEG DiSH, incl. first cross-currency intraday repo (tokenized Gilts vs non-GBP tokenized deposits). **Status: mainnet live; specific institutional flows mix live + MVP/planned.** Whether a single atomic transaction has settled TD ↔ MMF ↔ UST together at real value: `[no independent source found — flag]`. "Permissionless" claim contested (validators permissioned in practice). `[independently observable: Canton press, Finadium, Ledger Insights, Messari]`

**LSEG Digital Settlement House (DiSH).** 24/7 settlement of **tokenized commercial-bank deposits** across currencies/networks (on Azure); transfers between members without direct banking relationships; feeds Canton repo flows. Launching/early-live. `[independently observable: The Block, Markets Media]`

**Fnality (£FnPS settlement asset).** A tokenized **claim on funds at the central bank** usable as a settlement leg / potential **bridge asset** for an RLN. Sterling FnPS live payments **Dec 2023**; UK **settlement-finality designation Dec 2024**; **Series C $136M (Sept 2025)** led by WisdomTree; integrated with DTCC Digital Launchpad; USD/EUR planned. **Status: LIVE (sterling), limited.** Not itself a multi-class converter (no SC/MMF leg). `[independently observable: Fnality, CoinDesk]`

**Partior.** Multi-currency **tokenized deposit / bank-money** settlement (USD/EUR/SGD live; JPY/AED/BRL onboarding); PvP/DvP. JV of DBS, JPMorgan, Standard Chartered (from Project Ubin); **$60M+ Series B (July 2024)**; Deutsche Bank joined (first euro cross-border payment Sept 2025); now a **BLOOM participant** (→ stablecoin link). **Status: LIVE production network.** Stablecoin leg comes via BLOOM, not yet independently demonstrated. `[independently observable: Partior, Deutsche Bank, The Block]`

**SWIFT shared ledger.** Blockchain-based shared ledger announced **Sept 2025** for interoperability between banks' **tokenized deposits**, 24/7 cross-border; on EVM-compatible/Hyperledger Besu; **MVP with real transactions planned in 2026**; 40+ institutions; also provided the cross-network interlinking layer in RSN. **Status: MVP build (pre-live).** `[independently observable: swift.com, Ledger Insights]`

**BIS Project mBridge (for completeness — single class).** Multi-CBDC (wholesale) cross-border (China, HK, Thailand, UAE, Saudi); MVP **Nov 2024**; **BIS departed 2024-10-31**; ~$55.5B cumulative (Atlantic Council compilation, e-CNY ~95%); operating among participants but geopolitically uncertain. Not a multi-class bridge. `[independently observable: BIS; volume secondary]`

---

## Instrument-class × status matrix (regulated/consortium networks)

| Network | TD | wCBDC/CeBM | UST/Bonds | MMF | Stablecoin | Status | Key date |
|---|---|---|---|---|---|---|---|
| RSN (US) | ✔ | ✔ (sim) | ✔ | – | – | PoC | Dec 2024 |
| RLN US | ✔ | ✔ (theo) | – | – | future | PoC | Jul 2023 |
| RLN UK | ✔ | ✔ | – | – | future | Experiment | Sep 2024 |
| BIS Agorá | ✔ | ✔ | – | – | No (excl) | →real-value | May 2026 |
| BLOOM (MAS) | ✔ | – | – | – | **✔** | Launched | Oct 2025 |
| HKMA EnsembleTX | ✔ | planned | (assets) | **✔** | – | **Pilot/live** | Nov 2025 |
| Project Acacia (AU) | ✔ | ✔ (pilot) | (securities) | – | **✔** | Pilot | Jul 2025 |
| Canton + DiSH/BENJI/DTCC | ✔ | – | **✔** | **✔** | – | Live + MVP | Dec 2025 |
| Fnality | (bridge) | ✔ (claim) | DvP leg | – | – | **LIVE £** | Dec 2023 |
| Partior | ✔ | – | – | – | (via BLOOM) | **LIVE** | live |
| SWIFT ledger | ✔ | – | – | – | – | MVP | 2026 |
| mBridge | – | ✔ | – | – | – | MVP/live | Nov 2024 |

---

## Key facts & gaps (no verdicts)

- **The white space:** No network — private or regulated — has been shown to **atomically settle SC ↔ TD ↔ MMF together at real value in one transaction.** Private rails do it pairwise (BUIDL↔USDtb, etc.); consortium networks mostly keep classes as separate apps or convert pairwise; the wholesale-CBDC leg is theoretical/simulated almost everywhere except mBridge. `[cross-confirmed across both research passes]`
- **Securitize and Circle are the recurring private-rail intermediaries**; **Digital Asset/Canton (Daml)** is the recurring regulated-network technology (RSN, RLN, Canton, LSEG DiSH).
- **Two efforts explicitly bridge bank money and stablecoins:** MAS **BLOOM** and Australia **Project Acacia** — both early-stage.
- **Ubyx** is the clearest "clearing house for stablecoins" (par redemption across issuers) but live status and any volumes are unconfirmed, and it appears stablecoin-only (not TD/MMF).
- **Dormancy/wind-down:** Mountain USDM primary market closed (2025-08-22); Agora AUSD redemption window framed to 2026-09-28.

**Re-verify before publication:** Ubyx live status + cleared volumes; all AUM/volume/fee figures (the BUIDL-USDC ~15%/$150M figures rest on a single secondary article); WisdomTree go-live; RSN/Agorá throughput and exact rosters (BIS/SIFMA pages 403); whether Canton/EnsembleTX have settled TD↔MMF↔UST atomically at real value; the IDRX/"Hashnote" and "Beam" ambiguities noted in the companion files.

---

## Sources

Marked **(M)** issuer/own-marketing, **(I)** independent reporting, **(P)** primary/official (regulator, BIS, central bank, explorer). All 403-blocked to direct fetch this session; read via search summaries.

### Private rails (Part A)
- **Ubyx:** (I) https://www.coindesk.com/markets/2025/06/17/stablecoin-clearing-startup-ubyx-raises-10m-round-backed-by-galaxy-coinbase-others ; (M/I) https://www.prnewswire.com/news-releases/ubyx-the-stablecoin-clearing-system-enabling-bank--fintech-off-ramps-announces-10m-seed-led-by-galaxy-ventures-302483615.html ; (I) https://www.ledgerinsights.com/ubyx-stablecoin-clearing-network-raises-10m/ ; (I) https://www.ledgerinsights.com/barclays-invests-in-stablecoin-clearing-network-ubyx/ ; (I) https://www.americanbanker.com/payments/news/barclays-backs-u-s-startup-for-stablecoin-clearing ; (I) https://www.concordium.com/article/concordium-and-ubyx-to-deliver-regulated-stablecoin-clearing-for-banks-and-fintechs ; (M) https://www.ubyx.xyz/building-blocks (403)
- **Circle:** (M) https://www.circle.com/usyc ; (M) https://www.circle.com/pressroom/circle-announces-usdc-smart-contract-for-transfers-by-blackrocks-buidl-fund-investors ; (I) https://www.businesswire.com/news/home/20240411966052/en/ ; (M) https://www.circle.com/pressroom/circle-launches-cpn-managed-payments-a-full-stack-platform-for-seamless-stablecoin-settlement ; (M) https://www.circle.com/cross-chain-transfer-protocol ; (M) https://www.circle.com/circle-mint
- **Ondo:** (M) https://docs.ondo.finance/qualified-access-products/ousg/overview ; (M) https://ondo.ghost.io/introducing-instant-24-7-365-subscriptions-and-redemptions-shifting-ousg-funds-into-blackrocks-buidl/ ; (I) https://www.marketsmedia.com/ondo-nexus-delivers-instant-liquidity-for-third-party-tokenized-treasuries/ ; (I) https://crypto.news/jpmorgan-mastercard-and-ripple-test-tokenized-treasury-settlement-on-xrpl/
- **Securitize / Ethena:** (I) https://www.theblock.co/post/358799/ethena-labs-securitize-enable-24-7-atomic-swaps-between-usdtb-and-blackrocks-tokenized-fund ; (M) https://usdtb.money/
- **M^0:** (M) https://www.m0.org/products ; (M) https://www.m0.org/press-releases/bridge-and-m0-are-partnering-to-help-businesses-issue-custom-stablecoins-starting-with-metamask-usd ; (I) https://www.pymnts.com/cryptocurrency/2025/m0-raises-40-million-for-stablecoin-infrastructure-platform/
- **Paxos:** (M) https://www.paxos.com/newsroom/paxos-introduces-global-dollar-usdg ; (M) https://www.paxos.com/newsroom/global-dollar-(usdg)-launches-in-the-eu
- **Stripe/Bridge, Brale, Mansa:** (M) https://stripe.com/blog/introducing-open-issuance-from-bridge ; (I) https://www.ledgerinsights.com/stripes-bridge-partners-with-blackrock-fidelity-for-stablecoin-issuance-platform/ ; (M) https://brale.xyz/ ; (I) https://techcrunch.com/2025/02/19/tether-backs-stablecoin-liquidity-provider-mansa-in-10m-seed-round
- **Card/network rails:** (M) https://www.mastercard.com/global/en/news-and-trends/stories/2025/mastercard-stablecoin-utility-and-scale.html ; (M) https://investor.visa.com/news/news-details/2024/Visa-Introduces-the-Visa-Tokenized-Asset-Platform/default.aspx ; (P) PayPal SEC 10-Q FY2026 https://www.sec.gov/Archives/edgar/data/0001633917/000163391726000067/pypl-20260331.htm
- **Ripple:** (M) https://ripple.com/ripple-press/ripple-and-securitize-enable-rlusd-smart-contract-functionality-for-blackrock-buidl-and-vaneck-vbill-tokenized-funds/ ; (I) https://www.coindesk.com/markets/2026/05/07/ripple-jpmorgan-settle-first-cross-border-tokenized-treasury-redemption-on-xrp-ledger
- **MMF off-ramps:** (M) https://docs.superstate.com/superstate-funds/ustb/redeeming-ustb ; (I) https://ir.wisdomtree.com/news-events/press-releases/detail/777/wisdomtree-to-launch-247-trading-and-instant-settlement
- **Token-backing loops:** (M) https://mountainprotocol.com/usdm/ ; (I) https://crypto.news/stablecoin-agora-raises-50m-series-a-paradigm-2025/ ; (M) https://frax.com/

### Regulated / consortium networks (Part B)
- **RSN:** (M) https://www.sifma.org/news/press-releases/members-of-the-u-s-financial-sector-demonstrate-feasibility-of-multi-asset-and-cross-network-settlement-using-shared-ledger-technology (403) ; (I) https://www.ledgerinsights.com/citi-wells-fargo-others-complete-tokenization-settlement-trials/ ; (I) https://www.marketsmedia.com/sifma-reports-on-regulated-settlement-network-poc/
- **RLN US/UK:** (P) https://www.newyorkfed.org/newsevents/news/financial-services-and-infrastructure/2023/20230706 ; (P) https://www.federalreserve.gov/econres/notes/feds-notes/examining-cbdc-and-wholesale-payments-20230908.html ; (M) https://regulatedliabilitynetwork.org/ ; (M) https://www.ukfinance.org.uk/system/files/2024-09/UK%20Finance%20RLN%20Technical%20Report.pdf
- **BIS unified ledger / Agorá / Pine / Rialto:** (P) https://www.bis.org/press/p250624.htm ; (P) https://www.bis.org/about/bisih/topics/fmis/agora.htm ; (P) https://www.bis.org/press/p260527.htm (403) ; (P) https://www.ecb.europa.eu/press/intro/news/html/ecb.mipnews20260527.en.html ; (P) https://www.newyorkfed.org/newsevents/news/aboutthefed/2025/20250514 ; (P) https://www.bis.org/about/bisih/topics/cbdc/rialto.htm ; (I) https://www.pymnts.com/cryptocurrency/2025/bank-for-international-settlements-says-tokenized-unified-ledger-offers-better-solutions-than-stablecoins/ ; (I) https://www.coindesk.com/business/2026/05/27/bis-project-finds-tokenization-could-make-cross-border-payments-faster-safer
- **MAS BLOOM / Orchid / Guardian:** (P) https://www.mas.gov.sg/news/media-releases/2025/mas-launches-bloom-initiative-to-extend-settlement-capabilities ; (I) https://www.ledgerinsights.com/jp-morgan-circle-join-singapores-mas-tokenized-clearing-project-bloom/
- **HKMA Ensemble / EnsembleTX:** (P) https://www.hkma.gov.hk/eng/news-and-media/press-releases/2025/11/20251113-3/ ; (M) https://www.about.hsbc.com.hk/news-and-media/hsbc-completes-first-live-cross-bank-transaction-in-ensembletx ; (I) https://www.ledgerinsights.com/hong-kong-launches-tokenized-deposit-pilots-a-wholesale-cbdc-soon-not-yet/
- **Project Acacia (AU):** (P) https://www.asic.gov.au/about-asic/news-centre/find-a-media-release/2025-releases/25-129mr-project-acacia... ; (P) https://www.rba.gov.au/media-releases/2025/mr-25-18.html ; (P) https://www.rba.gov.au/payments-and-infrastructure/central-bank-digital-currency/pdf/project-acacia-final-report.pdf
- **Canton / DiSH / Fnality / Partior / SWIFT / mBridge:** (M) https://www.canton.network/canton-network-press-releases/dtcc-and-digital-asset-partner-to-tokenize-dtc-custodied-u.s.-treasury-securities-on-the-canton-network ; (I) https://finadium.com/market-heavyweights-transact-cross-border-intraday-repo-on-canton/ ; (I) https://www.theblock.co/post/385740/london-stock-exchange-group-launches-24-7-blockchain-based-settlement-platform-for-tokenized-bank-deposits ; (M) https://fnality.com/news/fnality-commences-initial-phase-of-sterling-payment-operations-in-a-world-first ; (I) https://www.coindesk.com/business/2025/09/23/fnality-raises-usd136m-to-expand-blockchain-payment-systems-for-banks ; (M) https://partior.com/ ; (M) https://www.db.com/news/detail/20250925-deutsche-bank-conducts-first-euro-transaction-via-blockchain ; (M) https://www.swift.com/news-events/press-releases/swift-add-blockchain-based-ledger-its-infrastructure-stack-groundbreaking-move-accelerate-and-scale-benefits-digital-finance ; (I) https://www.ledgerinsights.com/swift-to-run-live-tokenized-deposit-payments-on-blockchain-mvp-in-2026/ ; (P) https://www.bis.org/about/bisih/topics/cbdc/mcbdc_bridge.htm

*Synthesized from two parallel research passes (private-sector rails; regulated/consortium networks). Full per-track detail with complete source lists is in `research/notes/scratch/07-ramps-private.md` and `08-ramps-regulated-networks.md`. The 403 caveat applies to all figures; re-verification list above.*
