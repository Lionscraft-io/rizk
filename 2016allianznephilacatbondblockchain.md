# The Allianz × Nephila Blockchain Catastrophe-Swap Pilot (2016) — Research Dossier

> **Compiled:** June 2026
> **Subject:** The June 2016 pilot in which **Allianz Risk Transfer (ART)** and **Nephila Capital** used blockchain smart contracts to transact a natural catastrophe **swap** — its technology (Symbiont), mechanics, market context, results, and aftermath.
> **Why this file exists:** RIZK is an on-chain catastrophe-bond / parametric-protection protocol. The 2016 ART × Nephila pilot is the **institutional ancestor** of what RIZK is building. See [§9 — Relevance to RIZK](#9-relevance-to-rizk).
>
> **Sourcing caveat (read first):** Nearly every trade-press and corporate domain in this space (Artemis.bm, CoinDesk, Insurance Journal, Reinsurance News, Ledger Insights, agcs.allianz.com, Munich Re, PreventionWeb) returns **HTTP 403 to automated fetching**. The facts below were assembled from search-engine extracts of those same pages, **cross-corroborated across 8+ independent outlets**, plus directly-accessible primary documents (court opinions, SEC filings, GitHub). Confidence is high on all core facts. Before quoting verbatim in anything published, confirm against a primary copy opened in a browser. Conflicting/uncertain points are consolidated in [§10](#10-key-uncertainties--conflicting-claims).

---

## Contents

1. [TL;DR — key facts at a glance](#1-tldr--key-facts-at-a-glance)
2. [What happened: the June 2016 pilot](#2-what-happened-the-june-2016-pilot)
3. [How the smart contract worked](#3-how-the-smart-contract-worked)
4. [The technology: Symbiont, Assembly & SymPL](#4-the-technology-symbiont-assembly--sympl)
5. [Results & executive quotes](#5-results--executive-quotes)
6. [The players](#6-the-players)
7. [Market context: cat bonds, cat swaps, ILS & triggers](#7-market-context-cat-bonds-cat-swaps-ils--triggers)
8. [What came next: Allianz blockchain timeline 2016–2025](#8-what-came-next-allianz-blockchain-timeline-20162025)
9. [Relevance to RIZK](#9-relevance-to-rizk)
10. [Key uncertainties & conflicting claims](#10-key-uncertainties--conflicting-claims)
11. [Full source list](#11-full-source-list)

---

## 1. TL;DR — key facts at a glance

| | |
|---|---|
| **What** | A successful **pilot** using blockchain smart contracts to transact a **natural catastrophe swap** |
| **Announced** | **15 June 2016** (coverage clustered 14–16 June 2016) |
| **Who** | **Allianz Risk Transfer AG (ART)** — Allianz's alternative-risk-transfer unit (insurer/cedent side) · **Nephila Capital Ltd** — the world's largest ILS / catastrophe-reinsurance investment manager (investor side) |
| **Official title** | *"Smart contract technology for transacting a natural catastrophe swap – Pilot project"* |
| **Technology** | Smart contracts on a **permissioned/private distributed ledger**; widely reported as **Symbiont's** "Smart Securities"/Assembly platform — **Allianz declined to officially confirm the vendor** |
| **Core claim** | Settlement between insurer and investors could be **"significantly accelerated and simplified"**; CoinDesk reported potential to cut settlement from **weeks/months → "as low as a few hours"** |
| **Instrument nuance** | The live transaction was a **cat *swap***, not a cat *bond*. Cat *bonds* were named only as a future beneficiary ("increased tradability of cat bonds") |
| **Status** | **Proof-of-concept only** — never publicly confirmed to reach production |
| **Aftermath** | Symbiont won a ~$70M lawsuit yet went **bankrupt (Dec 2022)**; the related industry consortium **B3i collapsed (July 2022)** months after a "world-first" Allianz/Swiss Re cat reinsurance contract on DLT |

**One-line correction to the common framing:** people remember this as a "catbond on blockchain," but the 2016 transaction was specifically a **bilateral catastrophe *swap***. The first blockchain *settlement of a cat bond* came **later, in 2017**, as a separate effort.

---

## 2. What happened: the June 2016 pilot

On **15 June 2016**, Allianz Risk Transfer (ART — the corporate / alternative-risk-transfer arm of Allianz Global Corporate & Specialty) and Nephila Capital announced they had *"successfully piloted the use of blockchain smart contract technology for transacting a natural catastrophe swap."* It was explicitly described as *"one of several test applications Allianz Group's Disruptive Technologies division undertook to explore future blockchain opportunities."* ([the-blockchain.com](https://www.the-blockchain.com/2016/06/15/allianz-risk-transfer-nephila-successfully-pilot-blockchain-technology/), [Insurance Journal](https://www.insurancejournal.com/news/international/2016/06/15/416971.htm), [Artemis](https://www.artemis.bm/news/nephila-allianz-work-on-blockchain-catastrophe-risk-trading/))

**Precise terminology (this matters):**
- The live test transacted **a single natural catastrophe *swap***. ([PreventionWeb](https://www.preventionweb.net/news/view/49340), [Canadian Underwriter](https://www.canadianunderwriter.ca/catastrophes/allianz-risk-transfer-nephila-capital-successfully-use-blockchain-cat-swap-1004115113/))
- Cat **bonds** were referenced only as a *related/future* benefit: the technology *"points to other benefits such as increased tradability of cat bonds."* This is why headlines vary between "cat swaps," "cat swaps and bonds," and "cat bonds." ([Hedgeweek](https://www.hedgeweek.com/allianz-risk-transfer-and-nephila-pilot-blockchain-technology-or-catastrophe-swaps/))
- Press-release definition used: *"Catastrophe or 'cat' swaps and bonds are financial instruments which transfer a specific set of risks, typically natural disaster risks such as hurricanes or typhoons, from an insurer to investors or other insurers utilizing triggers with defined parameters."* ([Brave New Coin](https://bravenewcoin.com/insights/allianz-and-nephila-successfully-piloted-blockchain-technology-for-catastrophe-swap))

**Headline claims of the pilot:**
- Transactional processing and settlement between insurers and investors could be **significantly accelerated and simplified** by blockchain-based contracts.
- **Increased tradability of cat bonds**, and wider applicability to other insurance transactions.
- Increased **reliability, auditability and speed** because less manual processing, authentication and verification through intermediaries is required.

**Primary sources:** The official Allianz Group release survives in German — [allianz.com (DE)](https://www.allianz.com/de/presse/news/engagement/sponsoring/160615-erfolgreiches-pilotprojekt-mit-blockchain-technologie.html) — and the full English AGCS release was reproduced verbatim at [the-blockchain.com](https://www.the-blockchain.com/2016/06/15/allianz-risk-transfer-nephila-successfully-pilot-blockchain-technology/). [PreventionWeb](https://www.preventionweb.net/news/view/49340) catalogs the original under its official title.

---

## 3. How the smart contract worked

**The core mechanism, in the press release's own words:**

> *"Each validated contract on the open shared infrastructure contains data and self-executable codes inherent to that contract. When a triggering event occurs which meets the agreed conditions, the Blockchain smart contract picks up the predefined data sources of all participants, and then automatically activates and determines payouts to or from contract parties."* — [Canadian Underwriter](https://www.canadianunderwriter.ca/catastrophes/allianz-risk-transfer-nephila-capital-successfully-use-blockchain-cat-swap-1004115113/)

Breaking that down:

- **Parametric triggers (not indemnity).** The contract encodes objective thresholds — e.g., a named storm whose losses exceed a defined amount. When Symbiont later demoed the same "smart swap," the trigger was *"a storm whose losses exceeded a threshold amount."* ([CoinDesk](https://www.coindesk.com/symbiont-blockchain-catastrophe-swaps))
- **Self-execution.** Each swap is encoded as self-executing code; on a qualifying event it ingests the agreed data, validates the criteria, and **automatically computes payouts in either direction** (a swap can pay either counterparty).
- **Data feeds / oracles.** It relied on *"predefined data sources of all participants"* agreed at contract formation, plus an independent loss-calculation agent. **No specific oracle or data-feed provider is named in any source** — a notable gap, and a hint at how immature the "oracle problem" still was in 2016.
- **Intermediaries targeted for removal.** The design aimed to reduce *"the validation and arbitration functions that independent third party institutions such as banks, intermediaries, administrators, auditors and clearing houses traditionally perform."* ([the-blockchain.com](https://www.the-blockchain.com/2016/06/15/allianz-risk-transfer-nephila-successfully-pilot-blockchain-technology/))
- **Speed claim.** CoinDesk reported the automation could cut settlement that normally *"drags on for weeks or months after a disaster"* down to *"as low as a few hours."* ([CoinDesk](https://www.coindesk.com/allianz-blockchain-smart-contracts-boost-catastrophe-bond-trading))

**Contract lifecycle:** issuance/formation (encode the swap as self-executing code + agreed parameters + predefined data sources) → validation/execution (on a triggering event, ingest data, verify thresholds met, on an "incorruptible" distributed ledger) → settlement (automatic payout to/from parties).

---

## 4. The technology: Symbiont, Assembly & SymPL

### 4.1 The attribution dispute ⚠️ (the single most-nuanced point)

- **Multiple independent outlets** (CoinDesk, IBTimes, Finance Magnates, Brave New Coin) named the technology provider as **Symbiont**, a New York smart-contracts fintech, using its proprietary **"Smart Securities"** platform and **"Assembly"** ledger. Symbiont's *own Delaware court filings* later listed *"a major European insurance company for Smart Swaps in the catastrophe insurance market"* among its users — strongly corroborating the link. ([IBTimes](https://www.ibtimes.co.uk/allianz-pioneers-symbiont-smart-contracts-catastrophe-swaps-1565656), [Finance Magnates](https://www.financemagnates.com/cryptocurrency/innovation/insurance-giant-allianz-selects-symbiont-for-catastrophe-swaps-blockchain/), [Delaware Chancery opinion](https://courts.delaware.gov/Opinions/Download.aspx?id=323270))
- **BUT Allianz publicly declined to endorse this**, stating *"the references to Symbiont involvement in this pilot are not endorsed by Allianz,"* and that it worked *"with a number of blockchain specialist firms."* ([CoinDesk, 22 Sep 2016](https://www.coindesk.com/markets/2016/09/22/symbiont-showcases-blockchain-catastrophe-swaps-to-insurance-execs/), [Brave New Coin](https://bravenewcoin.com/insights/allianz-and-nephila-successfully-piloted-blockchain-technology-for-catastrophe-swap))

**Verdict:** Treat "Symbiont was the vendor" as **strongly press-reported and corroborated by Symbiont's own filings, but never officially confirmed by Allianz.**

**Public vs. private:** The press release's phrase *"open shared infrastructure"* describes a ledger **shared/transparent among the participating firms** — not a public/permissionless chain. The implementation is described as **private/permissioned** (consistent with Symbiont's permissioned Assembly ledger). No source indicates Ethereum or Hyperledger was used for *this specific* pilot. ([NewsBTC](https://www.newsbtc.com/news/allianz-insurance-implement-blockchain-tech-cat-bonds/))

### 4.2 Symbiont the company

- **Founded March 2015**, merging the **Counterparty** team (a "Bitcoin 2.0" protocol, est. 2013 — Robby Dermody, Evan Wagner, Adam Krellenstein) with **MathMoney f(x)** (Mark Smith). HQ in **New York City**. ([Bitcoin Magazine](https://bitcoinmagazine.com/business/counterparty-mathmoney-fx-create-symbiont-make-financial-markets-smarter-1426098641), [NewsBTC](https://www.newsbtc.com/2015/03/11/symbiont-power-modern-finance-bitcoin-technology/))
- **Founders:** Mark Smith (CEO), Adam Krellenstein (CTO), Robby Dermody (President), Evan Wagner.
- **Funding (~$36M cumulative):** ~$1.25M seed (2015, angels incl. former NYSE CEO Duncan Niederauer); ~$7M (Jan 2016); **$15M Series A** (May 2017); **$20M Series B** (Jan 2019, led by **Nasdaq Ventures**, with **Citi, Galaxy Digital, Raptor Group**). ([Crowdfund Insider](https://www.crowdfundinsider.com/2015/06/69133-symbiont-smart-securities-technology-secures-1-25m-in-seed-funding/), [PRNewswire — Series B](https://www.prnewswire.com/news-releases/symbiont-closes-20-million-in-series-b-funding-300781277.html), [Fortune](https://fortune.com/2019/01/23/nasdaq-citi-symbiont-blockchain-venture-capital-cryptocurrency/))
- **Notable clients/projects:** **Vanguard** (blockchain index-data distribution with CRSP); **Ipreo / Synaps Loans** JV (modernizing the ~$3 trillion syndicated-loan market; a 2017 demo involved 19 firms incl. Barclays, BBVA, RBS, State Street, Wells Fargo, KKR); **Lewis Ranieri** (mortgage securitization); the **State of Delaware** blockchain initiative; Medici Ventures. ([Vanguard PR](https://www.prnewswire.com/news-releases/vanguard-using-blockchain-technology-to-improve-index-data-distribution-663641913.html), [Synaps Loans PR](https://www.prnewswire.com/news-releases/financial-institutions-move-closer-to-realizing-a-blockchain-solution-for-syndicated-loans-300431763.html))

### 4.3 Assembly (the ledger) & SymPL (the language)

- **Assembly™** — released **18 October 2016** — was Symbiont's **permissioned (private)** distributed ledger, *"a bespoke blockchain independent of Bitcoin and Ethereum."* ([CoinDesk](https://www.coindesk.com/markets/2016/10/18/symbiont-unveils-assembly-blockchain-for-enterprise), [Nasdaq](https://www.nasdaq.com/articles/symbiont-unveils-enterprise-ready-distributed-ledger-releases-assembly-code-github-2016-10))
- **Consensus: BFT-SMaRt** — a Byzantine Fault-Tolerant protocol; Symbiont claimed sustained **~80,000 transactions/second** in a multi-node network and open-sourced Assembly components on GitHub. ([Coinspeaker](https://www.coinspeaker.com/smart-contracts-company-symbiont-releases-enterprise-ready-distributed-ledger/), [arXiv: "Blockchain Consensus Protocols in the Wild"](https://arxiv.org/pdf/1707.01873))
- **SymPL** ("Symbiont Programming Language") — a **deterministic domain-specific language** for Assembly smart contracts, with a module system, contract versioning/upgrading, and built-in end-to-end transaction privacy. Symbiont also held a patent on **static analysis of smart-contract determinism** ([US 11,502,822](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/11502822)). ([Medium — SymPL DSL](https://medium.com/symbiont-io/safety-and-ease-of-use-in-sympl-a-dsl-for-enterprise-smart-contracts-d3183b0adee1))
- CTO Adam Krellenstein's framing: there were effectively *"only two smart-contract systems — Ethereum's and ours,"* arguing complex financial smart contracts belonged in **permissioned** systems. ([IBTimes](https://www.ibtimes.co.uk/symbionts-adam-krellenstein-theres-really-only-two-smart-contract-systems-ethereums-ours-1530490))

### 4.4 Symbiont's dramatic fate — won the lawsuit, lost the company

- **The lawsuit:** *Symbiont.io v. Ipreo Holdings / IHS Markit* (Delaware Court of Chancery, C.A. No. 2019-0407-JTL). When **IHS Markit acquired Ipreo (2 Aug 2018)**, it brought in **ClearPar**, a competitor to the Synaps Loans JV — breaching the JV's non-compete. In **August 2021**, Vice Chancellor J. Travis Laster ruled **for Symbiont**. ([Paul Weiss](https://www.paulweiss.com/insights/client-news/symbiont-wins-victory-and-70-million-damages-award-in-delaware-chancery-court), [Justia](https://law.justia.com/cases/delaware/court-of-chancery/2021/c-a-no-2019-0407-jtl.html))
- **Amounts (layered — be precise):** total damages ~$140–142M after-tax → Symbiont's ~50% share ≈ **$70M** → **settled for ~$53M, paid end of December 2021**. ([Ledger Insights](https://www.ledgerinsights.com/blockchain-startup-symbiont-wins-lawsuit-against-ihs-markit-ipreo-71m-settlement/))
- **The paradox:** despite the win, **legal costs left it insolvent**. Symbiont filed **Chapter 11 on 1 December 2022** (SDNY, case 1:22-bk-11620), assets and liabilities each in the $1M–$10M range. ([CoinDesk](https://www.coindesk.com/business/2022/12/09/symbiontio-which-tried-to-bring-blockchain-to-traditional-finance-files-for-chapter-11), [Ledger Insights — legal costs](https://www.ledgerinsights.com/symbiont-bankruptcy-legal-costs/))
- **Where the IP went:** **LM Funding America** (which had made a $2M secured loan in Dec 2021) acquired Symbiont's assets via a ~$2.6M credit bid (June 2023), then **sold the blockchain technology to Platonic Holdings Inc. for $2.0M (Dec 2023)**. SymPL/Assembly code now lives under GitHub's [`platonic-io`](https://github.com/platonic-io/sympl_auction). ([LM Funding — acquires assets](https://www.globenewswire.com/news-release/2023/06/06/2682825/0/en/LM-Funding-America-Inc-Acquires-Assets-of-Symbiont-io-Inc-from-Chapter-11-Bankruptcy.html), [LM Funding — sells to Platonic](https://www.globenewswire.com/news-release/2023/12/28/2801723/0/en/LM-Funding-Sells-Symbiont-s-Blockchain-Technology-to-Platonic-Holdings-Inc.html))

---

## 5. Results & executive quotes

The pilot was framed as an unqualified **success**, with **no stated limitations** and **no published hard metrics** (no dollar figure, no count of contracts, no specific measured time-saving for the swap itself). Benefits cited: faster/simpler settlement, increased cat-bond tradability, reliability, auditability, reduced friction. Symbiont said its catastrophe-swap platform was *"ready for use"* and had *"laid the groundwork for what could be digital securitisation of catastrophe-linked assets in years to come."* ([Artemis](https://www.artemis.bm/news/blockchain-catastrophe-swap-platform-ready-shows-insurtech-potential/))

**Richard Boyd** — Chief Underwriting Officer, Allianz Risk Transfer (Bermuda):
> *"Blockchain technology would increase reliability, auditability and speed for both cat swaps and bonds as less manual processing, authentication and verification through intermediaries is required to confirm the legitimacy of payments/transactions to and from the investors."*

> *"By replacing the human interventions which are currently embedded throughout the entire risk transfer process, frictional delays and the risks of human error are completely removed – with a radical effect on the speed and efficiency of the process and, in the case of bonds, on the tradability of such securities."*
([Hedgeweek](https://www.hedgeweek.com/allianz-risk-transfer-and-nephila-pilot-blockchain-technology-or-catastrophe-swaps/), [Canadian Underwriter](https://www.canadianunderwriter.ca/catastrophes/allianz-risk-transfer-nephila-capital-successfully-use-blockchain-cat-swap-1004115113/))

**Laura Taylor** — Managing Principal, Nephila Capital:
> *"We believe technology will drive the future of insurance. We have invested a great deal accordingly and are pleased to extend our long-standing strategic partnership with ART to use of the Blockchain."*
([CCN](https://www.ccn.com/allianz-risk-transfer-and-nephila-capital-use-blockchain-for-catastrophic-swap-instruments/))

**Solmaz Altin** — Chief Digital Officer, Allianz Group (the official Allianz Group quote in the release):
> *"In our journey to become more digital, Blockchain promises to help us create more transparent, more convenient and faster services for our customers."*
([insurance-canada.ca, republishing the release](https://insurance-canada.ca/2017/06/15/blockchain-technology-successfully-piloted-by-allianz-risk-transfer-and-nephila-for-catastrophe-swap/))

> **Note on a third name:** Some coverage also quotes **Michael Eitelwein, Head of Allianz Group's Disruptive Technology division** ("*Blockchain is obviously a fascinating technology and we are starting to explore the use of it in several fields*"). Eitelwein led the division that *ran* the pilot; Altin was the official CDO voice in the release. Both are genuine — see [§10](#10-key-uncertainties--conflicting-claims).

---

## 6. The players

### 6.1 Allianz Risk Transfer (ART)
The corporate / **alternative-risk-transfer** unit of **Allianz Global Corporate & Specialty (AGCS)** — the cedent/insurer side of the swap. Its Bermuda-based **Chief Underwriting Officer, Richard Boyd**, was the lead quoted executive. The pilot was run under **Allianz Group's "Disruptive Technologies" division** (head: Michael Eitelwein).

### 6.2 Nephila Capital — the investor side
- **Founders & origin:** Co-founded by **Frank Majors** and **Greg Hagood** in **1997** within the London reinsurance broker **Willis**; **relocated to Bermuda in 1999**; the founders **bought the firm out from Willis in 2003** to form the independent Nephila Capital Ltd. ([The Hedge Fund Journal](https://thehedgefundjournal.com/nephila-capital/), [Reinsurance News](https://www.reinsurancene.ws/jessica-laird-promoted-to-ceo-of-nephila-capital-as-frank-majors-steps-back/))
- **What it does:** The world's largest and one of the oldest dedicated **insurance-linked securities (ILS)** / catastrophe-reinsurance investment managers — cat bonds, cat swaps, collateralized reinsurance, weather derivatives.
- **Name origin:** Named for the golden silk orb-weaver spider (*genus Nephila*), known in Bermuda as the **"hurricane spider"** for the folklore that it spins its web low to the ground before a hurricane. ([Bermuda Scenics](https://www.bermudascenics.com/photo/nephila/))
- **AUM:** Peaked at **~$12.2 billion** (~300+ investors) around the 2018 Markel acquisition; has since fallen to roughly **$6.6–7.6 billion** after heavy catastrophe-loss years (incl. Hurricane Ian, 2022) and redemptions. ([Artemis — Markel consideration](https://www.artemis.bm/news/nephila-acquisition-cost-markel-total-consideration-of-975m/), [Artemis — AUM $7.6bn](https://www.artemis.bm/news/nephila-capital-assets-under-management-rose-600m-in-a-year-to-7-6bn/))
- **Ownership:** Minority stakes once held by **Man Group** (18.5%) and **KKR** (invested 2013, ~3× return on exit). **Markel Corporation acquired 100%** of Nephila Holdings for **~$975M total consideration** (announced 31 Aug 2018, completed **14 Nov 2018**). ([Reinsurance News](https://www.reinsurancene.ws/markel-corporation-buying-nephila-capital-worlds-largest-ils-manager/), [PRNewswire](https://www.prnewswire.com/news-releases/markel-completes-acquisition-of-nephila-holdings-limited-300750758.html))
- **2025 leadership reshuffle:** **Jessica Laird** became **CEO of Nephila Capital**; **Frank Majors** stepped back to a portfolio-construction role; **Greg Hagood** became sole CEO of Nephila Holdings. **Laura Taylor** (the pilot-era spokesperson) is **Managing Principal** and **President of Nephila Holdings**. ([Reinsurance News](https://www.reinsurancene.ws/jessica-laird-promoted-to-ceo-of-nephila-capital-as-frank-majors-steps-back/))
- **Tech strategy (the "why"):** Nephila has consistently backed insurtech/data — investments in **Jupiter** (climate-risk analytics) and **Tensorflight** (AI property data), and an **SEI** strategic technology partnership — consistent with Laura Taylor's "technology will drive the future of insurance" framing.

### 6.3 Symbiont — see [§4.2–4.4](#42-symbiont-the-company) (company, tech, and its bankruptcy).

---

## 7. Market context: cat bonds, cat swaps, ILS & triggers

**Why this section:** it explains *why* blockchain was attractive here, and frames the instruments RIZK tokenizes.

### 7.1 Catastrophe bonds
High-yield insurance-linked securities whose principal is at risk if a defined catastrophe occurs in a defined window/region. Mechanics: a **Special Purpose Vehicle (SPV / "transformer")** enters a reinsurance agreement with the sponsor, issues notes to investors, and holds their principal in a **collateral account** (typically T-bill money-market funds). The coupon = collateral yield **+ risk spread**. If a trigger fires, principal flows from the collateral account to the sponsor; if not, investors are repaid at maturity (typically **~3 years**). ([Artemis library](https://www.artemis.bm/library/what-is-a-catastrophe-bond/), [Wikipedia](https://en.wikipedia.org/wiki/Catastrophe_bond), [Wharton Cat Bond Primer (PDF)](https://impact.wharton.upenn.edu/wp-content/uploads/2023/08/Cat-Bond-Primer-July-2021.pdf))

**Market size:** crossed **~$26.8 billion** outstanding at end-2016; surpassed **$50 billion** in early 2025 and reached a record **~$61.3 billion** at end-2025. The broader **ILS** market hit ~$107 billion by end-2024. ([Artemis — $50bn](https://www.artemis.bm/news/artemis-measure-of-catastrophe-bond-market-size-surpasses-50bn-for-the-first-time/), [Artemis — 2025 records](https://www.artemis.bm/news/catastrophe-bond-market-records-2025/))

### 7.2 Catastrophe swaps
**Bilateral, over-the-counter (OTC) derivatives** transferring catastrophe losses between two counterparties. Two forms: a *pure* cat swap (two (re)insurers exchange uncorrelated exposures for diversification / capital relief, e.g. US hurricane for Japanese typhoon) and a *financial* cat swap (a cedant pays premium to an investor for contingent catastrophe payments). The **bilateral, two-party nature is exactly what makes a *shared ledger between the parties* a natural fit** — which is why ART/Nephila chose a swap for the pilot. ([Joseph — cat swaps explainer](https://www.linkedin.com/pulse/understanding-catastrophe-derivative-contracts-cat-swaps-joseph))

### 7.3 ILS as an asset class
Returns are driven by insurance risk, not market cycles — *"stock-market crashes don't cause earthquakes, and natural disasters tend not to cause bear markets."* That structural **non-correlation** is the draw for pension funds and hedge funds. ([Morningstar](https://www.morningstar.com/bonds/catastrophe-bonds-strategic-diversifier))

### 7.4 Trigger types (and why parametric suits smart contracts)
| Trigger | Basis (what determines payout) | Basis risk | Speed | ~Market share |
|---|---|---|---|---|
| **Indemnity** | Sponsor's actual paid losses | Lowest | Slowest (loss adjustment) | ~70% |
| **Industry-loss** | Aggregate industry losses (e.g. PCS) | Medium | Medium | ~20% |
| **Parametric** | Objective physical params (wind speed, magnitude) vs. threshold | **Highest** | **Fastest / most transparent** | ~3% |
| **Modeled-loss** | Cat model run on actual event params | Medium | Medium | ~1% |

([Joseph — trigger types](https://www.linkedin.com/pulse/insurance-securitization-part-2-catastrophe-bond-triggers-joseph))

**Parametric ↔ smart contracts** is a one-to-one mapping: the trigger is deterministic code, the input is objective oracle-fed data, and settlement is an automatic collateral transfer with **no claims-adjustment process to encode**. The trade-off is **basis risk** (the parameter may not perfectly track the sponsor's actual loss). The first blockchain *settlement* of a cat bond (2017) explicitly exploited that parametric triggers "can initiate settlement without claims processing." ([Insurance Journal, Aug 2017](https://www.insurancejournal.com/news/international/2017/08/14/460989.htm), [Ledger Insights](https://www.ledgerinsights.com/insurance-blockchain-used-for-cat-bond-transactions/))

### 7.5 The pain points blockchain aimed to solve
Manual processing & **multi-week/month settlement delays** after a catastrophe; **reconciliation** of separate party records; **intermediaries** (banks, administrators, auditors, clearing houses) taking fees and adding friction; and **limited transparency/tradability** of instruments that historically trade privately and infrequently.

---

## 8. What came next: Allianz blockchain timeline 2016–2025

> The 2016 swap pilot was the *first* of a long series of Allianz blockchain experiments — a recurring pattern of **successful technical pilots that rarely became durable production businesses**. **B3i is a separate consortium initiative**, not a continuation of the Symbiont cat-swap work; the common thread is only Allianz's participation.

| Date | Event |
|---|---|
| **Jun 2016** | **ART × Nephila cat-swap pilot** (Symbiont; permissioned ledger). Proof-of-concept. |
| **Oct 19, 2016** | **B3i founded** by 5 members: **Aegon, Allianz, Munich Re, Swiss Re, Zurich**. Built on Hyperledger Fabric. ([Munich Re](https://www.munichre.com/en/company/media-relations/media-information-and-corporate-news/corporate-news/2016/2016-10-19-insurers-and-reinsurers-launch-blockchain-initiative-b3i.html)) |
| **Feb 6, 2017** | **B3i expands to 15 members** (adds Achmea, Ageas, Generali, Hannover Re, Liberty Mutual, RGA, SCOR, Sompo, Tokio Marine, XL Catlin). ([Munich Re](https://www.munichre.com/en/company/media-relations/media-information-and-corporate-news/corporate-news/2017/2017-02-06-munich-re-blockchain-initiative-b3i-gains-truly-international-scope.html)) |
| **2017** | **First blockchain *settlement of a cat bond*** — a separate effort, building on the 2016 work. ([Insurance Journal](https://www.insurancejournal.com/news/international/2017/08/14/460989.htm)) |
| **Sep–Oct 2017** | B3i launches a working **Property Cat XoL** reinsurance prototype for beta testing. ([Munich Re](https://www.munichre.com/en/company/media-relations/media-information-and-corporate-news/corporate-news/2017/2017-09-10-B3i-launches-working-reinsurance-blockchain-prototype.html)) |
| **Nov 7, 2017** | **Allianz captive-insurance blockchain prototype** (Hyperledger Fabric 1.0), built with **EY, Ginetta, and Citi** — a *separate* AGCS/ART experiment. ([Insurance Journal](https://www.insurancejournal.com/news/international/2017/11/07/470607.htm)) |
| **Mar 23, 2018** | B3i **incorporates as B3i Services AG** in Zurich (~CHF 6.3M raised). ([Intelligent Insurer](https://www.intelligentinsurer.com/insurance/blockchain-based-b3i-incorporates-in-zurich-ahead-of-funding-round-14946)) |
| **Jun 2018** | B3i **switches from Hyperledger Fabric to R3 Corda**. ([Ledger Insights](https://www.ledgerinsights.com/b3i-insurance-blockchain-switch-corda/)) |
| **2019** | B3i raises ~$16M (capital to ~CHF 22.5M); SBI Group joins as 17th shareholder. Allianz separately surfaces a **USD-pegged "token economy"** experiment for cross-border payments. ([CoinDesk](https://www.coindesk.com/markets/2019/03/25/blockchain-insurance-consortium-b3i-quietly-raises-16-million/), [Cointelegraph](https://cointelegraph.com/news/insurance-giant-allianz-is-working-on-a-token-based-blockchain-ecosystem)) |
| **Oct 2019 → Feb 2020** | B3i deploys its **Cat XoL** product to production; by Feb 2020 the platform places **~30 reinsurance contracts** in a market test. ([Insurance Journal](https://www.insurancejournal.com/news/international/2020/02/14/558428.htm)) |
| **2021** | **Allianz puts a cross-border motor-claims blockchain into live production** across ~23–25 European subsidiaries (Hyperledger Fabric); later passes **1M+ transactions**. ([Ledger Insights](https://www.ledgerinsights.com/allianz-launches-blockchain-claims-solution-in-23-countries/)) |
| **Apr 2022** | **WORLD-FIRST legally-binding Cat XoL reinsurance contract on DLT — Allianz + Swiss Re, via B3i's live network.** ([Reinsurance News](https://www.reinsurancene.ws/allianz-swiss-re-place-first-legally-bound-cat-xol-reinsurance-dlt-contract-enabled-by-b3i/)) |
| **Jul 2022** | **B3i files for insolvency** — months after that milestone — after failing to raise further funding. Swiss Re CFO John Dacey: *"a very quality effort, but… we did not see the volumes in the demand that would have justified continued investment."* ([Insurance Journal](https://www.insurancejournal.com/news/international/2022/07/29/677926.htm)) |
| **2023–2025** | Industry mood cools to narrow, ROI-led use cases. Allianz's retained working asset is its motor-claims platform; by 2025 Allianz frames blockchain mainly as a **cyber-risk/underwriting** topic. ([Allianz Commercial, 2025](https://commercial.allianz.com/news-and-insights/reports/blockchain-and-cyber-security-2025.html)) |

**Comparison — AXA "Fizzy" (NOT Allianz):** rival AXA launched **Fizzy** (Sep 2017), a parametric **flight-delay** product on **public Ethereum** that auto-paid for delays >2 hours — then **scrapped it in 2020** citing insufficient demand. Useful contrast: AXA used a *public* chain for *B2C*; Allianz/B3i used *permissioned* chains for *B2B reinsurance*. ([CoinDesk](https://www.coindesk.com/markets/2017/09/13/axa-is-using-ethereums-blockchain-for-a-new-flight-insurance-product), [Artificial Lawyer](https://www.artificiallawyer.com/2020/10/08/axa-scraps-fizzy-insurance-smart-contract-but-still-interested-in-the-tech/))

---

## 9. Relevance to RIZK

The 2016 ART × Nephila pilot validated *the exact thesis RIZK is built on* — parametric cat risk + smart-contract auto-settlement + the promise of "increased tradability of cat bonds" — but did it in a **closed, institutional, bilateral** way that never escaped proof-of-concept. RIZK is, in effect, the **permissionless, public-chain, retail-accessible** realization of the same idea, with the missing pieces (a decentralized oracle, programmatic collateral, a real secondary market) filled in by infrastructure that did not exist in 2016.

| Dimension | 2016 ART × Nephila pilot | RIZK |
|---|---|---|
| **Access** | Permissioned; two known institutions | Permissionless capital providers; KYB-gated risk holders |
| **Chain** | Private/permissioned (Symbiont Assembly, BFT-SMaRt) | Public EVM chain |
| **Instrument** | Bilateral cat **swap** (PoC) | Tokenized **catbond** position (ERC-20 `CatbondToken`) |
| **Trigger** | Parametric, "predefined data sources" + calculation agent | Parametric **attachment points** (severity → slash %); **UMA Optimistic Oracle** (v1), optional **Chainlink** (v2) |
| **Collateral / payout** | Off-chain collateral; contract "determines payouts" | **EigenLayer Duration Vault**; **slashing → `redistributionRecipient`** |
| **Tradability** | *Aspiration* — "increased tradability of cat bonds" | **Realized** — built-in CLOB, freely-transferable tokens, $0–$1 redemption band |
| **Settlement speed** | Claim: weeks/months → "a few hours" | Oracle-resolution-bounded automatic slash/redemption |
| **Outcome** | Never reached production | (in design/build) |

**Lessons RIZK can take from the precedent:**
1. **Tech success ≠ commercial success.** Both Symbiont and B3i *worked* technically but died from **lack of transaction volume and funding** — not engineering failure. RIZK's permissionless, retail-accessible market design directly targets the *volume/liquidity* gap that killed the institutional consortium model.
2. **The oracle was the unsolved piece in 2016.** The pilot relied on vague "predefined data sources" and an unnamed calculation agent. RIZK's use of **UMA's optimistic oracle** (with a DVM dispute path, and Chainlink as a v2 automated-feed option) is the modern answer to exactly that gap — and the most important design risk to get right.
3. **Single-vendor / consortium dependency is fragile.** Allianz's value evaporated when Symbiont went bankrupt and B3i folded. RIZK's reliance on **decentralized, credibly-neutral infrastructure** (EigenLayer, UMA) avoids that single-point-of-failure.
4. **"Increased tradability" was the headline promise nobody delivered.** Boyd explicitly tied blockchain's value *"in the case of bonds, [to] the tradability of such securities."* RIZK's built-in order book is the literal delivery of that 2016 promise — worth foregrounding in positioning.
5. **Basis risk is the parametric trade-off to manage.** Parametric triggers are what make automation possible, but they carry the **highest basis risk** of any trigger type. RIZK's graduated `attachmentPoints` are a mitigation; messaging to risk holders should be honest about residual basis risk.

---

## 10. Key uncertainties & conflicting claims

1. **Date — RESOLVED as June 2016.** Insurance Journal (`/2016/06/15/`) and the-blockchain.com (`/2016/06/15/`) URLs, plus ~8 June-2016 articles, confirm **15 June 2016**. The "June 15, 2017" seen on insurance-canada.ca is a **republication exactly one year later**, not a second announcement.
2. **Symbiont attribution.** Press-reported and corroborated by Symbiont's own court filings, but **Allianz never officially confirmed** the vendor and emphasized "a number of blockchain specialist firms."
3. **Public vs. private.** Press release says *"open shared infrastructure"*; best read as **permissioned/shared among participants**, not a public chain. Implementation reported as private (Symbiont Assembly).
4. **Executive quote attribution.** Boyd (ART) and Taylor (Nephila) are rock-solid. For Allianz Group, **Solmaz Altin (CDO)** is the official release quote; **Michael Eitelwein** headed the Disruptive Technologies division. Some outlets foreground one or the other.
5. **Symbiont funding/lawsuit figures.** Founding "2015 (from Counterparty, est. 2013)"; Series A reported as ~$7M (2016) and $15M (2017) — ~$36M cumulative is the reliable anchor. Lawsuit: ~$140–142M total → ~$70M Symbiont share → **~$53M settled (Dec 2021)**. Bankruptcy: **Dec 1, 2022** (the $2M secured loan was Dec 2021 — a likely source of "2021" confusion).
6. **No published metrics** for the swap pilot (no $ value, contract count, or measured time-saving), and **no named oracle/data provider**.
7. **Fetch caveat.** All quotes/dates were extracted from search-engine snippets of 403-blocked pages, cross-checked across multiple outlets. Verify against primary copies before any publication.

---

## 11. Full source list

### Primary / official
- Allianz Group press release (German): https://www.allianz.com/de/presse/news/engagement/sponsoring/160615-erfolgreiches-pilotprojekt-mit-blockchain-technologie.html
- Full English AGCS release (reproduced): https://www.the-blockchain.com/2016/06/15/allianz-risk-transfer-nephila-successfully-pilot-blockchain-technology/
- PreventionWeb catalog entry (official title): https://www.preventionweb.net/news/view/49340
- Delaware Court of Chancery opinion, *Symbiont.io v. Ipreo*: https://courts.delaware.gov/Opinions/Download.aspx?id=323270 · https://law.justia.com/cases/delaware/court-of-chancery/2021/c-a-no-2019-0407-jtl.html
- Symbiont determinism patent (US 11,502,822): https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/11502822
- LM Funding 8-K (Platonic sale): https://www.sec.gov/Archives/edgar/data/1640384/000095017023073439/lmfa-ex99_1.htm
- Platonic / SymPL code: https://github.com/platonic-io/sympl_auction · https://github.com/platonic-io/sympl_chat

### 2016 pilot coverage
- Artemis: https://www.artemis.bm/news/nephila-allianz-work-on-blockchain-catastrophe-risk-trading/
- Artemis ("platform ready"): https://www.artemis.bm/news/blockchain-catastrophe-swap-platform-ready-shows-insurtech-potential/
- Insurance Journal: https://www.insurancejournal.com/news/international/2016/06/15/416971.htm
- Canadian Underwriter: https://www.canadianunderwriter.ca/catastrophes/allianz-risk-transfer-nephila-capital-successfully-use-blockchain-cat-swap-1004115113/
- Hedgeweek: https://www.hedgeweek.com/allianz-risk-transfer-and-nephila-pilot-blockchain-technology-or-catastrophe-swaps/
- CCN: https://www.ccn.com/allianz-risk-transfer-and-nephila-capital-use-blockchain-for-catastrophic-swap-instruments/
- Cointelegraph: https://cointelegraph.com/news/insurance-giant-allianz-to-tame-cat-swaps-with-blockchain
- Brave New Coin: https://bravenewcoin.com/insights/allianz-and-nephila-successfully-piloted-blockchain-technology-for-catastrophe-swap
- Coverager: https://coverager.com/blockchain-piloted-by-allianz-risk-transfer-nephila-for-catastrophe-swap/
- insurance-canada.ca (2017 republish; Altin quote): https://insurance-canada.ca/2017/06/15/blockchain-technology-successfully-piloted-by-allianz-risk-transfer-and-nephila-for-catastrophe-swap/

### Symbiont (company, tech, fate)
- Finance Magnates (Symbiont selected): https://www.financemagnates.com/cryptocurrency/innovation/insurance-giant-allianz-selects-symbiont-for-catastrophe-swaps-blockchain/
- IBTimes (Allianz pioneers Symbiont): https://www.ibtimes.co.uk/allianz-pioneers-symbiont-smart-contracts-catastrophe-swaps-1565656
- CoinDesk (Symbiont cat swaps): https://www.coindesk.com/symbiont-blockchain-catastrophe-swaps
- CoinDesk (Allianz disavowal, 22 Sep 2016): https://www.coindesk.com/markets/2016/09/22/symbiont-showcases-blockchain-catastrophe-swaps-to-insurance-execs/
- CoinDesk (settlement speed): https://www.coindesk.com/allianz-blockchain-smart-contracts-boost-catastrophe-bond-trading
- CoinDesk (Assembly launch): https://www.coindesk.com/markets/2016/10/18/symbiont-unveils-assembly-blockchain-for-enterprise
- Nasdaq (Assembly + GitHub): https://www.nasdaq.com/articles/symbiont-unveils-enterprise-ready-distributed-ledger-releases-assembly-code-github-2016-10
- arXiv (BFT consensus in the wild): https://arxiv.org/pdf/1707.01873
- Medium (SymPL DSL): https://medium.com/symbiont-io/safety-and-ease-of-use-in-sympl-a-dsl-for-enterprise-smart-contracts-d3183b0adee1
- Medium (Introducing Assembly): https://medium.com/@rune.tevasvold.aune/introducing-symbiont-assembly-6f788af87ca
- IBTimes (Krellenstein "two systems"): https://www.ibtimes.co.uk/symbionts-adam-krellenstein-theres-really-only-two-smart-contract-systems-ethereums-ours-1530490
- Bitcoin Magazine (Symbiont formed): https://bitcoinmagazine.com/business/counterparty-mathmoney-fx-create-symbiont-make-financial-markets-smarter-1426098641
- Crowdfund Insider (seed): https://www.crowdfundinsider.com/2015/06/69133-symbiont-smart-securities-technology-secures-1-25m-in-seed-funding/
- PRNewswire (Series B): https://www.prnewswire.com/news-releases/symbiont-closes-20-million-in-series-b-funding-300781277.html
- Fortune (Nasdaq/Citi round): https://fortune.com/2019/01/23/nasdaq-citi-symbiont-blockchain-venture-capital-cryptocurrency/
- PRNewswire (Vanguard): https://www.prnewswire.com/news-releases/vanguard-using-blockchain-technology-to-improve-index-data-distribution-663641913.html
- PRNewswire (Synaps Loans): https://www.prnewswire.com/news-releases/financial-institutions-move-closer-to-realizing-a-blockchain-solution-for-syndicated-loans-300431763.html
- Paul Weiss ($70M award): https://www.paulweiss.com/insights/client-news/symbiont-wins-victory-and-70-million-damages-award-in-delaware-chancery-court
- Ledger Insights (settlement): https://www.ledgerinsights.com/blockchain-startup-symbiont-wins-lawsuit-against-ihs-markit-ipreo-71m-settlement/
- Ledger Insights (bankruptcy / legal costs): https://www.ledgerinsights.com/symbiont-bankruptcy-legal-costs/
- CoinDesk (Chapter 11): https://www.coindesk.com/business/2022/12/09/symbiontio-which-tried-to-bring-blockchain-to-traditional-finance-files-for-chapter-11
- GlobeNewswire (LM Funding acquires assets): https://www.globenewswire.com/news-release/2023/06/06/2682825/0/en/LM-Funding-America-Inc-Acquires-Assets-of-Symbiont-io-Inc-from-Chapter-11-Bankruptcy.html
- GlobeNewswire (sale to Platonic): https://www.globenewswire.com/news-release/2023/12/28/2801723/0/en/LM-Funding-Sells-Symbiont-s-Blockchain-Technology-to-Platonic-Holdings-Inc.html

### Nephila Capital
- Artemis profile: https://www.artemis.bm/ils-fund-managers/nephila-capital/
- The Hedge Fund Journal: https://thehedgefundjournal.com/nephila-capital/
- Reinsurance News (2025 leadership): https://www.reinsurancene.ws/jessica-laird-promoted-to-ceo-of-nephila-capital-as-frank-majors-steps-back/
- Artemis (Markel $975M): https://www.artemis.bm/news/nephila-acquisition-cost-markel-total-consideration-of-975m/
- Reinsurance News (Markel buys Nephila): https://www.reinsurancene.ws/markel-corporation-buying-nephila-capital-worlds-largest-ils-manager/
- PRNewswire (Markel completes): https://www.prnewswire.com/news-releases/markel-completes-acquisition-of-nephila-holdings-limited-300750758.html
- Artemis (AUM $7.6bn): https://www.artemis.bm/news/nephila-capital-assets-under-management-rose-600m-in-a-year-to-7-6bn/
- Bermuda Scenics (hurricane spider): https://www.bermudascenics.com/photo/nephila/
- SEI partnership: https://ir.seic.com/press-releases/detail/998/nephila-capital-selects-sei-as-a-global-strategic-partner

### Market context (cat bonds / cat swaps / ILS / triggers)
- Artemis library (what is a cat bond): https://www.artemis.bm/library/what-is-a-catastrophe-bond/
- Wikipedia (catastrophe bond): https://en.wikipedia.org/wiki/Catastrophe_bond
- Wharton Cat Bond Primer (PDF): https://impact.wharton.upenn.edu/wp-content/uploads/2023/08/Cat-Bond-Primer-July-2021.pdf
- Chicago Fed primer: https://www.chicagofed.org/publications/chicago-fed-letter/2018/405
- Artemis ($50bn): https://www.artemis.bm/news/artemis-measure-of-catastrophe-bond-market-size-surpasses-50bn-for-the-first-time/
- Artemis (2025 records): https://www.artemis.bm/news/catastrophe-bond-market-records-2025/
- Cat swaps explainer: https://www.linkedin.com/pulse/understanding-catastrophe-derivative-contracts-cat-swaps-joseph
- Trigger types: https://www.linkedin.com/pulse/insurance-securitization-part-2-catastrophe-bond-triggers-joseph
- Morningstar (diversifier): https://www.morningstar.com/bonds/catastrophe-bonds-strategic-diversifier
- Swiss Re (parametric): https://corporatesolutions.swissre.com/insights/knowledge/what_is_parametric_insurance.html
- First blockchain cat-bond settlement (2017): https://www.insurancejournal.com/news/international/2017/08/14/460989.htm · https://www.ledgerinsights.com/insurance-blockchain-used-for-cat-bond-transactions/

### Allianz timeline / B3i / comparisons
- Munich Re (B3i launch): https://www.munichre.com/en/company/media-relations/media-information-and-corporate-news/corporate-news/2016/2016-10-19-insurers-and-reinsurers-launch-blockchain-initiative-b3i.html
- Munich Re (B3i to 15 members): https://www.munichre.com/en/company/media-relations/media-information-and-corporate-news/corporate-news/2017/2017-02-06-munich-re-blockchain-initiative-b3i-gains-truly-international-scope.html
- Munich Re (B3i prototype): https://www.munichre.com/en/company/media-relations/media-information-and-corporate-news/corporate-news/2017/2017-09-10-B3i-launches-working-reinsurance-blockchain-prototype.html
- Intelligent Insurer (B3i incorporates): https://www.intelligentinsurer.com/insurance/blockchain-based-b3i-incorporates-in-zurich-ahead-of-funding-round-14946
- Ledger Insights (B3i → Corda): https://www.ledgerinsights.com/b3i-insurance-blockchain-switch-corda/
- CoinDesk (B3i raises $16M): https://www.coindesk.com/markets/2019/03/25/blockchain-insurance-consortium-b3i-quietly-raises-16-million/
- Insurance Journal (B3i 30 contracts): https://www.insurancejournal.com/news/international/2020/02/14/558428.htm
- Insurance Journal (Allianz captive prototype): https://www.insurancejournal.com/news/international/2017/11/07/470607.htm
- AGCS (captive prototype release): https://www.agcs.allianz.com/about-us/news/blockchain-prototype-captive-insurance-press-release/
- Ledger Insights (Allianz motor claims): https://www.ledgerinsights.com/allianz-launches-blockchain-claims-solution-in-23-countries/
- Cointelegraph (Allianz token economy): https://cointelegraph.com/news/insurance-giant-allianz-is-working-on-a-token-based-blockchain-ecosystem
- Reinsurance News (Allianz/Swiss Re Cat XoL): https://www.reinsurancene.ws/allianz-swiss-re-place-first-legally-bound-cat-xol-reinsurance-dlt-contract-enabled-by-b3i/
- Insurance Journal (B3i insolvency): https://www.insurancejournal.com/news/international/2022/07/29/677926.htm
- Ledger Insights (insurers pull plug on B3i): https://www.ledgerinsights.com/major-insurers-pull-the-plug-on-b3i-insurance-blockchain-consortium/
- Allianz Commercial (blockchain & cyber, 2025): https://commercial.allianz.com/news-and-insights/reports/blockchain-and-cyber-security-2025.html
- CoinDesk (AXA Fizzy): https://www.coindesk.com/markets/2017/09/13/axa-is-using-ethereums-blockchain-for-a-new-flight-insurance-product
- Artificial Lawyer (AXA scraps Fizzy): https://www.artificiallawyer.com/2020/10/08/axa-scraps-fizzy-insurance-smart-contract-but-still-interested-in-the-tech/

---

*End of dossier. Compiled via multi-agent web research with adversarial cross-checking; see [§10](#10-key-uncertainties--conflicting-claims) for confidence notes.*
