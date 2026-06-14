# Alternative-currency (non-USD) stablecoins — Asia & Africa deep dive

**Prepared for:** Lionscraft briefing note to a multilateral development bank (ADB-region focus), as a companion to `tokenized-money-disbursement-research.md` (whose §4 covered the basics of XSGD, XIDR, PHPC, JPYC, IDRT, Thailand THB/G-Token, the HK ordinance, AUDD, NZDD). **This document goes deeper on those and adds the rest of Asia and Africa**, with emphasis on India, South Asia, and Southeast Asia.
**Research date:** 2026-06-13. Treat all figures as point-in-time.

**Three-layer sourcing and figure tags** as in the companion report: `[project's own claim]`, `[independently observable: <source>]`, `[no independent source found]`. For each issuer: **who issues it, regulatory status, and reserve composition.** Government-bond backing is flagged **>>> GOV-BOND <<<**; supranational/multilateral backing **>>> SUPRANATIONAL <<<**.

> **METHODOLOGICAL CAVEAT (whole document).** Direct WebFetch was HTTP-403-blocked across nearly every primary domain (issuer sites, central banks, block explorers, aggregators). Supply figures were read via search-engine summaries and **must be re-verified on the contract explorer before publication** — circulating supply is on-chain-verifiable for any token with a public contract; addresses are given where found. Per-section re-verification lists are embedded.

---

## Map at a glance

**Live and regulated (the short list):**
- **Asia:** **XSGD** (Singapore, MAS-licensed), **JPYC** (Japan, FSA-registered, launched 2025-10-27), **PHPC** (Philippines, exited the BSP sandbox 2025), and the Indonesian trio **XIDR / IDRT / IDRX** (live, but in a transitional regulatory regime with no settled rupiah-stablecoin rule). **AxCNH** (offshore yuan) is live but licensed in **Kazakhstan**, not HK/Singapore. **USDG** (Paxos Digital Singapore) is the MAS-regulated *USD* comparator (~$2.75B).
- **Africa:** **cNGN** (Nigeria, SEC-approved) and **ZARP** (South Africa, privately issued, full cash reserves) are the only two genuinely live, reserve-backed local-currency tokens.

**Pre-launch / pilot / proposal (the larger set):** India **ARC**; Japan's **three-megabank coin** (Progmat) and **DCJPY**; Hong Kong **HKD** coins (HSBC, Anchorpoint — licensed Apr 2026, launch H2 2026); **Korea** KRW (bills pending); **Malaysia** ringgit pilots; **Vietnam** VND regime; **Thailand** THB stablecoin; **Pakistan** sovereign PKR coin; Kenya/Ghana shilling/cedi tokens. Most of East Asia's bank/CBDC-adjacent efforts are pilots, not live issuance.

**Government-bond backing is concentrated and worth flagging:** **JPYC (~80% JGBs)** is the most explicit live disclosure; **XSGD** (SG government/public-entity notes mixed with cash), **EURC** (EU sovereigns), and Nigeria's **cNGN (~46% incl. Treasury bills)** also carry sovereign paper; proposed **India ARC (G-Secs + T-Bills)** and **Thailand** are designed around it. **No stablecoin anywhere is backed by supranational/multilateral paper — twice greenfield for an MDB.**

**What a human should look at first:**
1. **India** — the largest prize and the most contested: ARC's G-Sec backing and onshore-liquidity rationale, against an actively hostile RBI (vs a more open Finance Ministry), a punitive tax regime, and FEMA capital-control risk. The only live INR digital money is the e-rupee CBDC, whose circulation appears to be *declining*.
2. **cNGN (Nigeria) and ZARP (South Africa)** — the two live African tokens, with opposite reserve models (sovereign-paper-inclusive vs full cash).
3. **The "rails are really just USD stablecoins" distinction** in Africa (Yellow Card, Onafriq, Mansa) — important not to mistake USDC/USDT remittance rails for local-currency issuance.

---

## 1. India & South Asia

### India

**Regulatory posture (context for all INR efforts).** No legal framework for private stablecoins exists as of mid-2026 — VDAs are taxed but not licensed. Live **30% tax on VDA gains + 1% TDS** on transfers (no loss offset). The **FEMA capital-controls tension is the core legal obstacle**: a stablecoin could be reclassified as currency (current-account) or asset (capital-account), and RBI could treat INR-stablecoin transfers as unauthorised forex. A long-delayed inter-ministerial **crypto/VDA discussion paper** (RBI + SEBI + DEA) was, per April 2026 reporting, **"blocked"/stalled by RBI**. A notable **government-vs-RBI divergence**: the Finance Ministry has signalled openness to a stablecoin framework. `[independently observable: Cyril Amarchand FIG Papers 43 & 51, Crypto Times Apr 2026, Cointelegraph, Grant Thornton Bharat]`

- **RBI stance (dated, hostile):** DG **T. Rabi Sankar (2025-12-12)** said stablecoins serve no meaningful purpose and warn of currency substitution/dollarisation/weakened monetary-policy transmission; Governor **Sanjay Malhotra** "very cautious," dismissed GENIUS-Act pressure (India has UPI/NEFT/RTGS); RBI's Dec 2025 Financial Stability Report urged prioritising CBDCs over private stablecoins. `[independently observable: Business Standard, Medianama, Crypto Times Dec 2025]`

**ARC — "Asset Reserve Certificate" (Anq + Polygon Labs). >>> GOV-BOND <<< Status: PRE-LAUNCH / PROPOSAL** (tentative Q1 2026 debut).
- *Say:* INR-pegged 1:1, developed by **Anq** (Bengaluru) + **Polygon Labs**. **>>> GOV-BOND <<<** each ARC backed by **Indian Government Securities (G-Secs) and Treasury Bills (T-Bills)** (some reports add FDs/cash); minted only when the issuer acquires cash/equivalents; **minting restricted to business/corporate/institutional accounts** (framed to comply with the Liberalised Remittance Scheme). Stated rationale: keep rupee liquidity onshore, counter USD-stablecoin outflows, and **boost demand for Indian government debt.** Marketed as "India's first regulated rupee stablecoin." `[project's own claim — "regulated" status unverified]`
- *Observable:* Reported by CoinDesk (2025-11-20, sourced to unnamed people) and widely echoed (CoinJournal, Cryptobriefing, Coinpedia, Nov 2025). **No RBI/SEBI/IFSCA approval or licence document found.** `[independently observable: multiple media; no regulator confirmation]`
- *Couldn't find:* on-chain contract/supply (consistent with pre-launch); reserve attestation or named custodian; chain deployment; GIFT City linkage. `[no independent source found]`

**CoinDCX INR-stablecoin proposal. Status: ADVOCACY, no product.** CEO **Sumit Gupta** advocates a regulated INR stablecoin to cut remittance costs by up to 90% (cited ~$125B inflows), with 100% INR (cash) reserves under RBI oversight; voiced at the Business Standard BFSI Summit (~2025-10-30) alongside the Bharat Web3 Association. No token/contract. `[exec claim; event independently observable]`

**INRx.** Could not be confirmed as a distinct live project — searches redirected to ARC. Possibly an aspirational label. `[no independent source found — re-verify]`

**Historic/smaller INR tokens (dormant):** **TrueINR (TINR)** (~2020, claimed 1:1) and **INDT (IndtCoin)** — no recent activity, supply, or reserve data; treat as dormant/negligible. `[no independent source found]`

**RBI e-rupee (e₹ / digital rupee) — CBDC, the state's answer. Status: LIVE PILOT, expanding — but circulation reportedly declining.**
- *Observable (re-verify against RBI bulletins):* retail (e₹-R) across **~17 banks**; user figures conflict (~600,000 wallet users mid-2025 vs "6 million" in some summaries — unreconciled). Circulation **₹1,016.46 crore by 2025-03-31** (up from ₹234 cr a year earlier), then reportedly **fell to ₹771.66 crore by 2026-03-31** — flag as demand softness. **Live programmability** (expiry, geo-location, merchant category, purpose — used in DBT/welfare pilots) and an **offline e₹** (launched at Global Fintech Fest 2025). Wholesale e₹-W used in **>₹500 crore of G-Sec DvP** settlements. `[independently observable: PIB, IBEF, ainvest, HRF tracker — figures need RBI primary]`

**GIFT City / IFSCA + tokenized deposits (adjacent rails, NOT stablecoins):**
- **IFSCA RWA tokenization sandbox** — consultation paper Feb 2025; FinTech Sandbox draft Sep 2025; first asset class real estate; **explicitly tokenization only, NOT crypto trading.** `[independently observable: IFSCA consultations]`
- **RBI tokenized-deposits pilot (LIVE)** — launched **2025-10-08**, wholesale-only, on **e₹-W** as settlement layer; initial use tokenizing **Certificates of Deposit**; "no new money created." `[independently observable: Business Standard Oct 2025]`

### Pakistan (PKR)
**Most permissive trajectory in South Asia; sovereign PKR coin promised but not built.** **Pakistan Crypto Council** (Mar 2025); **Virtual Assets Ordinance (Jul 2025)** → **Virtual Assets Act / PVARA** (autonomous regulator, FATF-aligned); **banking ban lifted ~April 2026** (banks may service licensed VASPs); SBP **CBDC prototype with IMF + World Bank** assistance; a **Q4 2025 sandbox** reportedly approved **three stablecoin remittance pilots.** PVARA chairman **Bilal bin Saqib** says Pakistan will launch its own **sovereign stablecoin** — but no token, issuer, or reserve composition exists yet (no gov-bond commitment confirmed). A Jan 2025 **USD1** (Trump-linked World Liberty Financial) MoU is a **USD** coin, not PKR. `[independently observable: Dawn, Arab News, CoinDesk Apr 2026; sovereign coin = exec claim, no token found]`

### Bangladesh, Sri Lanka, Nepal
- **Bangladesh:** crypto effectively **banned** (Governor Mansur, Oct 2025: "no place in Bangladesh's remittance ecosystem"); digital-taka pilot stalled; no BDT stablecoin. Huge remittance economy (~$22B) where use is **informal P2P USDT**. `[independently observable: CoinGeek Oct 2025]`
- **Sri Lanka:** 2021 directive **prohibits banks/cards for crypto**; CBDC only exploratory; no LKR stablecoin. `[independently observable: HRF tracker]`
- **Nepal:** crypto **banned**; CBDC in research (Governor expects launch "in 2026," aspirational); no NPR stablecoin. `[independently observable: HRF tracker]`

**South Asia cross-cutting:** world's largest remittance-receiving region (India ~$111–125B, Pakistan ~$31B, Bangladesh ~$22B; traditional cost 6–8%). Actual stablecoin remittance today is **mostly informal/P2P USDT (USD), not local-currency coins**; no live regulated *local-currency* stablecoin remittance product operates at scale in any of these markets. Spectrum: Pakistan (building) → India (no framework, gov/RBI split, tax-but-no-license) → Bangladesh/Sri Lanka/Nepal (ban/restriction + CBDC exploration). `[synthesis]`

**India/South Asia re-verify:** ARC's on-chain/audit/regulatory reality and whether "regulated" = any actual authorisation; the e₹ user-count discrepancy (600k vs 6M) and FY26 decline (RBI primary); "INRx" existence; Pakistan's sovereign-coin reserve composition and the three sandbox providers' identities.

---

## 2. Southeast Asia

### Singapore
**XSGD (StraitsX). >>> GOV-BOND <<< LIVE & MAS-regulated.** Issued by **StraitsX SGD Issuance Pte. Ltd.** (Xfers); 1:1 SGD. **>>> GOV-BOND <<<** reserves = cash/equivalents + **Singapore-government or SG-public-entity short-term notes**, in trust at DBS/Standard Chartered/CIMB; monthly Singapore-CPA attestations (Sep 2024, June 2025, Dec 2025). **MAS Major Payment Institution licences granted 2024-07-17**; recognised "substantively compliant" with the Single-Currency Stablecoin framework. Ethereum contract `0x70e8de73ce538da2beed35d14187f6959a8eca96`; chains Ethereum/Polygon/Avalanche/Arbitrum/Hedera/Zilliqa, **XRPL added May 2025, Solana planned early 2026, Base**. **Circulating supply diverges sharply by source: ~18.5M (CMC) / ~22M (CoinGecko) / ~42M (Coinpaprika) — re-verify.** StraitsX total stablecoin GTV reportedly surpassed **US$18B** (2025). `[independently observable: MAS reporting, StraitsX attestations, Etherscan; supply caveat]` Exact cash-vs-gov-paper split: `[no independent source found — open the attestation PDF]`
- **StraitsX × Grab MOU** — exploratory, to let Grab users hold/spend XSGD/XUSD in-app (not live). MAS SCS policy consortium named: DBS, JPMorgan, Standard Chartered, UOB, Circle, Temasek, StraitsX. `[independently observable: The Asian Banker]`
- **USDG (Paxos Digital Singapore)** — MAS-MPI **USD** coin, ~$2.75B (May 2026); the SG-regulated USD comparator, not a local-currency coin. `[independently observable]`
- No live **bank-issued** SGD stablecoin found. `[no independent source found]`

### Indonesia (regulatory transition Bappebti → OJK + Bank Indonesia, effective 2025-01-10)
Rupiah remains the only legal tender; **no settled local-currency-stablecoin rule yet.** Three live rupiah tokens:
- **XIDR (StraitsX)** — 1:1 IDR, reserves in a regulated Indonesian FI; chains Ethereum/Polygon/Zilliqa; supply ~2.1B XIDR (small USD value); NOT covered by SG MPI/SCS. Indonesian license/custodian/auditor: `[no independent source found]`
- **IDRT (PT Rupiah Token Indonesia)** — 1:1 IDR bank deposits, KYC-gated; Ethereum contract `0x998ffe1e43facffb941dc337dd0468d52ba5b48a`; supply ~170B IDRT (~$10M); audit attributed to Johannes Juara & Rekan. `[independently observable: Etherscan, pharos.watch]`
- **IDRX (NEW)** — markets as "the first Indonesian Rupiah-backed stablecoin," 1:1 IDR, launched early 2024; multichain (Solana, Base — listed on Coinbase, Polygon, Etherlink); **CertiK** security audits (not a reserve attestation); >US$90M volume claimed. **NOTE: a "Hashnote" association is unverified and likely a search conflation** — confirm the actual issuing entity. `[own claim; reporting]` Issuer legal entity, contract addresses, reserve attestation: `[no independent source found]`
- Bank Indonesia reportedly exploring a **digital-rupiah-based stablecoin** (Project Garuda context) — exploratory, verify with BI. `[reporting]`

### Philippines
- **PHPC (Coins.ph). LIVE, post-sandbox.** 1:1 PHP, "100% basket of cash, time deposits, short-term money-market instruments." **Exited the BSP Regulatory Sandbox in 2025** (final sandbox-phase redemption 2025-07-05); scaling for remittances (~$40B/yr OFW inflows). **Polygon contract `0x87a25dc121Db52369F4a9971F664Ae5e372CF69A`; chains Polygon and Ronin.** `[independently observable: fintechnews.ph, BitPinas, Polygonscan]` Current supply / third-party reserve attestation: `[no independent source found]`
- **PHPX (NEW — bank consortium). Status: target May–Jul 2025, launch unconfirmed.** "First bank-collateralised PHP stablecoin," multi-issuer, on **Hedera**, built with **JUST Finance**; consortium **UnionBank (via UBX), RCBC, Cantilan Bank, Rural Bank of Guinobatan**; for OFW remittances. `[independently observable: PR Newswire, Ledger Insights]` Live status / token ID: `[no independent source found — verify]`
- BSP wholesale CBDC = **Project Agila**; no live retail digital peso.

### Malaysia (NEW coverage)
**Ringgit (MYR) stablecoin + tokenized deposits — Bank Negara DAIH. Status: PILOT / PRE-LAUNCH.** BNM will onboard **three 2026 pilots** under its **Digital Asset Innovation Hub** using ringgit stablecoins and tokenized deposits, **wholesale only**: a B2B ringgit-stablecoin settlement led by **Standard Chartered Malaysia + Capital A**; tokenized-deposit pilots led by **Maybank and CIMB**. Greater clarity promised by end-2026; possible wholesale-CBDC interoperability. No live retail MYR stablecoin. `[independently observable: The Asian Banker, BNM-attributed reporting]`

### Thailand
- **G-Token — tokenized government bond. >>> GOV-BOND <<< LIVE.** Thailand's Ministry of Finance launched **G-Token**, billed "world's first publicly offered tokenized government bond"; Cabinet-approved **THB 5 billion (~$153M)** start, retail-accessible from THB 100, under the Public Debt Management Act; **KuCoin** first international partner. A **tokenized debt instrument, not a stablecoin** — but the asset the proposed THB stablecoin would be backed by. `[independently observable: Nation Thailand, Blockhead]`
- **THB stablecoin backed by government bonds. >>> GOV-BOND <<< Status: PRE-LAUNCH.** Finance Ministry plan for a **THB 10B government-bond-backed** stablecoin. `[independently observable: Nation Thailand, Ledger Insights]`
- **Bank of Thailand Stablecoin Sandbox** — expanded Dec 2025; participants SCB 10X, Kasikornbank, Ascend Bit. `[independently observable]`

### Vietnam (NEW coverage)
**No live VND-pegged stablecoin; a pilot regime + a USDT-settlement payment pilot.** Landmark **Law on Digital Technology Industry (June 2025)** recognises digital assets as property; **Resolution 05/2025/NQ-CP (Sep 2025)** opens a **5-year pilot** for licensed VASPs with **all issuance/trading/settlement in VND** — but a **VND 10 trillion (~$400M) charter-capital** bar (among the world's most restrictive); licence applications opened 2026-01-20 (7 received). The **Da Nang "Basal Pay"** pilot converts payments to **USDT** with merchants receiving VND — a USDT-settlement app, **not** a VND-pegged stablecoin. `[independently observable: WFW, Duane Morris, PwC; Da Nang reporting]`

---

## 3. East Asia

### Japan
**JPYC (JPYC Inc.). >>> GOV-BOND <<< LIVE — the most explicit gov-bond disclosure in the region.** "Japan's first" regulated yen stablecoin, 1:1 yen, no transaction fees. **>>> GOV-BOND <<<** reserve management plans **~80% Japanese Government Bonds (JGBs), ~20% bank deposits.** **Regulatory:** an "electronic payment instrument" under the Payment Services Act, issued by a registered **Type II Funds Transfer Service Provider** under FSA oversight (first such registration Aug 2025). **Launched 2025-10-27** on Avalanche/Ethereum/Polygon, with a **¥1,000,000/day per-user issuance/redemption cap.** **Supply ~2.63B JPYC (~US$17M) as of Feb 2026.** FSA consultations from Jan 2026 on eligible bond types. `[independently observable: Elliptic, Iolite, CoinMarketCap; supply caveat]` Per-chain contracts / JGB-vs-deposit split attestation: `[no independent source found]`

**Three-megabank yen stablecoin (Progmat). >>> GOV-BOND (collateral) <<< Status: PRE-LAUNCH** (Mar 2026 target). Consortium **MUFG, SMBC, Mizuho** + Mitsubishi Corp, Progmat, MUFG Trust; **FSA greenlight 2025-11-07**; plan ~**¥1 trillion** over three years on **MUFG's Progmat** (multi-chain). Settlement design uses **tokenized JGB (TJGB) as collateral** (tokenizing only the economic rights of book-entry JGBs). `[reporting: Brave New Coin, Coingeek, BigGo]`

**DCJPY (DeCurret DCP) — tokenized DEPOSIT, not a stablecoin.** **Japan Post Bank** to introduce tokenized-deposit services using DCJPY **by FY2026**; permissioned network backed by MUFG; GMO Aozora Net Bank a named minting institution. Distinct category (bank money on-chain). `[reporting: CMC Academy]`

### South Korea
**KRW won stablecoin landscape. Status: PRE-LAUNCH (bills pending).** Two camps: an **8-bank consortium** (KB Kookmin, Shinhan, Woori, NongHyup, IBK, Suhyup, Standard Chartered Korea, +) developing a shared won stablecoin; and a **non-bank/platform camp** — **KakaoPay/KakaoBank** (Dec 2025 consortium; KakaoBank in development) and **Naver Financial** (via a ~US$10.3B acquisition of **Dunamu/Upbit**, Nov 2025). A government-sponsored bill is expected **by end-2026**; debate over whether any company with ≥₩500M equity may issue (lawmakers) vs banks-only (Bank of Korea); BoK's retail "digital won" reportedly **paused** in favour of letting stablecoins develop. No issuer/license/reserve/supply yet. `[reporting: The Block, Korea Times, Tiger Research, CCN]`

### Hong Kong
**HKD stablecoins under the Stablecoins Ordinance (2025). Status: first licences awarded; launches H2 2026.** Ordinance passed **2025-05-21**, regime live **2025-08-01**; issuing a fiat-referenced stablecoin needs an **HKMA licence**; reserves ≥100%, eligible HQLA, segregated, **currency-matched** (with an HKD/USD exception for HKD coins); 2026 standards require **real-time public + regulator data feeds** to verify 1:1 backing. **First licences effective 2026-04-10** (36 applications by the 2025-09-30 deadline):
- **HSBC (FRS02)** — HKD stablecoin planned **H2 2026**, integrated into PayMe / HSBC HK App.
- **Anchorpoint Financial (FRS01)** — JV of **Standard Chartered (HK), HKT, Animoca Brands**; phased issuance from Q2 2026.
- Sandbox (announced 2024-07-18): StanChart (HK), Animoca, JD Coinlink, RD InnoTech, HKT; **JD reportedly not in the first licence round.** `[independently observable: HKMA, CoinDesk, FinanceFeeds]` HSBC/Anchorpoint reserve composition: `[no independent source found — pre-launch]`

**Offshore RMB (CNH) stablecoins from Hong Kong. Status: PRE-LAUNCH / lobbying.** **JD.com and Ant Group lobbying** to issue a CNH-backed stablecoin from HK; but on **2025-09-23 China's CSRC informally asked some mainland brokerages to pause HK RWA-tokenization** and rein in pro-stablecoin research — a dual track (control on the mainland, controlled incubation in HK). The first HK licences (HSBC/Anchorpoint) are **HKD, not CNH.** No HK-licensed CNH coin yet. `[reporting: Macao News, Reuters via CKGSB, CIGI]`

### China / offshore RMB
**AxCNH (AnchorX) — offshore yuan (CNH). NEW — LIVE, but Kazakhstan-licensed (not HK/SG).** Issued by **AnchorX** on the **Conflux** blockchain (Chinese-government-supported); CNH-pegged 1:1 for Belt-and-Road trade settlement. **Launched 2025-09-17 in Kazakhstan** under the **AFSA** (in-principle approval June 2025) — "world's first regulated offshore yuan-linked stablecoin." **>>> Independent negative signal: the HKMA issued a public warning against AnchorX for marketing AxCNH without an HKMA licence.** Reserve: "offshore CNH cash reserves" in custodial banks (no gov-bond claim). Trades on ATAIX (Kazakhstan), professional clients only. `[independently observable: Phemex, CryptoRank, AFSA reporting; HKMA warning independently observable]` Supply / contract / custodian / attestation: `[no independent source found]`

**e-CNY (PBoC)** — CBDC, not a stablecoin; world's largest pilot (>US$2.3T cumulative by late 2025; reported first interest-bearing CBDC Jan 2026; cross-border via mBridge). Sovereign liability. `[independently observable: Atlantic Council]`

**Asia re-verify:** XSGD supply (18M–42M divergence); IDRX issuer entity (the "Hashnote" conflation) and contract addresses; PHPX live status/token ID; reserve % splits (open attestation PDFs for StraitsX, JPYC's 80% JGB, USDG Treasuries); HKMA Register of Licensed Stablecoin Issuers; AxCNH supply/contract/custodian.

---

## 4. Africa

### Nigeria
**cNGN ("Compliant Naira") — the flagship regulated naira stablecoin. >>> GOV-BOND <<< LIVE since Feb 2025.**
- *Say:* Issued by **WrappedCBDC Ltd**, a JV of the **African Stablecoin Consortium** (Convexity Technologies, Interstellar, AlphaGeeks); 1:1 naira; "operates alongside, not replaces" the eNaira; multi-chain (native **Bantu**, plus Ethereum, BNB, Polygon, Base, AssetChain; Tron TBD). `[project's own claim]`
- *Observable:* **SEC Nigeria Approval-in-Principle Aug 2024** under the Accelerated Regulatory Incubation Programme; brought under the **Investments and Securities Act 2025** (digital assets = securities; mandates reserve backing, AML/KYC, audit). Listed on SEC-licensed exchanges **Busha** then **Quidax (2025-03-19)**. **>>> GOV-BOND <<<** reserve as of **Oct 2025 ≈ 54% commercial-bank deposits + 46% Treasury bills + a CardinalStone money-market fund** — Nigerian T-bills = sovereign paper. Adoption (dated): ~4,400 tokens/13 holders at launch (Feb 2025) → ₦121.3M / ~127 wallets (Mar 2025) → daily volume >₦1bn, circulating ₦603.9M, >832 wallets (Aug 2025); WrappedCBDC says **~1 billion cNGN issued cumulatively** by Dec 2025 (cumulative ≠ circulating). Contract addresses published at docs.cngn.co (e.g., Ethereum `0x17CDB2a01e7a34CbB3DD4b83260B05d0274C8dab`, Base `0x46C85152bFe9f96829aA94755D9f915F9B10EF5F`). `[independently observable: TechCabal, Mariblock, CoinGeek; ISA 2025; reserve re-verify]`
- *Couldn't find:* a published independent reserve attestation (unlike ZARP); explorer-confirmed June-2026 supply; the T-bills-vs-MMF split inside the 46%. `[no independent source found]`

**NGNC (LINK.IO LTD, UK).** "Fully reserved" naira stablecoin, native on **Stellar** (also Polygon/Solana/Avalanche); originated via a Stellar Community Fund submission (active 2023–2024, predates cNGN); **no Nigerian SEC/ARIP licence found — appears unregulated; likely minor/dormant.** `[independently observable: Stellar Community Fund; status uncertain]`

**eNaira (CBN CBDC — context).** Launched Oct 2021 (Africa's first CBDC); **adoption struggled** (~0.36% of currency in circulation Q1 2024; ~13M wallets but ~98.5% never used; IMF called adoption "disappointingly low"). **Oct 2025: CBN formed a task force to explore an "official stablecoin,"** signalling a possible pivot. `[independently observable: CBN bulletin, IMF]`

**Zone (regulated blockchain network — settlement rail, not an issuer).** Formerly Appzone; "Africa's first regulated Layer-1 for fiat payments," connecting banks; by Apr 2025 processed **₦1tn (~$636M) across ~100M transactions**; Aug 2024 NIBSS partnership. Settles **naira on its own regulated chain** — genuine on-chain local-currency value, but **not a freely transferable public-chain naira token** like cNGN. `[independently observable: TechCabal]`

### South Africa
**ZARP — rand stablecoin. LIVE, full cash reserves (no gov bonds).** Issued by **Rand Reserve** (project "ZARP Stablecoin"; "Inverbit" likely the dev/operator, unconfirmed); ERC-20, 1:1 ZAR. **Not legal tender; not endorsed by SARB.** Reserve managed by **Old Mutual Wealth**, **independently attested by Kempen Audit** (R87,542,702.94 as of 2025-09-04); smart-contract audit by Solidity Finance; **reserve is full cash — NO government-bond/supranational backing.** Contracts: Ethereum `0x8CB24ed2e4f7e2065f4eB2bE5f6B0064B1919850`, Base `0xb755506531786C8aC63B756BaB1ac387bACB0C04` (plus an old Ethereum token). **Supply figure inconsistent** (one aggregator ~60,450 ZARP vs R87.5M reserve — likely per-chain; re-verify). `[independently observable: Kempen attestation, explorers; supply caveat]`
- **"ZAR Supercoin"** — a newer rand-backed coin reported; details thin/unverified.
- **SARB / IFWG:** IFWG published a **"South African Stablecoin Landscape Diagnostic" (Mar 2025)**; discussion papers due 2026. **SARB Financial Stability Review (2025-11-25)** classified crypto/stablecoins as a structural financial-stability risk; combined Luno/VALR/Ovex users **7.8M by end-July 2025**; stablecoin volumes **~R80bn** (stablecoins overtook Bitcoin since 2022). **FSB (Oct 2025): SA has no stablecoin framework yet.** `[independently observable: IFWG PDF, SARB FSR, Moneyweb]`

### Kenya
**No live KES stablecoin.** The **VASP Act took effect Nov 2025** (joint Central Bank of Kenya + Capital Markets Authority oversight; **KES 500M (~$3.85M)** issuer capital bar) and **explicitly calls for a Kenyan-shilling-pegged stablecoin to reduce USD reliance** — aspiration, not yet issued. "M-Pesa goes blockchain" narratives (Jan 2026) are promotional/unconfirmed. `[independently observable: Mariblock, Afriwise]`

### Ghana
**No confirmed live cGHS token.** Bank of Ghana says it **could** pursue a cedi-backed stablecoin (monitoring stage). The **Virtual Asset Service Providers Act 2025 (Act 1154)** legalised crypto incl. stablecoins (joint BoG + SEC); **Feb 2026 BoG launched a regulatory sandbox (6 fintechs, incl. issuance).** **eCedi** CBDC retail launch "expected by year-end." `[independently observable: News Ghana, BitcoinKE Feb 2026]`

### Others
- **Senegal / CFA franc:** historic **eCFA** (2016, blockchain digital currency); a separate private **eCFA stablecoin** pegged 1:1 to CFA francs is **fully collateralised by EUR at a custodian bank** (CFA is euro-pegged) — foreign-currency backing, no gov-bond claim; scale unverified/likely small. `[project's own claim; no supply/regulator source]`
- **Egypt, Morocco, Tanzania, Uganda, Ethiopia, Mauritius:** **no live local-currency stablecoin found**; activity is CBDC exploration (e.g., Morocco–Egypt cross-border CBDC experiment, July 2025). `[no independent source found]`

### Pan-African infrastructure — local-currency token vs USD-stablecoin rails
**KEY DISTINCTION: most pan-African "stablecoin" rails do NOT issue local-currency tokens — they on/off-ramp local fiat into USD stablecoins (USDC/USDT) for settlement, then pay out local fiat.** Genuine local-currency *tokens* (cNGN, ZARP, NGNC) are the exception.
- **Yellow Card** — largest licensed stablecoin-infra provider (~20 countries); integrates mobile money + local fiat on the ramp, but **settlement is USDC/USDT** (Circle partnership for USDC payouts in Nigeria). **USD-stablecoin rail.** `[independently observable: Techpression]`
- **Onafriq (ex-MFS Africa)** — partnered with **Conduit (Feb 2026)** to use **USDC** for treasury settlement. **USD-stablecoin rail.** `[independently observable: BitKE, Technext]`
- **Juicyway** (Lagos) — runs liquidity pools for NGN/USD/GBP; on-chain NGN liquidity/FX orchestration but **not a confirmed fiat-redeemable naira token.** `[project's own claim]`
- **Mansa** (Dubai) — on-demand **USD-stablecoin (Tether-backed) liquidity** for African PSPs; not a local-currency issuer. `[independently observable: TechCrunch]`
- **Bitmama, VertoFX** — appear to be exchanges/FX/remittance using USD stablecoins; not tied to local-currency token issuance. `[no independent source found]`

---

## Government-bond & supranational backing — consolidated

| Token / effort | Jurisdiction | Sovereign/gov-bond exposure | Status |
|---|---|---|---|
| **JPYC** | Japan | **~80% JGBs** + deposits (most explicit) | LIVE (Oct 2025) |
| **XSGD** | Singapore | cash + **SG government / public-entity short-term notes** | LIVE |
| **cNGN** | Nigeria | ~54% deposits + **~46% Treasury bills + MMF** | LIVE (Feb 2025) |
| **Japan megabank coin (Progmat)** | Japan | **tokenized JGB collateral** in settlement design | Pre-launch (Mar 2026) |
| **G-Token** | Thailand | IS a tokenized **government bond** (not a stablecoin) | LIVE |
| **THB stablecoin** | Thailand | proposed **government-bond-backed** | Pre-launch |
| **ARC** | India | **G-Secs + T-Bills** (rationale: boost gov-debt demand) | Pre-launch (Q1 2026 target) |
| **EURC** (comparator) | EU | short-duration EU **sovereigns** | LIVE |
| **ZARP** | South Africa | **full cash — NO gov bonds** | LIVE |
| **AxCNH** | CNH (Kazakhstan-licensed) | **cash CNH — NO gov bonds** | LIVE |

**>>> SUPRANATIONAL <<< No stablecoin in Asia or Africa is backed by World Bank / ADB / AfDB / IMF (SDR) or other supranational paper.** A multilateral-paper-backed disbursement instrument would be greenfield for an MDB. `[no independent source found — cross-confirmed across all regional passes]`

---

## Sources

Marked **(M)** issuer/own-marketing, **(I)** independent reporting, **(P)** primary/official (regulator, central bank, explorer, attestation). All 403-blocked to direct fetch this session; read via search summaries. Full per-track source lists are in `research/notes/scratch/09-altcurrency-india-southasia.md`, `10-altcurrency-seasia-eastasia.md`, `11-altcurrency-africa.md`.

### India & South Asia
- (I) ARC: https://www.coindesk.com/markets/2025/11/20/india-s-debt-backed-arc-token-eyes-tentative-january-2026-debut-sources-say (403) ; https://coinjournal.net/news/india-taps-polygon-and-anq-for-its-rupee-backed-stablecoin-set-to-launch-in-early-2026/ ; https://coinpedia.org/news/india-to-launch-arc-token-stablecoin-backed-by-government-securities/
- (I) RBI stance: https://www.business-standard.com/amp/finance/news/stablecoins-can-undermine-trust-in-currency-and-financial-system-rbi-dg-125121201114_1.html ; https://www.medianama.com/2025/12/223-stablecoins-add-no-value-rbi-deputy-governor-cbdc-superior/ ; (I) gov/RBI split https://cointelegraph.com/news/india-government-consider-stablecoin-framework-diverge-rbi
- (I) legal/FEMA: https://corporate.cyrilamarchandblogs.com/2025/10/fig-paper-no-51-vda-series-7-stablecoins-recent-indian-and-global-regulatory-trends/ (403) ; https://www.legal500.com/developments/thought-leadership/stablecoins-in-india-a-regulatory-conundrum/
- (P) e-rupee / tokenized deposits: https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=1882883 ; https://cbdctracker.hrf.org/currency/india ; (I) https://www.business-standard.com/economy/news/rbi-deposit-tokenisation-pilot-cbdc-wholesale-digital-tokens-oct8-125100700532_1.html ; (P) IFSCA https://ifsca.gov.in/CommonDirect/ViewFile?id=21626bde60601ef44a0ed02201da7b0c&fileName=Draft_Public_Consultation_Paper__FinTech_Sandbox_Framework_Approved_19092025_20250919_0655.pdf
- (I) Pakistan: https://www.dawn.com/news/1959364 ; https://www.arabnews.com/node/2635493/amp ; https://www.coindesk.com/policy/2026/04/15/pakistan-lifts-seven-year-ban-allowing-banks-to-service-virtual-asset-providers
- (I) Bangladesh/Sri Lanka/Nepal: https://coingeek.com/bangladesh-exploring-cbdc-as-an-alternative-to-risky-private-digital-currencies/ ; https://cbdctracker.hrf.org/currency/sri-lanka ; https://cbdctracker.hrf.org/currency/nepal

### Southeast & East Asia
- (M) StraitsX XSGD + attestations: https://www.straitsx.com/xsgd ; https://www.straitsx.com/blog-post/xsgd-december-2025-attestation-reports-now-available ; (P) Etherscan https://etherscan.io/token/0x70e8de73ce538da2beed35d14187f6959a8eca96 ; (I) MAS licences https://fintechnews.sg/98450/digitalassets/straitsx-secures-mas-licenses-for-stablecoin-issuance-crypto-payments/
- (M) IDRX https://home.idrx.co/ ; (M) RupiahToken https://rupiahtoken.com/ ; (P) Polygonscan PHPC https://polygonscan.com/token/0x87a25dc121Db52369F4a9971F664Ae5e372CF69A ; (I) PHPC exits sandbox https://bitpinas.com/regulation/phpc-exits-sandbox/ ; (I) PHPX https://www.ledgerinsights.com/filipino-banks-plan-to-launch-multi-issuer-stablecoin-phpx-on-hedera-dlt/
- (I) Malaysia DAIH https://www.theasianbanker.com/press-releases/bank-negara-malaysia-onboards-ringgit-stablecoin-and-tokenised-deposit-pilots-under-digital-asset-innovation-hub
- (I) Thailand G-Token https://www.blockhead.co/2025/09/02/thailand-moves-toward-launch-of-worlds-first-publicly-offered-tokenized-government-bond/ ; (I) THB stablecoin https://www.ledgerinsights.com/thai-government-stablecoin-baht/
- (I) Vietnam https://blogs.duanemorris.com/fintech/2025/09/12/vietnam-introduces-pilot-program-for-virtual-asset-market-what-you-must-know/ ; https://www.wfw.com/articles/landmark-legislation-regulates-digital-assets-in-vietnam/
- (I) JPYC https://www.elliptic.co/media-center/elliptic-enables-jpyc-to-become-japans-first-fsa-approved-yen-stablecoin ; https://iolite.net/en/news/jpyc-ex-launch-stablecoin-20251027 ; (I) Japan megabank coin https://coingeek.com/japan-big-3-banks-stablecoin-trial-gets-regulatory-green-light/ ; (I) DCJPY https://coinmarketcap.com/academy/article/japan-post-bank-plans-dcjpy-token-launch-2026
- (I) Korea https://www.theblock.co/post/380493/kakaobank-advances-stablecoin-initiative ; https://reports.tiger-research.com/p/korea-stable-coin-eng
- (P) HKMA stablecoin regime https://www.hkma.gov.hk/eng/key-functions/international-financial-centre/stablecoin-issuers/ ; (I) HK first licences https://www.coindesk.com/policy/2026/03/24/hong-kong-awards-first-stablecoin-licenses-to-hsbc-standard-chartered-led-group
- (I) AxCNH https://phemex.com/news/article/kazakhstan-launches-first-regulated-offshore-yuan-stablecoin-axcnh-22375 ; (I) offshore-RMB-from-HK https://www.cigionline.org/articles/offshore-rmb-stablecoins-and-the-future-of-money-will-china-join-the-global-race/
- (analysis) Tiger Research 2026 Asia Stablecoin Market Overview https://reports.tiger-research.com/p/2026-asia-stablecoin-market-overview-eng

### Africa
- (I) cNGN https://techcabal.com/2025/12/12/wrappedcbdc-is-building-a-rail-to-move-naira-faster/ ; https://techcabal.com/2025/03/19/quidax-nigeria-lists-cngn/ ; https://www.mariblock.com/stories/naira-pegged-stablecoin-cngn-launches-lists-on-exchanges ; (M/docs) https://docs.cngn.co/integrations/contract-addresses ; (reference) https://en.wikipedia.org/wiki/CNGN
- (P) eNaira https://cbdctracker.hrf.org/currency/nigeria ; (IMF) https://www.imf.org/-/media/files/publications/ftn063/2024/english/ftnea2024005.pdf ; (I) CBN stablecoin task force https://markets.financialcontent.com/.../breakingcrypto-2025-10-22-nigeria-charts-new-digital-course-cbn-forms-task-force-for-official-stablecoin
- (I) Zone https://techcabal.com/2025/03/07/zone-processes-1-trillion/
- (M) ZARP https://www.zarpstablecoin.com/transparency.html ; (P) explorers https://ethplorer.io/address/0x8cb24ed2e4f7e2065f4eb2be5f6b0064b1919850 ; https://basescan.org/token/0xb755506531786C8aC63B756BaB1ac387bACB0C04
- (P) IFWG diagnostic https://www.ifwg.co.za/Reports/IFWG%20South%20African%20Stablecoin%20Landscape%20Diagnostic.pdf ; (P) SARB FSR https://www.resbank.co.za/content/dam/sarb/.../The%20financial%20stability%20considerations%20of%20stablecoins.pdf ; (I) https://www.moneyweb.co.za/moneyweb-crypto/south-africa-flags-crypto-stablecoins-as-new-financial-risk/
- (I) Kenya https://www.mariblock.com/kenya-edges-toward-crypto-regulation-as-parliament-passes-vasp-bill/ ; (analysis) https://www.afriwise.com/blog/kenya-now-has-a-crypto-law-virtual-asset-service-providers-vasp-bill-2025
- (I) Ghana https://bitcoinke.io/2026/02/ghana-crypto-regulatory-sandbox/ ; https://www.newsghana.com.gh/bank-of-ghana-advances-digital-asset-regulation-framework/
- (M) eCFA stablecoin https://ecfa.washingtonf.com/ ; (P) Atlantic Council CBDC tracker https://www.atlanticcouncil.org/cbdctracker/
- (I) pan-African rails: Yellow Card/Circle https://techpression.com/yellow-card-and-circle-team-up-to-power-real-time-usdc-payouts-in-nigeria/ ; Onafriq/Conduit https://bitcoinke.io/2026/02/onafriq-partners-with-conduit/ ; Mansa https://techcrunch.com/2025/02/19/tether-backs-stablecoin-liquidity-provider-mansa-in-10m-seed-round

*Synthesized from three parallel regional research passes (India/South Asia; Southeast & East Asia; Africa). Full per-region detail and complete source lists are in the scratch files referenced above. The 403 caveat applies to all on-chain/supply figures; re-verification lists are embedded per section.*
