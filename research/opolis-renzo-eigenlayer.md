# Opolis × Renzo × EigenLayer — Deep Research Report

> **Compiled:** 2026-06-14
> **Author:** Research for the RIZK team
> **Scope:** What the "Opolis + Renzo + EigenLayer" project is, full details, on-chain data, and relevance to RIZK (an EigenLayer-based parametric insurance / catastrophe-bond protocol).
> **Method & reliability caveat:** All primary sources (opolis.co, docs.renzoprotocol.com, blog.eigencloud.xyz, Etherscan, DefiLlama, CoinGecko) actively block automated fetching (HTTP 403 / WAF). Findings are therefore **cross-corroborated across many independent web searches** rather than verbatim page fetches. Contract addresses are corroborated via Etherscan labels + EigenLayer's GitHub config. **Numeric market data (TVL, price, supply) is approximate and should be re-verified live.** Confidence levels are flagged throughout.

---

## 0. Bottom line (TL;DR)

The "Opolis + Renzo + EigenLayer" project is **real and live**. It is called **Opolis Reinsurance Bonds**, branded the **"Opus Series."**

- Depositors lock the **AUSD** stablecoin (Agora Dollar — **not** ezETH) into a **Renzo Flow Vault**.
- That capital is **restaked on EigenLayer / EigenCloud** and used to **underwrite real health-insurance reserves** for the **Opolis** employment cooperative (the same org behind the **$WORK** token).
- The first bond, **Opus I**, opened ~**July 22, 2025**, closed deposits **July 31, 2025**, and matured **January 31, 2026**.
- Opolis markets it as *"the first live real-world application of restaking in the insurance sector."*

**Key nuance for RIZK:** Opus I is explicitly *"No slashing, no emissions."* So it uses restaked capital as **yield-bearing reserve backing**, **not** as a slashing/redistribution payout rail. That's a more conservative model than RIZK's principal-at-risk catastrophe bond. Genuine claims/slashing risk is signalled for **Opus II+**.

---

## 1. What it actually is

A partnership product with **four** real parties (not three):

| Party | Role |
|---|---|
| **Opolis** | The insurance protocol / beneficiary. A digital employment cooperative ("Employment Commons," a Colorado Limited Cooperative Association) providing payroll + group health benefits to freelancers, DAOs, and independent workers. Bringing its health-plan reserves on-chain. |
| **Renzo** | The vault infrastructure. Its **Flow Vaults** framework issues the fixed-term, on-chain "restaking bond" that holds and deploys the capital. |
| **EigenLayer / EigenCloud** | The restaking / security layer underneath Renzo's vault — where the capital is restaked. |
| **Agora** | The collateral-asset issuer. **AUSD** (Agora Dollar) is the stablecoin deposited — a "hidden" but central fourth party. |

**Disambiguation (resolved, HIGH confidence):** The "Opolis" here is unambiguously the **$WORK-token employment cooperative** — its own X account, "OPOLIS | Employment Commons," posts both the cooperative/$WORK material and the restaking-bond announcement. It is **not**:
- "Metropolis" (no relevant DeFi project found),
- a generic DeFi vault-curator,
- the unrelated **"Opus (OPT)"** ERC-20 (`0x4355fC160f74328f9b383dF2EC589bB3dFd82Ba0`),
- Chorus One's **"OPUS Pool"** (a separate EigenLayer LST restaking tool).

---

## 2. How the mechanism works

1. **Deposit:** User deposits **AUSD** into the Opolis Opus I vault (accessed via the Renzo app) and receives **opusIAUSD**, a receipt token representing the bonded AUSD position. It auto-compounds (value-accruing, not rebasing).
2. **Restake:** Renzo's **Flow Vault** deploys the capital into yield-bearing positions and **restakes it on EigenLayer**, delegated to an AVS that backs Opolis's reinsurance pool.
3. **Underwrite:** The restaked capital **collateralizes Opolis's on-chain health-insurance reserve**, replacing traditional reinsurers and giving Opolis "predictable, guaranteed reserves."
4. **Premiums & claims:** Opolis members pay insurance premiums into a smart-contract pool; **claims up to ~65% of premiums are paid directly from premium dollars**. The restaked bond sits *behind* that as reserve backing.
5. **Yield & maturity:** The bond behaves like a **zero-coupon bond** — fixed term, fixed maturity. Bondholders earn a **blended ~40% APY** from (a) AUSD stablecoin/reserve yield and (b) insurance underwriting profits (claims at or below expected). At maturity the contract returns principal + yield.
   - 40% APY over the 6-month term ≈ **~20% realized** for the period — consistent across sources, not a contradiction.

**The "no slashing" point:** Opus I is marketed as *"No slashing, no emissions — just RealFi."* In this first series the restaked principal is **proof-of-collateral that earns yield**, not capital slashed to pay claims. Opolis signals that **Opus II (fall 2025) and later series will be larger and carry actual claims risk with variable yields.** Redistributable slashing as a *claims payout* mechanism is on the roadmap but **not exercised in Opus I**.

**Broader Opus Series design:** Restakers lock AUSD for fixed terms (generally **6–12 months**) at variable APYs (**15–60%**), collateralizing and securing the insurance pool with various risk-profiled bonds.

---

## 3. The parties in depth

### 3.1 Opolis (insurance protocol / cooperative)
- Colorado Limited Cooperative Association ("Employment Commons"); payroll, benefits, group health insurance for independent workers, DAOs, solopreneurs.
- Launched the **$WORK** patronage/governance token in **April 2021** (utility for governance, staking, patronage distribution; full benefit requires Employment Commons membership).
- New healthcare push runs through **Coalition Healthcare** plans; the Opus bonds underwrite the **first ~2,500 covered lives**; plans went public **January 1, 2026**.
- VC **Tim Draper** publicly endorsed the on-chain insurance effort (Aug 2025).
- Earlier DeFi ties: a **BadgerDAO** strategic investment & integration ("BIP 49"); a GitHub org (`github.com/opolis`) hosting **`eigenlayer-operator-config`** and an **`eigendata`** fork ("Contains Operator and AVS metadata") — suggesting Opolis touches the operator/AVS side, though its precise on-chain role (AVS owner vs operator vs pure beneficiary) is **not fully confirmed**.

### 3.2 Renzo (vault infrastructure / LRT protocol)
- Liquid-restaking protocol repositioned as a **"Yield Orchestration Layer for Activating Idle Capital."**
- Original products are LRTs: **ezETH** (EigenLayer), **pzETH** (Symbiotic), **ezSOL** (Solana via Jito, launched Oct 30, 2024).
- **Flow Vaults** = newer framework for "network-issued restaking bonds." Opolis is the flagship real-world use case (see Renzo's case study, June 26, 2025). Also runs "Renzo Reserve" institutional vaults (first strategy cited: Superstate USCC).
- Built **on top of** EigenLayer / Symbiotic / Jito — an interface/strategy layer, not a competitor.
- **Founders:** Lucas Kozinski (strategy), James Poole (engineering; ex-TokenSoft CTO), Kratik Lodha (research/product; ex-Woodstock). Founded **2023**.

### 3.3 EigenLayer / EigenCloud (restaking + redistribution layer)
- Dominant Ethereum **restaking** protocol; rebranded **"EigenCloud"** in 2025 (token ticker still **EIGEN**).
- Stakers re-pledge ETH/LSTs/EIGEN to secure **AVSs** (Actively Validated Services) via **operators** in **operator sets**; stake becomes **slashable**.
- **Slashing** went live on mainnet **April 17, 2025** (slashed funds initially **burned**).
- **Redistribution / "redistributable slashing"** (ELIP-006): slashed funds route to an immutable **`redistributionRecipient`** instead of being burned — the primitive that enables insurance/coverage. Testnet **June 5, 2025**; **mainnet July 22, 2025** (same week Opus I opened — but Opus I has "no slashing," so the timing is launch-partner symbolism, not Opus I invoking redistribution).

### 3.4 Agora (AUSD — the collateral asset)
- "Stablecoin 3.0," minted 1:1 with USD; reserves (cash, U.S. Treasuries, overnight repos) managed by **VanEck** in a bankruptcy-remote trust, **State Street** custodian/administrator.
- Launched **July 2024**; founder **Nick van Eck**. A top-5 fiat-backed stablecoin by daily volume.
- AUSD doesn't pay holders yield directly, but Agora **shares reserve economics with ecosystem partners** — the source of the "stablecoin yield" leg of the ~40% APY.
- Native on Ethereum, Avalanche, Sui, Injective, Polygon, and others (LayerZero-enabled multichain).

---

## 4. Timeline & current status

| Date | Event |
|---|---|
| Apr 2021 | Opolis launches $WORK token |
| Jul 2023 | Opolis raises $6.6M bridge round (~$13.3M total, ~$50M valuation) |
| Apr 17, 2025 | EigenLayer mainnet slashing goes live (funds burned) |
| Jun 5, 2025 | EigenLayer redistribution live on testnet |
| Jun 26, 2025 | Renzo publishes "restaking bonds via Flow Vaults" case study |
| Jul 22, 2025 | **Opus I vault opens** (~$500K target); EigenLayer **redistribution live on mainnet** same week |
| Jul 31, 2025 | Opus I deposit window closes |
| Fall 2025 | Coalition Healthcare beta; **Opus II** slated to launch (larger, with claims risk) |
| Jan 1, 2026 | Opolis health plans go public |
| Jan 31, 2026 | **Opus I bond matures** (principal + ~20%/period returned) |
| As of Jun 2026 | Opus I matured; status of Opus II / later series is the main open question (primary pages fetch-blocked) |

---

## 5. On-chain details

### 5.1 Most relevant to this project

| Contract | Chain | Address | Confidence |
|---|---|---|---|
| **opusIAUSD** (Opus I bond receipt; "Renzo Protocol: OpusIAUSD Token") | Ethereum | `0xcca2af7ec2e0b55d9cb1d9d36e542a1085e82ea5` | High (Etherscan label) |
| **AUSD** (Agora Dollar — deposit asset) | Ethereum | `0x00000000eFE302BEAA2b3e6e1b18d08D69a9012a` | High (multi-explorer) |
| **Opolis: Deployer** | Ethereum | `0x7136fbddd4dffa2369a9283b6e90a040318011ca` | Medium (single Etherscan label) |

*Not found:* the specific Renzo Flow Vault **deposit/wrapper** contract for Opus I (the opusIAUSD token is the verifiable artifact; the vault wrapper address didn't surface in search).

### 5.2 Renzo ecosystem

| Contract | Chain | Address | Confidence |
|---|---|---|---|
| ezETH (Renzo Restaked ETH) | Ethereum | `0xbf5495Efe5DB9ce00f80364C8B423567e58d2110` | High |
| ezETH (canonical L2 address — Arbitrum, Base, Blast, OP, Linea, BSC) | L2s | `0x2416092f143378750bb29b79eD961ab195CcEea5` | High |
| pzETH (Renzo Restaked LST / Symbiotic) | Ethereum | `0x8c9532a60E0E7C6BbD2B2c1303F63aCE1c3E9811` | High |
| REZ (governance token) | Ethereum | `0x3B50805453023a91a8bf641e279401a0b23FA6F9` | High |
| Renzo RestakeManager / Deposit (entry) | Ethereum | `0x74a09653A083691711cF8215a6ab074BB4e99ef5` | Med-High |

### 5.3 EigenLayer core (verified via GitHub config + Etherscan labels)

| Contract | Address | Confidence |
|---|---|---|
| EIGEN token (wraps bEIGEN) | `0xec53bF9167f50cDEB3Ae105f56099aaaB9061F83` | High |
| bEIGEN (Backing Eigen) | `0x83E9115d334D248Ce39a6f36144aEaB5b3456e75` | High |
| EigenStrategy (EIGEN) | `0xaCB55C530Acdb2849e6d4f36992Cd8c9D50ED8F7` | High |
| StrategyManager | `0x858646372CC42E1A627fcE94aa7A7033e7CF075A` | High |
| DelegationManager | `0x39053D51B77DC0d36036Fc1fCc8Cb819df8Ef37A` | High |
| AllocationManager | `0x948a420b8CC1d6BFd0B6087C2E7c344a2CD0bc39` | High |
| EigenPodManager | `0x91E677b07F7AF907ec9a428aafA9fc14a0d3A338` | High |
| **RewardsCoordinator** *(RIZK backlog cites this for premium-yield flows)* | `0x7750d328b314EfFa365A0402CcfD489B80B0adda` | High |

*Not found / unverified:* the **SlashEscrowFactory / redistribution escrow** mainnet address (redistribution confirmed live, but the deployed contract address did not surface). Do **not** use a guessed address — pull from the EigenLayer repo's redistribution config or EigenCloud deployed-contracts docs.

### 5.4 Disambiguation token (unrelated)

| Contract | Chain | Address | Confidence |
|---|---|---|---|
| Opolis **$WORK** (the cooperative's token) | Ethereum | `0x1482295Df16e7761d128B9823B61785D43CA038B` | High |
| Opolis **$WORK** | Polygon | `0x6002410dDA2Fb88b4D0dc3c1D562F7761191eA80` | Low (single indirect source) |

### 5.5 Market & TVL metrics (approximate — re-verify live)

| Metric | Value | As-of | Confidence |
|---|---|---|---|
| Renzo TVL | ~$195–217M (down >95% from ~$4B peak Jun 2024) | mid-2026 | Low (403 on APIs) |
| REZ price | ~$0.004–0.007 | mid-2026 | Low-Med |
| REZ market cap | ~$57–61M | mid-2026 | Low-Med |
| REZ max supply | 10,000,000,000 (10B) | — | High |
| REZ circulating | conflicting (~2.6B–8.6B across trackers) | mid-2026 | Low |
| EIGEN price | ~$0.18 (mcap ~$135M) | mid-2026 | Low-Med |
| EIGEN total supply | ~1.8B (on-chain bEIGEN ~1.68B) | mid-2026 | Med |
| AUSD price / ETH supply | ~$1.00 / ~68M | mid-2026 | Med |

---

## 6. Funding & backers

- **The bond itself** is *"supported by an EigenCloud Grant and a strategic investment from Renzo"* (per Renzo docs) — Eigen and Renzo are **financially backing** Opolis, not just providing rails.
- **Opolis:** ~$13.3M total. The **$6.6M bridge round (July 2023)** was led by **Greenfield**, with **NEAR Foundation, Draper Associates, Polygon Ventures** (~$50M valuation). Prior pre-seed/seed rounds preceded it.
- **Renzo:** ~$17M total — **$3.2M seed** (Jan 2024, led by **Maven11**, with Figment Capital, SevenX, IOSG, OKX Ventures, Bankless Ventures, 280 Capital) plus a **Binance Labs** strategic investment (Feb 2024, undisclosed; equity + 1:1 token warrants). REZ launched via **Binance Launchpool #53**, spot listing **April 30, 2024**.

### REZ tokenomics
- Max supply **10B**; initial circulating **1.05B (10.5%)**.
- Allocation: Community **32%**, Investors/Fundraising **31.56%**, Core Contributors/Team **20%**, Foundation **12.44%**, Binance Launchpool **2.5%**, Liquidity **1.5%**. Investors: 1-yr cliff + 10% unlock then 1-yr linear; team: 1-yr cliff + 2-yr linear.
- **Buyback & Burn (RP-6 "Renzo Riduzione"):** 75–100% of protocol revenue to buy back and burn ~10% of supply over **Nov 2025 → May 2026** (~9% burned, ~1% to ezREZ stakers). As of ~Jan 31, 2026: ~198.79M REZ bought back (~$2.27M), ~178.91M burned (~$2.04M).

---

## 7. Risks & controversies

1. **Renzo's April 2024 ezETH depeg** (counterparty track record). After the REZ tokenomics/airdrop announcement (Apr 24, 2024), ezETH lost peg — ~18% broad-market; momentarily ~$688–700 / "−79%" on thin DEX pools — because **redemptions weren't enabled**, forcing exits into shallow secondary liquidity. Triggered **~$56–60M+ of liquidations** across ~250 users (Gearbox: 115 credit accounts; Morpho Blue). Airdrop-fairness backlash (only ~5% to Season 1; Launchpool farmers received tokens ~2 days before ezETH recipients) forced Renzo to **revise airdrop terms** (Apr 28, 2024). **Lesson:** LRT/LST collateral carries real depeg/liquidation tail risk.
2. **Limited risk transfer in Opus I.** Because it has "no slashing," bondholders aren't absorbing insurance losses via slashing — claims are paid from premiums; the bond is reserve backing + yield. The **~40% APY** is funded by stablecoin yield + underwriting profit, raising a **sustainability question** if claims run hot. Genuine risk-bearing is deferred to later series.
3. **Counterparty / oracle / key-management trust.** EigenLayer warns the `redistributionRecipient` is the highest-value attack surface (compromise of slashing keys + recipient "can drain the entirety of Operator and Staker allocated stake").
4. **Opolis on-chain role ambiguity.** Whether Opolis is the registered AVS, operator, or pure beneficiary (with Renzo supplying operator plumbing) is not explicitly confirmed.
5. **Data-reliability caveat.** Every primary site is WAF-blocked to automated fetching, so exact current figures (Opus II status, live TVL/price) should be re-verified directly.

---

## 8. Why this matters for RIZK

**RIZK context:** a parametric insurance / catastrophe-bond protocol on **EigenLayer Duration Vaults** using **redistributable slashing** (`redistributionRecipient`) for payouts + **UMA** optimistic oracle for event verification + an integrated order book trading catbond-tokens (ERC-20, $0–$1 redemption).

### 8.1 Opolis Opus I vs RIZK — same neighborhood, different building
- **Opolis:** restaked stablecoin as **reserve backing**; claims paid **from premiums**; **no slashing**; principal protected; yield = stablecoin yield + underwriting profit. Closer to a *yield product with insurance branding*.
- **RIZK:** catbond-token principal **is at risk** and **gets slashed via `redistributionRecipient`** to pay parametric claims, with **UMA** resolving the trigger and an order book trading the $0–$1 token. A *true catastrophe bond* (principal-at-risk, parametric).

**Positioning:** Opolis validates the "restaking-backed insurance" thesis commercially, but RIZK is more aggressive and more crypto-native. **No one found is shipping RIZK's exact combination** (parametric + UMA + redistributable-slashing payout + tradable $0–$1 tranche token) end-to-end. **RIZK's risk is execution, not category invalidation.**

### 8.2 Competitors / precedents to study

| Project | What it does | Relevance to RIZK |
|---|---|---|
| **Cap (cap.app)** | EigenLayer's *named first redistribution AVS*. Restakers underwrite stablecoin operator credit risk; on default, stake is **slashed and redistributed to make stcUSD holders whole**. Three-party model (lenders ~12%, operators, restakers). Raised ~$11M (Franklin Templeton-led $8M); collateral incl. PYUSD, BUIDL, BENJI. | **Closest match to RIZK's plumbing** (slash → recipient → payout), but for credit risk not parametric events. Study recipient architecture, keeper incentives, safeguards hardest. |
| **Symbiotic + Re² Slashing Insurance Vaults (SIVs)** | Tranche restaked capital into **junior/mezzanine/senior** (Lloyd's/MBS-style); junior takes first loss for higher coupons; premiums via **expected-excess-loss**; oracles/on-chain logic confirm slashes. | **Tranching + premium-pricing blueprint** for RIZK's catbond tranches. |
| **Re Protocol (re.xyz)** | Tokenized reinsurance / ILS; junior **reUSDe** absorbs first loss, senior **reUSD** protected; idle funds in sUSDe for yield; ~23% APY; ~$15M fund. | **Closest economic analog to a cat bond** (real-world peril → junior loss → ILS yield), though licensed insurers + off-chain adjustment, not parametric/restaking. |
| **Sherlock** | Audit/exploit cover; staked USDC slashed/liquidated to pay claims; committee votes first, denied claims **escalate to UMA** for a bonded fee (~$9,600 + UMA fee, half-refunded if upheld). | **UMA-as-claims-court precedent** — lift the two-layer anti-frivolous-claim design directly. |
| **Nexus Mutual** | Largest DeFi mutual; integrated **Symbiotic (Nov 2025)** for yield-bearing reinsurance/underwriting vaults **aligned to cover durations**; ships ETH/Babylon BTC slashing cover. | **Duration-matching** lesson for RIZK "Duration Vaults"; discretionary vs parametric claims contrast. |
| **Neptune Mutual** | Parametric cover marketplace (ETH/Arbitrum/BNB); pays on parameters without proof of loss; ~9-day resolution. | Parametric demand precedent (pool-based, not restaking; UMA not confirmed). |
| **Etherisc** | Most mature on-chain parametric insurer; flight-delay + crop/catastrophe (flood, hurricane) pilots; pools >$35M; **Chainlink** oracles. | Proves parametric on-chain payouts at modest scale (traditional pooled capital, not restaking/slashing/UMA). |
| **Eigensurance** | Markets "AI-managed parametric insurance on EigenLayer AVS" — but only a landing page is verifiable. | Signal the idea is "in the air"; not a serious incumbent. Worth a direct GitHub/on-chain check. |

### 8.3 Concrete design lessons for RIZK
1. Point `redistributionRecipient` at an **immutable, timelocked payout/escrow contract**, never a hot wallet (it can't be changed after operator-set creation anyway).
2. Handle the **two-step, non-atomic** slash → `clearBurnOrRedistributableShares` flow; incentivize a keeper to call the clearing function (slashing "never fails," but transfer is a separate permissionless call).
3. Align coverage epochs with EigenLayer **safety/deallocation delays** (and track **ELIP-016** redistribution-delay) so underwriters can't exit between event and UMA resolution.
4. **Tranche** catbond tokens and price each off **expected-excess-loss**, not a flat rate (the $0–$1 redemption is effectively a binary/recovery payoff per tranche).
5. Keep UMA triggers **crisp and machine-verifiable**; bond claim assertions as a % of payout; generous liveness; route disputes to the DVM; use UMA as an **escalation court**, not the primary trigger.
6. Own the **basis risk** (parametric ≠ indemnity) explicitly — acceptable for a cat bond, but the trigger definition *is* the product.
7. If accepting LRTs (ezETH) as collateral, **haircut and stress-test the correlation tail** — a restaking systemic event could trigger payouts *and* crater collateral simultaneously (cf. the 2024 ezETH depeg). No dedicated insurance vault using ezETH as coverage collateral was found — opportunity + unproven.

### 8.4 EigenLayer redistribution mechanics (reference)
- **ELIP-006 ("Redistributable Slashing"):** *"allows AVSs to redirect those funds to a designated recipient address, enabling new use cases like insurance, lending, and DeFi protocols."*
- `redistributionRecipient` is set at operator-set creation and **CANNOT be changed**.
- Two-phase: slashing reduces shares → permissionless `clearBurnOrRedistributableShares` converts to tokens and transfers to burn address or recipient.
- **Native ETH and EIGEN are NOT eligible** for redistribution; all other staked ERC-20s/LSTs/AVS tokens are.
- Fully opt-in at every layer. A **14-day slashing escrow** window applies; **ELIP-016** adds a **7-day** redistribution delay (anti-abuse/dispute).
- **Duration Vaults** (ELIP-15 MERGED; ELIP-017 DRAFT fixes): time-bound strategies giving guaranteed stake commitments for a fixed period. Exact numeric max-duration cap **unconfirmed** in accessible sources.

---

## 9. Open questions / to verify live
- **Opus II / later-series status** as of June 2026 (did claims-risk series ship?).
- **Live Opus vault size & holders** — read `opusIAUSD` (`0xcca2af7e…82ea5`) and the Opolis deployer on-chain.
- **The Renzo Flow Vault deposit/wrapper contract** for Opus I (address not surfaced).
- **EigenLayer SlashEscrowFactory / redistribution escrow** mainnet address.
- **Exact live TVL/price/supply** for Renzo, EIGEN, REZ, AUSD (CoinGecko MCP or unblocked explorer).
- **Opolis's precise on-chain role** (AVS owner vs operator vs beneficiary).

---

## 10. Sources

### The project (Opolis Reinsurance Bonds / Opus Series)
- Renzo docs — Opolis Reinsurance Bonds: https://docs.renzoprotocol.com/docs/products/staking-suite/opolis-reinsurance-bonds
- Opolis blog — "Opolis Brings Healthcare Insurance Onchain with Renzo & EigenCloud": https://opolis.co/benefits/opolis-brings-healthcare-insurance-onchain-with-renzo-eigencloud/
- Opolis — Opus Series / Reinsurance Bonds page: https://opolis.co/insurance/bonds/
- Renzo blog — Case Study: Network-Issued "Restaking Bonds" with Flow Vaults (Jun 26, 2025): https://blog.renzoprotocol.com/2025/06/26/case-study-network-issued-restaking-bonds-with-flow-vaults/
- Renzo case study (Mirror): https://mirror.xyz/0x3Bce01Da1a431Bfefdd6807dfc2cf7a7C0755008/Z5bDNGN37LbWPSQBqS2p64Mh8OAO3Ig0tsiXIaMnrZU
- Opolis on X — Opus I launch ("40% APY ✅ Restaked AUSD ✅ No slashing, no emissions"): https://x.com/opolis/status/1947718288986747255
- Opolis on X — announcement thread (1/10): https://x.com/opolis/status/1947659839758348567
- Tim Draper on X (endorsement): https://x.com/TimDraper/status/1952761573774356986
- opusIAUSD token (Etherscan): https://etherscan.io/address/0xcca2af7ec2e0b55d9cb1d9d36e542a1085e82ea5

### Opolis (entity / $WORK / funding)
- GlobeNewswire — $WORK token launch (Apr 22, 2021): https://www.globenewswire.com/en/news-release/2021/04/22/2215144/0/en/Opolis-Employment-Commons-Launches-WORK-Token.html
- Business Wire — Opolis raises $6.6M bridge round (Jul 13, 2023): https://www.businesswire.com/news/home/20230713231230/en/
- Greenfield — Backing Opolis: https://greenfieldcapital.com/2023/07/13/backing-opolis-the-digital-employment-commons/
- BadgerDAO — BIP 49 (Opolis strategic investment & integration): https://forum.badger.finance/t/bip-49-opolis-strategic-investment-integration/4071
- Opolis GitHub org: https://github.com/opolis
- Opolis $WORK token (Etherscan): https://etherscan.io/address/0x1482295Df16e7761d128B9823B61785D43CA038B

### Renzo
- Renzo docs (ezETH): https://docs.renzoprotocol.com/docs/products/staking-suite/ezeth
- Renzo docs (pzETH): https://docs.renzoprotocol.com/docs/products/restaking/pzeth
- Renzo docs (REZ tokenomics): https://docs.renzoprotocol.com/docs/renzo/usdrez/rez-tokenomics
- Renzo docs (Ethereum mainnet contracts): https://docs.renzoprotocol.com/docs/contracts/ethereum-mainnet
- Renzo blog (buyback & burn, Nov 5, 2025): https://blog.renzoprotocol.com/2025/11/05/renzo-completes-its-inaugural-buyback-and-burn-event-aiming-to-reduce-total-supply-by-at-least-10/
- Binance — REZ Launchpool announcement: https://www.binance.com/en/support/announcement/introducing-renzo-rez-on-binance-launchpool-farm-rez-by-staking-bnb-and-fdusd-b1e64410cc9c4ab29687392f5581a61b
- The Block — Binance Labs invests in Renzo (Feb 2024): https://www.theblock.co/post/278564/binance-labs-renzo-ethereum-restaking
- The Block — ezETH depegs 18.3% (Apr 2024): https://www.theblock.co/post/290709/renzos-ezeth-depegs-18-3-following-rez-tokenomics-announcement-on-binance
- DL News — ezETH drops 79% in under an hour: https://www.dlnews.com/articles/defi/renzos-ezeth-loses-ether-peg-drops-79-in-under-one-hour/
- CoinDesk — Renzo ezSOL on Solana/Jito (Aug 2024): https://www.coindesk.com/tech/2024/08/14/as-restaking-takes-shape-on-solana-ethereum-focused-renzo-jumps-in-with-ezsol
- DailyCoin — Renzo raises $17M across two rounds: https://dailycoin.com/renzo-protocol-raises-17-million-across-two-funding-rounds/
- DefiLlama — Renzo: https://defillama.com/protocol/renzo
- CoinGecko — Renzo (REZ): https://www.coingecko.com/en/coins/renzo
- CoinGecko — ezETH: https://www.coingecko.com/en/coins/renzo-restaked-eth

### EigenLayer / EigenCloud (slashing & redistribution)
- ELIP-006 (Redistributable Slashing): https://github.com/eigenfoundation/ELIPs/blob/main/ELIPs/ELIP-006.md
- EigenCloud blog — Redistribution is Live on Mainnet (Jul 22, 2025): https://blog.eigencloud.xyz/redistribution-is-live-on-mainnet/
- EigenCloud blog — Redistribution is Live on Testnet (Jun 5, 2025): https://blog.eigencloud.xyz/redistribution-is-live-on-testnet/
- EigenCloud blog — Slashing Goes Live (Apr 17, 2025): https://blog.eigencloud.xyz/slashing-goes-live/
- EigenCloud docs — Redistribution concept: https://docs.eigencloud.xyz/eigenlayer/concepts/slashing/redistribution
- EigenLayer Forum — ELIP-15 (Duration Vault Strategies, MERGED): https://forum.eigenlayer.xyz/t/merged-elip-15-duration-vault-strategies/14784
- EigenLayer Forum — ELIP-016 (Redistribution Delay, draft): https://forum.eigenlayer.xyz/t/draft-elip-016-redistribution-delay/14829
- EigenLayer Forum — ELIP-017 (Duration Vault Fixes, draft): https://forum.eigenlayer.xyz/t/draft-elip-017-duration-vault-fixes/14830
- EigenLayer contracts (GitHub README + mainnet config): https://github.com/Layr-Labs/eigenlayer-contracts
- The Defiant — EigenLayer slashing on mainnet: https://thedefiant.io/news/blockchains/eigenlayer-launches-slashing-feature-on-mainnet-april-17-2025-enhancing-5e84262c
- CoinDesk — EigenLayer adds slashing: https://www.coindesk.com/tech/2025/04/17/eigenlayer-adds-key-slashing-feature-completing-original-vision

### Agora / AUSD
- AUSD token (Etherscan): https://etherscan.io/token/0x00000000efe302beaa2b3e6e1b18d08d69a9012a
- Ethplorer — Agora Dollar (AUSD): https://ethplorer.io/address/0x00000000efe302beaa2b3e6e1b18d08d69a9012a
- Messari — Agora (AUSD): https://messari.io/project/agora-dollar
- Nick van Eck / Agora — "Stablecoin 3.0" (Medium): https://medium.com/agora-ausd/ausd-stablecoin-3-0-and-why-yield-bearing-stables-are-not-money-or-stablecoins-e84951bd1216
- CoinGecko — Agora Dollar: https://www.coingecko.com/en/coins/agora-dollar

### Insurance-via-restaking landscape (RIZK comparables)
- Cap raises $11M (CoinDesk, Apr 6, 2025): https://www.coindesk.com/tech/2025/04/06/cap-raises-usd11m-to-fuel-stablecoin-engine-as-industry-heats-up
- Cap Labs × EigenLayer (Blockworks): https://blockworks.com/news/cap-labs-eigenlayer
- EigenCloud blog — TradFi Meets DeFi (Cap/EigenLayer/YieldNest): https://blog.eigencloud.xyz/tradfi-meets-defi-publicly-traded-flow-traders-comes-onchain-through-cap-eigenlayer-and-yieldnest/
- Symbiotic blog — Slashing Insurance Vaults: https://blog.symbiotic.fi/slashing-insurance-vaults/
- CoinDesk — Nexus Mutual integrates Symbiotic (Nov 19, 2025): https://www.coindesk.com/business/2025/11/19/defi-insurance-alternative-nexus-mutual-integrates-restaking-specialist-symbiotic
- UMA docs — OO-v3 Insurance tutorial (primary source): https://raw.githubusercontent.com/UMAprotocol/uma-docs/master/developers/optimistic-oracle-v3/in-depth-tutorial-insurance.md
- UMA docs — OO-v2 insurance-claims-arbitration (primary source): https://raw.githubusercontent.com/UMAprotocol/uma-docs/master/developers/optimistic-oracle/in-depth-tutorial-insurance-claims-arbitration.md
- Re Protocol docs: https://docs.re.xyz/protocol/how-the-re-protocol-works
- The Defiant — Ethena × Re reinsurance: https://thedefiant.io/news/defi/ethena-re-partnership-reinsurance-market
- Sherlock docs — payout criteria / UMA escalation: https://docs.sherlock.xyz/audits/watsons/meeting-the-payout-criteria
- Etherisc: https://etherisc.com/
- Neptune Mutual docs: https://neptunemutual.com/docs/covers/introduction/
