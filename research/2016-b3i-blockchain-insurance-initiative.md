# B3i (Blockchain Insurance Industry Initiative) — Research Dossier

> **Compiled:** June 2026
> **Subject:** B3i / **B3i Services AG** — the insurance-industry blockchain consortium (2016–2022): its founding, members, leadership, technology (Hyperledger Fabric → R3 Corda), products (Cat XoL, "Fluidity"), funding, real-world adoption, and its July 2022 collapse — with a peer comparison and lessons for RIZK.
> **Companion file:** [`2016-allianz-nephila-catbond-blockchain.md`](./2016-allianz-nephila-catbond-blockchain.md). B3i was founded (Oct 2016) ~4 months *after* the Allianz × Nephila cat-swap pilot (Jun 2016); Allianz was a founder of both, but they were **separate efforts** with different technology.
>
> **Sourcing caveat (read first):** Every trade-press and corporate domain in this space (Ledger Insights, Insurance Journal, Reinsurance News, Intelligent Insurer, Artemis, Munich Re, b3i.tech, even the Swiss registry pages) returned **HTTP 403 to automated fetching**. Facts below are assembled from search-engine extracts **cross-corroborated across multiple independent outlets**, plus company-registry aggregators (Moneyhouse/Northdata). Core facts are high-confidence; figures that are genuinely undisclosed or single-sourced are flagged in [§13](#13-key-uncertainties--conflicting-claims). Verify verbatim quotes against a primary copy before publishing.

---

## Contents
1. [TL;DR](#1-tldr)
2. [What B3i was — founding & mission](#2-what-b3i-was--founding--mission)
3. [Membership & corporate structure](#3-membership--corporate-structure)
4. [Leadership & governance](#4-leadership--governance)
5. [Technology: Fabric → Corda](#5-technology-hyperledger-fabric--r3-corda)
6. [Products: Cat XoL, B3i Re & Fluidity](#6-products-cat-xol-b3i-re--fluidity)
7. [Funding history](#7-funding-history)
8. [Milestones & the adoption reality check](#8-milestones--the-adoption-reality-check)
9. [The April 2022 world-first](#9-the-april-2022-world-first)
10. [The collapse (July 2022)](#10-the-collapse-july-2022)
11. [Aftermath](#11-aftermath)
12. [Peer comparison: who survived, who died](#12-peer-comparison-who-survived-who-died)
13. [Key uncertainties & conflicting claims](#13-key-uncertainties--conflicting-claims)
14. [Relevance to RIZK](#14-relevance-to-rizk)
15. [Full source list](#15-full-source-list)

---

## 1. TL;DR

| | |
|---|---|
| **What** | An industry-wide consortium to build shared **distributed-ledger (DLT) infrastructure** for (re)insurance |
| **Founded** | **19 October 2016**, by 5 (re)insurers: **Aegon, Allianz, Munich Re, Swiss Re, Zurich** |
| **Incorporated** | **B3i Services AG**, Zurich, **23 March 2018** (reg. CHE-204.812.908) |
| **Members** | 5 (2016) → 15 (Feb 2017) → ~38 testing community (Oct 2017) → **~20–21 shareholders** at peak |
| **Leadership** | **Paul Meeusen** (founding CEO, ex-Swiss Re DLT head) → **John Carolin** (CEO 2019→wind-down); CTO **Markus Tradt** (ex-Munich Re); chair **Gerhard Lohmann** (Swiss Re) |
| **Tech** | IBM **Hyperledger Fabric** (2016–17) → **switched to R3 Corda** (Jun 2018); platform branded **"Fluidity"** |
| **Flagship product** | **Property Cat XoL** (catastrophe excess-of-loss) reinsurance contract placement; later **B3i Re** |
| **Total raised** | **~$23M** lifetime (CHF 6.3M at incorporation → ~$16M in 2019 → undisclosed Series B 2020) |
| **Real adoption** | **Exactly one** confirmed legally-binding live transaction (Allianz↔Swiss Re, **Apr 2022**) — everything else was prototypes, betas, and **parallel runs / re-creations** |
| **Fate** | **Filed for insolvency, ceased trading ~29 July 2022** after a failed funding round; now "B3i Services AG in Liquidation" |
| **Why it died** | **Insufficient transaction volume/demand + consortium governance + no network effects** — *not* a technology failure |

**The one-sentence story:** B3i assembled ~20 of the world's largest (re)insurers and ~$23M to put reinsurance on a blockchain, achieved a single "world-first" legally-binding contract between two of its own founders in April 2022 — and **collapsed three months later** because real transaction volume never materialised and its shareholders declined to fund it further.

---

## 2. What B3i was — founding & mission

B3i — the **Blockchain Insurance Industry Initiative** — was launched on **19 October 2016** by five insurers/reinsurers: **Aegon, Allianz, Munich Re, Swiss Re, and Zurich Insurance**. Its stated mission was to *"explore the potential of distributed ledger technologies to better serve clients through faster, more convenient and secure services"* — i.e., use a shared ledger to strip cost, reconciliation, and friction out of the (re)insurance value chain. ([Aegon](https://www.aegon.com/newsroom/news/2016/Insurers-and-reinsurers-launch-Blockchain-initiative-B3i/), [Munich Re](https://www.munichre.com/en/company/media-relations/media-information-and-corporate-news/corporate-news/2016/2016-10-19-insurers-and-reinsurers-launch-blockchain-initiative-b3i.html))

The thesis: in reinsurance, the same contract data is re-keyed and reconciled by every counterparty (cedent, broker, reinsurer), largely over **email and spreadsheets**, creating version-control errors, delays, and audit cost. A single shared, immutable record — "contract certainty" — would let all parties see one agreed state of the contract at all times.

---

## 3. Membership & corporate structure

**Membership timeline:**
- **19 Oct 2016 — 5 founders:** Aegon, Allianz, Munich Re, Swiss Re, Zurich.
- **6 Feb 2017 — expanded to 15:** added Achmea, Ageas, Generali, Hannover Re, Liberty Mutual, RGA, SCOR, Sompo Japan Nipponkoa, Tokio Marine, XL Catlin. ([Insurance Journal](https://www.insurancejournal.com/news/international/2017/02/06/440629.htm), [Munich Re](https://www.munichre.com/en/company/media-relations/media-information-and-corporate-news/corporate-news/2017/2017-02-06-munich-re-blockchain-initiative-b3i-gains-truly-international-scope.html))
- **2 Oct 2017 — 23 more join market-testing:** AIA, AIG, Aon, Chubb, Covéa, Everest Re, Gen Re, Guy Carpenter, JLT Re, Mapfre Re, PartnerRe, QBE Re, Sava Re, Willis Re and others — bringing the testing community to **~38 companies**. ([CoinDesk](https://www.coindesk.com/markets/2017/10/02/aia-and-aig-join-b3i-as-blockchain-consortium-adds-23-members/))

**Incorporation — B3i Services AG:**
- Incorporated as a Swiss stock corporation (AG) in **Zurich on 23 March 2018** (public announcement ~26 Mar 2018), to commercialise the technology as an independent entity with its own capital and IP. ([Insurance Journal](https://www.insurancejournal.com/news/international/2018/03/26/484363.htm))
- **13 founding shareholders:** Achmea, Aegon, Ageas, Allianz, Generali, Hannover Re, Liberty Mutual, Munich Re, SCOR, Swiss Re, Tokio Marine, XL Catlin, Zurich. *(Note: this list omits RGA and Sompo, two of the Feb-2017 fifteen — reason not documented.)* ([AXA XL](https://axaxl.com/press-releases/b3i-founders-form-blockchain-startup))
- Registered office: **Kreuzstrasse 26, Zürich**; Swiss commercial-register ID **CHE-204.812.908**. ([Northdata](https://www.northdata.com/B3i%20Services%20AG,%20Z%C3%BCrich/CHE-204.812.908))
- **Shareholder base grew to ~20–21** by 2020–21, adding (among others) **SBI Group** (Japan, 2019), **Türk Reasürans** (2020), AXA, Africa Re, China Pacific (CPIC), Deutsche Rück, IRB Brasil Re, Mapfre Re, VIG Re — "from five continents with offices in over 100 countries."

The structural fact that matters: **B3i was a consortium of direct competitors** who became **co-shareholders** in a startup they jointly governed and had to repeatedly re-fund.

---

## 4. Leadership & governance

**Executives:**
- **Paul Meeusen — founding CEO / Managing Director.** Ex-**Swiss Re** (18 years; Head of Finance & Treasury Global Business Solutions, then **Head of Distributed Ledger Technology**; designed Swiss Re's first blockchain use case, a 2016 retrocession PoC on Ethereum); 8 prior years at PwC. Led B3i until **March 2019**, then stayed as board adviser; later VP Partnerships at DFINITY. ([The Blockchain and Us](https://theblockchainandus.com/paul-meeusen/), [Ledger Insights](https://www.ledgerinsights.com/blockchain-insurance-b3i-ceo-john-carolin/))
- **John Carolin — CEO (mid-2019 → wind-down).** Joined as **CFO** at incorporation (Mar 2018), became acting CEO Mar 2019, permanent CEO announced **17 July 2019**; risk-transfer + tech/entrepreneurship background; led B3i through to insolvency. ([Insurance Journal](https://www.insurancejournal.com/news/international/2019/07/17/532553.htm))
- **Markus Tradt — CTO.** Previously ran **Munich Re's global blockchain initiative**; technical lead for the **Hyperledger Fabric → Corda** migration; appointed to the Corda Network Foundation board. ([Reinsurance News](https://www.reinsurancene.ws/b3is-markus-tradt-joins-board-of-corda-network/))
- **Sylvain de Crom — Chief Product Officer.**

**Board / chair:**
- **First chairman (Mar 2018): Dr. Gerhard Lohmann**, then **CFO Reinsurance at Swiss Re**. ([S&P Global](https://www.spglobal.com/marketintelligence/en/news-insights/trending/6yuk-rzwjki80lpydm0ndw2))
- **Mar 2019 reshuffle:** Lohmann replaced as Swiss Re's representative by **Theo Bachmann**; board comprised shareholder reps incl. Antony Elliot (Zurich), Paolo Bagnasco (Generali), Bob Crozier (Allianz), Tom Hutton (XL Innovate), Adrian Jones (SCOR), Chris Madsen (Aegon), Anton van der Linden (Achmea), Daniel Quermia (Mapfre Re). ([Reinsurance News](https://www.reinsurancene.ws/b3i-raises-a-further-16-million-shuffles-board/))

**Headcount:** ~40 (note: "40" is ambiguous in sources — it refers both to a **community of 40+ member companies** and, separately, to **~40 employees**; the two are often conflated). HQ Zurich; no additional offices verified.

**Governance model (and its central flaw):** decisions ran through a **shareholder board dominated by competing insurers**, so strategy required alignment among rivals. Post-mortem framing: *"a unique combination of 'traditional' (slow) partners trying to behave like a startup, while … introducing a new, relatively immature technology."* Swiss Re executives judged it *"conceptually interesting, but [it] required an end-to-end view."* ([Intelligent Insurer](https://www.intelligentinsurer.com/insurance/b3i-forced-to-shut-down-after-major-re-insurers-pull-the-plug-29965), [Reinsurance News](https://www.reinsurancene.ws/b3i-conceptually-interesting-but-required-end-to-end-view-swiss-re-execs/))

---

## 5. Technology: Hyperledger Fabric → R3 Corda

**Era 1 — IBM / Hyperledger Fabric (2016–2017).** The first prototype was built on **IBM Blockchain, leveraging Hyperledger Fabric 1.0** — a distributed smart-contract management system for **Property Cat XoL** contracts, covering contract setup, premium settlement, and claim settlement. Members estimated a **productivity gain of up to ~30%** with lower admin cost. ([Munich Re](https://www.munichre.com/en/company/media-relations/media-information-and-corporate-news/corporate-news/2017/2017-09-10-B3i-launches-working-reinsurance-blockchain-prototype.html), [SCOR](https://www.scor.com/en/news/b3i-presents-its-smart-contract-management-system-2017-monte-carlo-rvs-conference))

**The pivot — switch to R3 Corda (announced 18 June 2018).** After an evaluation against four "critical success factors" — **data privacy, scalability, interoperability, developer productivity** — B3i **abandoned Hyperledger Fabric and rebuilt on R3's Corda (Enterprise edition)**. The decisive technical reason was privacy: **Corda shares data only at the transaction level between the involved parties** (there is *no* globally broadcast/shared ledger), which suits confidential reinsurance deals. Rival consortium RiskBlock moved to Corda shortly after, making Corda the de-facto insurance-DLT standard. ([Ledger Insights](https://www.ledgerinsights.com/b3i-insurance-blockchain-switch-corda/), [CoinDesk](https://www.coindesk.com/markets/2018/06/18/insurance-group-b3i-endorses-r3s-corda-blockchain-platform))

> The re-platforming meant the 2017 Fabric prototype was effectively thrown away — a costly mid-course pivot that reflected unsettled technical strategy.

**Technical design (Corda era):** permissioned DLT; each participant runs a **Corda node** (integrable into existing IT); **no global shared ledger** — transactions shared only between counterparties (+ a notary); the value proposition was a **"single source of truth"** with an **immutable** contract record delivering **contract certainty**. B3i built smart-contracting **compatible with ACORD standards** and co-chaired a new **ACORD blockchain standards** group (with RiskBlock) so data could move between networks. ([Insurance Journal](https://www.insurancejournal.com/news/international/2019/10/15/545507.htm), [Reinsurance News](https://www.reinsurancene.ws/b3i-to-co-chair-new-acord-blockchain-standards-group/))

---

## 6. Products: Cat XoL, B3i Re & Fluidity

- **Property Cat XoL reinsurance application (flagship).** **Cat XoL v1.0** — the first product on Corda — was released to community members in **July 2019** (on a Corda 4.0 node on the global Corda Network created 15 Jul 2019), then **deployed to customers' production environments on 15 Oct 2019** ahead of the January 2020 renewals. It supported treaty creation, negotiation workflow, agreeing rates/terms, binding, and **multi-layer / nested-section** Cat XoL structuring. Stated benefits: less manual placement effort, improved contract certainty, reduced operational risk. ([CoinDesk](https://www.coindesk.com/markets/2019/07/31/blockchain-insurance-group-b3i-launches-first-product-on-r3s-corda/), [Insurance Journal](https://www.insurancejournal.com/news/international/2019/10/15/545507.htm))
- **B3i Re.** A reinsurance platform billed as the **first DLT application for the reinsurance market**, extending Cat XoL functionality "across the value chain," built on **Corda Enterprise** under the **"B3i Fluidity"** brand. ([R3 case study](https://developer.r3.com/case-studies/b3i/), [Intelligent Insurer](https://www.intelligentinsurer.com/news/launch-of-b3i-re-expands-functionality-of-cat-xol-across-the-value-chain-23405))
- **Fluidity (the platform/ecosystem).** Described as *"the heart of the B3i ecosystem"* — reusable components/libraries to accelerate building of compliant, interoperable CorDapps by B3i **and third-party developers**, with an explicit **distribution/monetisation** ambition (an app-store-like marketplace vision). ([Reinsurance News](https://www.reinsurancene.ws/b3i-announces-first-live-partner-application-on-fluidity-platform/))
- **Ritablock** (Reinsurance Technical Accounting Blockchain) — the **first live partner application** on Fluidity; a technical-accounting CorDapp integrating with mainstream reinsurance accounting platforms (PRORIS, SAP FS-RI, SICS). ([Ledger Insights](https://www.ledgerinsights.com/b3i-reinsurance-accounting-blockchain-ritablock/))
- **Other use cases:** a **nuclear insurance pool** DLT project; partnerships with **TCS** and **msg**; a "re-inlab" innovation initiative (Mar 2021). ([Ledger Insights](https://www.ledgerinsights.com/blockchain-platform-b3i-wins-nuclear-insurance-project/))

---

## 7. Funding history

| Date | Event | Amount | Cumulative | Backers |
|---|---|---|---|---|
| **23 Mar 2018** | Incorporation of B3i Services AG | **~CHF 6.3M (~$6.35M)** | ~CHF 6.3M | 13 founding shareholders |
| **Feb–Mar 2019** | Capital increase (reported by CoinDesk 25 Mar 2019) | **~$16M** = CHF 8.27M cash **+** CHF 7.9M converted debt | **CHF 22,475,945 (~$22.6M)** | 16 shareholders; board of 9 formed |
| **May 2019** | SBI Group joins (via SBI AI&Blockchain Fund) | **~CHF 1.9M** | — | **17th shareholder** |
| **16 Dec 2020** | **Series B — first close**; Türk Reasürans joins | Undisclosed (≥ CHF 3.6M new preference shares issued) | not disclosed | **21 backers** |
| **2021–22** | Attempted further round | **Target never disclosed** | — | **FAILED → insolvency** |

- **Lifetime total: most defensibly ~$23M** (≈$22.6M by early 2019 + SBI + an undisclosed Series B). Third-party trackers diverge wildly — **PitchBook lists $65.2M** (appears inflated vs. Swiss-register data) and an **~$43.9M valuation (Aug 2019)** — treat both as unverified. ([CoinDesk](https://www.coindesk.com/markets/2019/03/25/blockchain-insurance-consortium-b3i-quietly-raises-16-million/), [Ledger Insights](https://www.ledgerinsights.com/major-insurers-pull-the-plug-on-b3i-insurance-blockchain-consortium/))
- **"Series A" is a retroactive label** — the 2018/2019 capital increases weren't branded that way at the time.
- **No public figure exists** for how much the failed 2022 round sought, B3i's burn rate, or annual spend (it was a private Swiss AG and didn't publish financials). PitchBook lists ~22 employees.

---

## 8. Milestones & the adoption reality check

> **The central story.** Across 2016–2022 B3i produced **exactly one** publicly confirmed legally-binding live commercial transaction. Everything else was prototypes, betas, parallel runs, and re-creations. The gap between the PR ("world first," "only DLT solution in production") and operational reality (one binding deal) is the whole point.

| Date | Milestone | Reality |
|---|---|---|
| **Sep 2017** | Working Cat XoL prototype; beta at Monte Carlo RVS | **Demo** — built on Fabric, later discarded |
| **Oct 2017** | Market beta-testing program (~38 companies) | **Test** |
| **Jun 2018** | Re-platform to R3 Corda | Prototype rebuilt |
| **Jul 2019** | Cat XoL v1.0 (first Corda product) | Released to community |
| **15 Oct 2019** | Cat XoL **deployed to production environments** | "Production env" ≠ binding contracts |
| **Feb 2020** | **"30 reinsurance contracts" placed** (9 insurers, 8 reinsurers, 4 brokers) | **Explicitly parallel runs / re-creations** mirroring the real 1/1 renewals — *not* the operative legal deals. Generali's Alberto Valenti re-created its Group Cat programme |
| **6 Apr 2022** | **World-first legally-binding Cat XoL on DLT** (Allianz + Swiss Re) | **The one real binding transaction** — between two founding shareholders |
| **29 Jul 2022** | Insolvency | ~3 months after the milestone |

Quote — Paul Meeusen (2017): *"a dedicated, combined team drawn from B3i member firms has produced a working prototype covering the core functionalities required to enable a distributed smart contract management system for Property Cat XoL contracts."* ([IBTimes](https://www.ibtimes.co.uk/blockchain-insurance-collective-b3i-launches-reinsurance-beta-monte-carlo-1638889))

**Verdict on volume:** B3i never achieved meaningful commercial transaction volume — confirmed bluntly by its own backers (see §10).

---

## 9. The April 2022 world-first

- **Announced 6 April 2022:** **Allianz and Swiss Re** placed the **world's first legally-binding (Cat XoL) reinsurance contract on DLT**, on B3i's live production network. The contract — one of Allianz's core catastrophe reinsurance treaties, including submission parts, final terms and binding clauses — was **digitally signed by both parties at the beginning of 2022**, satisfying corporate/regulatory requirements (four-eyes principle, signature status), with counterparties able to recreate the immutable contract from each other's nodes. ([Reinsurance News](https://www.reinsurancene.ws/allianz-swiss-re-place-first-legally-bound-cat-xol-reinsurance-dlt-contract-enabled-by-b3i/), [Crowell & Moring](https://www.crowell.com/en/insights/client-alerts/world-s-first-reinsurance-contract-bound-using-blockchain-technology))
- **Jan Stoermann, Chief Underwriting Officer, Allianz Re:** *"The signing of the first legally binding reinsurance contract on the B3i platform is a step into the future for Allianz."*
- **John Carolin, CEO, B3i:** *"Absolute contract certainty has arrived."* ([InsurTech Insights](https://www.insurtechinsights.com/world-first-legally-bound-catxol-reinsurance-contract-on-dlt-successfully-placed-by-allianz-and-swiss-re/))

**The brutal irony:** this high-water mark landed roughly **three months before B3i filed for insolvency**, and it was a deal between two of B3i's own founding shareholders — underscoring how little organic, third-party commercial volume the platform generated.

---

## 10. The collapse (July 2022)

- **What happened:** B3i Services AG **ceased trading and filed for insolvency under Swiss law** the week of **25–29 July 2022** (Insurance Journal reported 29 Jul 2022), after **failing to close a further funding round**. The entity is now listed as **"B3i Services AG in Liquidation," Zürich**. ([Insurance Journal](https://www.insurancejournal.com/news/international/2022/07/29/677926.htm), [Moneyhouse](https://www.moneyhouse.ch/en/company/b3i-services-ag-in-liquidation-12802881901))
- **Official B3i statement:** *"The directors, following consultation with the shareholders, have collectively concluded that there was not sufficient support to continue with the venture at this stage."*
- **Swiss Re Group CFO John Dacey** (H1-2022 results call): *"I think it was a very quality effort, but at the end of the day, we did not see the volumes in the demand that would have justified continued investment in this platform."* (Reinsurance News variant: *"…we did not see the volumes and the demand arrive…"* and that it *"didn't seem like it was going to go forward in a profitable way."*) ([Reinsurance News](https://www.reinsurancene.ws/b3i-conceptually-interesting-but-required-end-to-end-view-swiss-re-execs/))
- **Swiss Re Group CEO Christian Mumenthaler**, on the structural flaw: *"We would need an end-to-end view. It would need all insurance companies to basically create smart contracts at the beginning, at the origin."* — i.e., the network effects never materialised.
- **Decisively:** *"None of the supporting players offered to step up and save the Initiative"* — the competitor-shareholders who founded it declined to backstop it. ([Beinsure](https://beinsure.com/news/blockchain-insurance-industry-initiative-b3i-filed-insolvency/))

**Root causes (synthesised):**
1. **Insufficient volume / demand** (the proximate cause, per Dacey).
2. **No network effects** — DLT only pays off when *all* counterparties transact on it; B3i needed an "end-to-end" industry-wide network it never reached (Mumenthaler).
3. **Consortium governance.** Florian Graillot (astorya.vc): *"Consortiums are indeed hard … Collective action is a hard problem … much of the learning therefore is not related to technology."*
4. **Started in the hardest segment.** Nigel Walsh: B3i *"insisted on starting in the most conservative part of the industry, reinsurance,"* which *"made life difficult for themselves."*
5. **PoC→production integration burden** — required industry-wide IT integration that proved unfeasible.
6. **2022 "crypto winter" / blockchain disillusionment** — funding hype unwound; enterprise blockchain battled crypto's "negative connotations." ([IA Magazine](https://www.iamagazine.com/2023/02/01/what-next-for-blockchain-in-the-insurance-industry/), [astorya.io](https://research.astorya.io/post/insurtech-weekly-blockchain-in-insurance-what-to-learn-from-b3i-failure))

---

## 11. Aftermath

- **The money (~$23M) was effectively written off.** The entity went into liquidation; no rescue capital was provided and **no recovery to shareholders is reported**. Dacey's "quality effort" framing is the language of a write-off.
- **The technology** (Fluidity, on R3 Corda Enterprise) ceased active development. **No acquirer of B3i's IP and no open-sourcing is reported** — treat as *"no acquisition reported,"* not confirmed none. Its most valuable asset was the *consortium network itself*, which evaporated.
- **Staff outcomes** at closure are not documented in open sources.
- **~20–21 shareholders absorbed the loss**, including all five founders (Aegon, Allianz, Munich Re, Swiss Re, Zurich) plus Achmea, Ageas, AXA, Africa Re, CPIC, Deutsche Rück, Generali, Hannover Re, IRB Brasil Re, Liberty Mutual, Mapfre Re, SBI Group, SCOR, Tokio Marine, Türk Reasürans, VIG Re.

---

## 12. Peer comparison: who survived, who died

**The pattern:** member-funded *neutral-consortium* plays died; *commercial single-product / vendor-owned* plays that pivoted off pure-blockchain branding survived.

| Project | Model | Status | Why |
|---|---|---|---|
| **B3i** | Competitor-consortium → self-funding AG; reinsurance-first | **DIED (Jul 2022)** | Network never reached critical mass; volume/demand absent; consortium governance |
| **RiskStream Collaborative** (ex-RiskBlock, by **The Institutes**) | **Neutral non-profit** host; "beyond blockchain" pivot (2019) | **SURVIVED** | No competitor-governance trap; not required to be self-funding/profitable. Shipped **Canopy 3.0** (Kaleido/Hyperledger FireFly) and **dRe** parametric reinsurance with **Arbol** (live Jun 2023); active 2025 |
| **Insurwave** (EY + Guardtime; Maersk anchor; marine) | **Single product + paying anchor client**, commercial owner | **SURVIVED** | Concrete product, quietly de-emphasised "blockchain"; **acquired by IncubEx (2023)**; ~$16M revenue 2024 |
| **iXledger** | ICO-era startup (~$7M ICO 2017) | **FADED** | Coverage stops ~2018; effectively dormant |
| **R3 / Corda** (the underlying vendor) | Infra vendor to the whole sector | **STRESSED** | Cut ~20% of staff (Sep 2023), explored sale — distress reached the infra layer too |

**Key takeaway:** RiskStream's survival via a **neutral non-profit host** and Insurwave's via a **single real product with a paying customer** are exactly the structural choices B3i did *not* make. (Notably, **RiskStream + Arbol's dRe** is a living *parametric reinsurance on blockchain* product — the closest surviving analog to the cat-risk-on-chain thesis.)

---

## 13. Key uncertainties & conflicting claims

1. **Incorporation date:** **23 March 2018** (dominant/registry) vs. one "April 2018" snippet.
2. **13 vs 15 shareholders at incorporation:** the incorporation-13 omits **RGA and Sompo** — reason undocumented.
3. **"Seconded from Swiss Re"** (Meeusen): plausible and consistent with his concurrent Swiss Re DLT role, but no source uses the word "seconded."
4. **Carolin CEO effective date:** 25 June vs. 17 July 2019 (announcement).
5. **The "40":** ~40 employees **vs.** community of 40+ member companies — distinct figures, frequently conflated.
6. **Total funding:** ~$23M (register-corroborated) is the safe figure; PitchBook's $65.2M and ~$43.9M valuation are single-source/unverified. Series B amount, failed-round target, and burn rate are **undisclosed**.
7. **Feb 2020 "30 contracts":** counts (9/8/4) confirmed; the four brokers are **not** individually corroborated; and these were **parallel runs/re-creations, not binding deals**.
8. **Aftermath:** no reported IP acquirer and no staff-outcome detail (likely behind paywalls).
9. **Fetch caveat:** all quotes/dates from 403-blocked pages via cross-corroborated snippets; verify verbatim before publishing.

---

## 14. Relevance to RIZK

If the Allianz × Nephila pilot is RIZK's *proof-of-concept ancestor*, **B3i is its cautionary tale** — the most important failure to study, because B3i **did not fail on technology**. It had R3 Corda, ~20 of the biggest (re)insurers, ~$23M, ACORD-standard integration, and a genuine "world-first" binding contract. It still died — from **lack of volume, missing network effects, and competitor-consortium governance**. Every one of those failure modes maps onto a deliberate RIZK design choice.

| Failure mode that killed B3i | How RIZK is structured differently |
|---|---|
| **No transaction volume / demand** | Permissionless, **retail-accessible** capital + a **built-in secondary market** — designed to bootstrap liquidity without needing incumbents to onboard |
| **Network effects required "all insurers to create smart contracts at the origin"** (Mumenthaler) | RIZK is a **standalone open market**, not a shared-infrastructure layer that only works if every incumbent integrates. A single risk-holder + permissionless capital providers is a complete market |
| **Consortium-of-competitors governance** | **No consortium.** Neutral, credibly-neutral public infrastructure (EigenLayer, UMA); governance isn't gated on aligning rival insurers |
| **Self-funding AG that had to keep raising from members** | Protocol on public infra; no single corporate entity that must close a venture round to survive |
| **Permissioned/private Corda — value trapped inside the members** | **Public chain** — composable, openly accessible, value not locked to a closed membership |
| **Started in the most conservative segment (reinsurance B2B)** — Nigel Walsh | RIZK targets **underserved risk holders** (sovereigns, co-ops, utilities) + retail capital — a *new* market rather than digitising incumbents' existing one |

**The honest caution for RIZK** (don't over-learn the comforting parts):
1. **Demand/liquidity is the existential risk — the same one that killed B3i.** B3i proved that even with massive institutional backing, *volume* is the thing that doesn't show up. RIZK's entire bet is that **permissionless + retail + a liquid built-in market** solves the volume problem that a closed consortium could not. That bet is unproven and is the #1 thing to validate early.
2. **Cat risk is a hard first market.** Walsh's critique of B3i — starting in conservative reinsurance — partly applies to RIZK too. Mitigant: RIZK isn't asking incumbents to change behaviour; it's opening access to *new* capital and *new* cedents.
3. **A "world first" headline is not adoption.** B3i's April 2022 milestone was real and still meaningless commercially. RIZK should measure success in **repeat markets and secondary-market volume**, not launch-day firsts.
4. **You're not alone, and that's validation, not threat.** **RiskStream + Arbol's dRe** is a *surviving* blockchain parametric-reinsurance product — evidence the thesis can live when structured well (neutral host, concrete product).
5. **The survivors' formula** — neutral governance and/or a single concrete product with paying customers — is the one to emulate. RIZK's neutral public-infra stack + a concrete product (parametric cat protection) fits that mold; resist drifting into platform/consortium sprawl (the "lost focus on the original mission" critique that dogged B3i).

---

## 15. Full source list

### Founding, membership & corporate structure
- Aegon (B3i launch): https://www.aegon.com/newsroom/news/2016/Insurers-and-reinsurers-launch-Blockchain-initiative-B3i/
- Munich Re (B3i launch, Oct 2016): https://www.munichre.com/en/company/media-relations/media-information-and-corporate-news/corporate-news/2016/2016-10-19-insurers-and-reinsurers-launch-blockchain-initiative-b3i.html
- Insurance Journal (15 members, Feb 2017): https://www.insurancejournal.com/news/international/2017/02/06/440629.htm
- Munich Re (international scope, Feb 2017): https://www.munichre.com/en/company/media-relations/media-information-and-corporate-news/corporate-news/2017/2017-02-06-munich-re-blockchain-initiative-b3i-gains-truly-international-scope.html
- CoinDesk (AIA/AIG + 23 join, Oct 2017): https://www.coindesk.com/markets/2017/10/02/aia-and-aig-join-b3i-as-blockchain-consortium-adds-23-members/
- Insurance Journal (B3i Services AG incorporated): https://www.insurancejournal.com/news/international/2018/03/26/484363.htm
- AXA XL (founders form startup): https://axaxl.com/press-releases/b3i-founders-form-blockchain-startup
- Coverager (13 founders): https://coverager.com/13-b3i-founders-form-blockchain-startup/
- S&P Global (independent company): https://www.spglobal.com/marketintelligence/en/news-insights/trending/6yuk-rzwjki80lpydm0ndw2
- Northdata (registry CHE-204.812.908): https://www.northdata.com/B3i%20Services%20AG,%20Z%C3%BCrich/CHE-204.812.908
- Moneyhouse (in liquidation): https://www.moneyhouse.ch/en/company/b3i-services-ag-in-liquidation-12802881901

### Leadership & governance
- The Blockchain and Us (Paul Meeusen): https://theblockchainandus.com/paul-meeusen/
- Ledger Insights (Carolin becomes CEO): https://www.ledgerinsights.com/blockchain-insurance-b3i-ceo-john-carolin/
- Insurance Journal (Carolin CEO): https://www.insurancejournal.com/news/international/2019/07/17/532553.htm
- CoinDesk ("40-strong", CEO): https://www.coindesk.com/markets/2019/07/17/40-strong-blockchain-insurance-group-b3i-appoints-ceo/
- Reinsurance News (Tradt → Corda Network board): https://www.reinsurancene.ws/b3is-markus-tradt-joins-board-of-corda-network/
- Reinsurance News (board reshuffle): https://www.reinsurancene.ws/b3i-raises-a-further-16-million-shuffles-board/

### Technology & products
- Munich Re (working prototype, Fabric, Sep 2017): https://www.munichre.com/en/company/media-relations/media-information-and-corporate-news/corporate-news/2017/2017-09-10-B3i-launches-working-reinsurance-blockchain-prototype.html
- SCOR (smart-contract system at Monte Carlo): https://www.scor.com/en/news/b3i-presents-its-smart-contract-management-system-2017-monte-carlo-rvs-conference
- IBTimes (Monte Carlo beta, Meeusen quote): https://www.ibtimes.co.uk/blockchain-insurance-collective-b3i-launches-reinsurance-beta-monte-carlo-1638889
- Ledger Insights (switch to Corda): https://www.ledgerinsights.com/b3i-insurance-blockchain-switch-corda/
- CoinDesk (endorses Corda): https://www.coindesk.com/markets/2018/06/18/insurance-group-b3i-endorses-r3s-corda-blockchain-platform
- CoinDesk (insurers behind R3): https://www.coindesk.com/markets/2018/07/05/big-insurers-are-uniting-behind-r3s-blockchain-tech/
- CoinDesk (first product on Corda): https://www.coindesk.com/markets/2019/07/31/blockchain-insurance-group-b3i-launches-first-product-on-r3s-corda/
- Insurance Journal (Cat XoL to production): https://www.insurancejournal.com/news/international/2019/10/15/545507.htm
- R3 case study (Fluidity / B3i Re): https://developer.r3.com/case-studies/b3i/
- Reinsurance News (Ritablock on Fluidity): https://www.reinsurancene.ws/b3i-announces-first-live-partner-application-on-fluidity-platform/
- Ledger Insights (Ritablock): https://www.ledgerinsights.com/b3i-reinsurance-accounting-blockchain-ritablock/
- Intelligent Insurer (B3i Re across value chain): https://www.intelligentinsurer.com/news/launch-of-b3i-re-expands-functionality-of-cat-xol-across-the-value-chain-23405
- Reinsurance News (ACORD standards group): https://www.reinsurancene.ws/b3i-to-co-chair-new-acord-blockchain-standards-group/
- Ledger Insights (nuclear pool): https://www.ledgerinsights.com/blockchain-platform-b3i-wins-nuclear-insurance-project/

### Funding
- CoinDesk ($16M raise, 2019): https://www.coindesk.com/markets/2019/03/25/blockchain-insurance-consortium-b3i-quietly-raises-16-million/
- Cointelegraph (B3i raises $16M): https://cointelegraph.com/news/insurance-blockchain-startup-b3i-raises-16-million
- Ledger Insights (SBI invests): https://www.ledgerinsights.com/insurance-blockchain-b3i-sbi-invests/
- Reinsurance News (SBI shareholder): https://www.reinsurancene.ws/b3i-announces-japans-sbi-group-as-latest-shareholder/
- Ledger Insights (Series B close): https://www.ledgerinsights.com/insurance-blockchain-firm-b3i-closes-series-b-investment/
- Intelligent Insurer (Series B / Türk Reasürans): https://www.intelligentinsurer.com/news/b3i-closes-series-b-investment-unveils-turk-reasurans-as-shareholder-24377

### Milestones & adoption
- Insurance Journal (30 contracts, Feb 2020): https://www.insurancejournal.com/news/international/2020/02/14/558428.htm
- Reinsurance News (30 contracts at 1/1): https://www.reinsurancene.ws/b3is-blockchain-platform-places-30-reinsurance-contracts-at-1-1/
- Ledger Insights (Generali/Allianz parallel runs): https://www.ledgerinsights.com/b3i-blockchain-insurance-generali-allianz/
- Insurance Journal (production network, Oct 2019): https://www.insurancejournal.com/news/international/2019/10/22/546184.htm

### April 2022 world-first
- Reinsurance News (Allianz/Swiss Re Cat XoL): https://www.reinsurancene.ws/allianz-swiss-re-place-first-legally-bound-cat-xol-reinsurance-dlt-contract-enabled-by-b3i/
- InsurTech Insights (world-first, Carolin quote): https://www.insurtechinsights.com/world-first-legally-bound-catxol-reinsurance-contract-on-dlt-successfully-placed-by-allianz-and-swiss-re/
- Intelligent Insurer (global-first on DLT): https://www.intelligentinsurer.com/insurance/swiss-re-and-allianz-pioneer-global-first-reinsurance-contract-on-dlt-29013
- Crowell & Moring (legal significance): https://www.crowell.com/en/insights/client-alerts/world-s-first-reinsurance-contract-bound-using-blockchain-technology
- Lexology (client alert): https://www.lexology.com/library/detail.aspx?g=d7731e17-b840-494a-8ac8-d975fa082c9b

### Collapse, aftermath & analysis
- Insurance Journal (insolvency, Dacey quote): https://www.insurancejournal.com/news/international/2022/07/29/677926.htm
- Reinsurance News (fails to raise, insolvency): https://www.reinsurancene.ws/b3i-fails-to-raise-new-capital-enters-insolvency/
- Reinsurance News (Swiss Re "end-to-end view"): https://www.reinsurancene.ws/b3i-conceptually-interesting-but-required-end-to-end-view-swiss-re-execs/
- Ledger Insights (major insurers pull plug): https://www.ledgerinsights.com/major-insurers-pull-the-plug-on-b3i-insurance-blockchain-consortium/
- Intelligent Insurer (forced to shut down): https://www.intelligentinsurer.com/insurance/b3i-forced-to-shut-down-after-major-re-insurers-pull-the-plug-29965
- Insurance Insider (confirms bankruptcy): https://www.insuranceinsider.com/article/2af83w7h69byhems8laf4/london-market-section/b3i-confirms-bankruptcy-after-funding-round-failure
- Beinsure (post-mortem): https://beinsure.com/news/blockchain-insurance-industry-initiative-b3i-filed-insolvency/
- IA Magazine ("What next for blockchain"): https://www.iamagazine.com/2023/02/01/what-next-for-blockchain-in-the-insurance-industry/
- astorya.io (Graillot, lessons from B3i): https://research.astorya.io/post/insurtech-weekly-blockchain-in-insurance-what-to-learn-from-b3i-failure
- Sunset HQ (why B3i failed): https://www.sunsethq.com/blog/why-did-b3i-services-fail
- Atlas Magazine (cease operations): https://www.atlas-mag.net/en/category/regions-geographiques/monde/blockchain-b3i-consortium-to-cease-operations

### Peer comparison
- The Institutes RiskStream: https://web.theinstitutes.org/riskstream-collaborative
- Ledger Insights (RiskBlock → RiskStream): https://www.ledgerinsights.com/riskblock-blockchain-insurance-institutes-riskstream/
- PRNewswire (Arbol + RiskStream dRe parametric reinsurance): https://www.prnewswire.com/news-releases/arbol-and-the-institutes-riskstream-collaborative-unveil-dre-a-blockchain-powered-parametric-reinsurance-platform-301855469.html
- BusinessWire (RiskStream 2024 awards, Jan 2025): https://www.businesswire.com/news/home/20250114534458/en/The-Institutes-RiskStream-Collaborative-Announces-Winners-of-Its-2024-Leadership-Award
- Insurance Journal (Insurwave launch): https://www.insurancejournal.com/news/national/2018/05/25/490345.htm
- Insurwave (2025 year in review): https://insurwave.com/blog/insights/insurwave-2025-a-year-in-review
- Ledger Insights (R3 Corda in insurance): https://www.ledgerinsights.com/r3-corda-blockchain-insurance/
- Cointelegraph (R3 strategic options): https://cointelegraph.com/news/r3-strategic-options-blockchain-partnerships
- Crunchbase (iXledger): https://www.crunchbase.com/organization/ixledger

---

*End of dossier. Compiled via multi-agent web research with adversarial cross-checking; see [§13](#13-key-uncertainties--conflicting-claims) for confidence notes. Companion: [`2016-allianz-nephila-catbond-blockchain.md`](./2016-allianz-nephila-catbond-blockchain.md).*
