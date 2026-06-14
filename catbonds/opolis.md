I found the actual on-chain artifact for the project: the **opusIAUSD** bond receipt token, labeled on Etherscan as *"Renzo Protocol: OpusIAUSD Token"* at `0xcca2af7ec2e0b55d9cb1d9d36e542a1085e82ea5`, plus an **Opolis Deployer** address. That, the verified AUSD contract, and all five agents give me enough to synthesize. (A quick disambiguation caught along the way: a separate ERC-20 "Opus (OPT)" token is unrelated — not part of this project.)
 
The CoinGecko MCP auth is still pending on your side, so the live price/TVL figures below are web-sourced and flagged as approximate — I can sharpen them the moment you authorize. Here's the full report.
 
---
 
# Opolis × Renzo × EigenLayer — Deep Research Report
*Compiled 2026-06-14. Primary sources (opolis.co, docs.renzoprotocol.com, eigencloud.xyz, Etherscan, DefiLlama, CoinGecko) actively block automated fetching, so claims are cross-corroborated across multiple independent searches; numeric market data is approximate and flagged.*
 
## Bottom line
 
The "Opolis + Renzo + EigenLayer" project is **real and live**. It's called **Opolis Reinsurance Bonds**, branded the **"Opus Series."** Depositors lock the **AUSD** stablecoin (Agora Dollar — *not* ezETH, which was my initial assumption) into a **Renzo Flow Vault**; that capital is **restaked on EigenLayer/EigenCloud** and used to **underwrite real health-insurance reserves** for the **Opolis** employment cooperative (the same organization behind the $WORK token). The first bond, **Opus I**, opened ~July 22, 2025, closed deposits July 31, 2025, and matured January 31, 2026. Opolis markets it as *"the first live real-world application of restaking in the insurance sector."*
 
One nuance that matters a lot for your RIZK work: **Opus I explicitly has "no slashing"** — so it uses restaked capital as *yield-bearing reserve backing*, not as a slashing/redistribution payout rail. That's a different (more conservative) model than RIZK's principal-at-risk catastrophe bond. More on that in §8.
 
## 1. What it actually is
 
It's a partnership product with **four** real parties (not three):
 
| Party | Role |
|---|---|
| **Opolis** | The insurance protocol / beneficiary. A digital employment cooperative ("Employment Commons") that provides payroll + group health benefits to freelancers, DAOs, and independent workers. It's bringing its health-plan reserves on-chain. |
| **Renzo** | The vault infrastructure. Its **Flow Vaults** framework issues the fixed-term, on-chain "restaking bond" that holds and deploys the capital. |
| **EigenLayer / EigenCloud** | The restaking/security layer underneath Renzo's vault — where the capital is restaked. |
| **Agora** | The collateral asset issuer. **AUSD** is the stablecoin deposited (a "hidden" but central fourth party). |
 
It is **not** "Metropolis," not a generic DeFi vault-curator, and not related to the unrelated "Opus (OPT)" ERC-20 or Chorus One's "OPUS Pool." The Opolis here is unambiguously the **$WORK-token employment cooperative** — its own X account ("OPOLIS | Employment Commons") posts both the cooperative material and the restaking-bond announcement.
 
Sources: [Renzo docs – Opolis Reinsurance Bonds](https://docs.renzoprotocol.com/docs/products/staking-suite/opolis-reinsurance-bonds), [Opolis blog](https://opolis.co/benefits/opolis-brings-healthcare-insurance-onchain-with-renzo-eigencloud/), [Opolis on X (Opus I launch)](https://x.com/opolis/status/1947718288986747255).
 
## 2. How the mechanism works
 
1. **Deposit:** A user deposits **AUSD** into the Opolis Opus I vault (accessed via the Renzo app) and receives **opusIAUSD**, a receipt token representing the bonded AUSD position. It auto-compounds (value-accruing, not rebasing).
2. **Restake:** Renzo's **Flow Vault** deploys that capital into yield-bearing positions and **restakes it on EigenLayer**, delegated to an AVS that backs Opolis's reinsurance pool.
3. **Underwrite:** The restaked capital **collateralizes Opolis's on-chain health-insurance reserve** — replacing traditional reinsurers and giving Opolis "predictable, guaranteed reserves."
4. **Premiums & claims:** Opolis members pay insurance premiums into a smart-contract pool; **claims up to ~65% of premiums are paid directly from premium dollars**. The restaked bond sits *behind* that as reserve backing.
5. **Yield & maturity:** The bond behaves like a **zero-coupon bond** — fixed term, fixed maturity. Bondholders earn a **blended ~40% APY** from (a) AUSD stablecoin/reserve yield and (b) insurance underwriting profits (i.e., when claims come in at or below expected). At maturity the contract returns principal + yield. (40% APY over the 6-month term ≈ ~20% realized for the period — consistent across sources, not a contradiction.)
 
**The "no slashing" point:** Opus I is marketed as *"No slashing, no emissions — just RealFi."* So in this first series the restaked principal is **proof-of-collateral that earns yield**, not capital that gets slashed to pay claims. Opolis has signaled that **Opus II (fall 2025) and later series will be larger and carry actual claims risk with variable yields.** Translation: redistributable slashing as a *claims payout* mechanism is on the roadmap, but Opus I doesn't exercise it yet.
 
## 3. The parties in depth
 
**Opolis.** A Colorado Limited Cooperative Association ("Employment Commons") offering payroll, benefits, and group health insurance to independent workers, DAOs, and solopreneurs. Launched the **$WORK** patronage/governance token in **April 2021**. Its new healthcare push runs through **Coalition Healthcare** plans, with the Opus bonds underwriting the **first ~2,500 covered lives**; plans went public January 1, 2026. VC **Tim Draper** publicly endorsed the on-chain insurance effort.
 
**Renzo.** A liquid-restaking protocol that has repositioned itself as a **"Yield Orchestration Layer."** Its original products are LRTs — **ezETH** (EigenLayer), **pzETH** (Symbiotic), and **ezSOL** (Solana/Jito). **Flow Vaults** are its newer framework for "network-issued restaking bonds" (see Renzo's [June 2025 case study](https://blog.renzoprotocol.com/2025/06/26/case-study-network-issued-restaking-bonds-with-flow-vaults/)), of which Opolis is the flagship real-world use case. Renzo also runs "Renzo Reserve" institutional vaults. Founders: **Lucas Kozinski, James Poole** (ex-TokenSoft CTO), **Kratik Lodha** (ex-Woodstock); founded 2023.
 
**EigenLayer / EigenCloud.** The dominant Ethereum restaking protocol (rebranded "EigenCloud" in 2025; token ticker still **EIGEN**). Relevant here is **redistributable slashing (ELIP-006)**, which went live on **mainnet July 22, 2025** — letting slashed funds route to an immutable `redistributionRecipient` instead of being burned, enabling insurance/coverage use cases. (Notably, that's the same week Opus I opened — but since Opus I has "no slashing," the timing looks like launch-partner symbolism rather than Opus I actually invoking redistribution.)
 
**Agora (AUSD).** "Stablecoin 3.0," minted 1:1 with USD, reserves (cash, U.S. Treasuries, repos) managed by **VanEck** in a bankruptcy-remote trust with **State Street** as custodian. Launched July 2024; founder **Nick van Eck**. AUSD itself doesn't pay holders yield directly, but Agora shares reserve economics with ecosystem partners — which is how the vault can source the "stablecoin yield" leg of the ~40% APY.
 
## 4. Timeline & current status
 
- **Apr 2021** — Opolis launches $WORK token.
- **Jul 2023** — Opolis raises $6.6M bridge round.
- **Jun 26, 2025** — Renzo publishes the "restaking bonds via Flow Vaults" case study.
- **Jul 22, 2025** — Opus I vault opens (~$500K target); EigenLayer redistribution goes live on mainnet the same week.
- **Jul 31, 2025** — Opus I deposit window closes.
- **Fall 2025** — Coalition Healthcare beta; Opus II slated to launch (larger, with claims risk).
- **Jan 1, 2026** — Opolis health plans go public.
- **Jan 31, 2026** — Opus I bond matures (principal + ~20%/period returned).
- **As of Jun 2026** — Opus I has matured; status of Opus II and subsequent series is the main open question (the live pages are fetch-blocked, so I can't confirm Opus II's current state without the CoinGecko/explorer access).
 
## 5. On-chain details
 
**Most relevant to this project:**
 
| Contract | Chain | Address | Confidence |
|---|---|---|---|
| **opusIAUSD** (Opus I bond receipt token; "Renzo Protocol: OpusIAUSD Token") | Ethereum | `0xcca2af7ec2e0b55d9cb1d9d36e542a1085e82ea5` | High (Etherscan label) |
| **AUSD** (Agora Dollar — the deposit asset) | Ethereum | `0x00000000eFE302BEAA2b3e6e1b18d08D69a9012a` | High (multi-explorer) |
| **Opolis: Deployer** | Ethereum | `0x7136fbddd4dffa2369a9283b6e90a040318011ca` | Medium (single Etherscan label) |
 
**Broader ecosystem (verified by GitHub config + Etherscan labels):**
 
| Contract | Address | Confidence |
|---|---|---|
| Renzo **ezETH** | `0xbf5495Efe5DB9ce00f80364C8B423567e58d2110` | High |
| Renzo **pzETH** (Symbiotic) | `0x8c9532a60E0E7C6BbD2B2c1303F63aCE1c3E9811` | High |
| Renzo **REZ** (governance) | `0x3B50805453023a91a8bf641e279401a0b23FA6F9` | High |
| Renzo **RestakeManager/Deposit** | `0x74a09653A083691711cF8215a6ab074BB4e99ef5` | Med-High |
| **EIGEN** token | `0xec53bF9167f50cDEB3Ae105f56099aaaB9061F83` | High |
| EigenLayer **StrategyManager** | `0x858646372CC42E1A627fcE94aa7A7033e7CF075A` | High |
| EigenLayer **DelegationManager** | `0x39053D51B77DC0d36036Fc1fCc8Cb819df8Ef37A` | High |
| EigenLayer **AllocationManager** | `0x948a420b8CC1d6BFd0B6087C2E7c344a2CD0bc39` | High |
| EigenLayer **RewardsCoordinator** *(the contract your RIZK backlog cites for premium-yield flows)* | `0x7750d328b314EfFa365A0402CcfD489B80B0adda` | High |
| Opolis **$WORK** (unrelated cooperative token) | `0x1482295Df16e7761d128B9823B61785D43CA038B` | High |
 
**Metrics (approximate — web-sourced, fetch-blocked):**
- **Renzo TVL:** ~$195–217M (collapsed >95% from a ~$4B peak in June 2024).
- **REZ:** ~$0.004–0.007, market cap ~$57–61M; max supply 10B. A buyback-and-burn program (RP-6, ~10% of supply, Nov 2025→May 2026) is running.
- **EIGEN:** ~$0.18, market cap ~$135M (mid-2026); total ~1.8B.
- **AUSD:** ~$1.00, Ethereum supply ~68M (multichain across Avalanche, Sui, Injective, Polygon, etc.).
- **Not found:** the SlashEscrow/redistribution escrow contract and the specific Renzo Flow Vault deposit contract for Opus I (the opusIAUSD token is the verifiable artifact; the vault wrapper address didn't surface).
 
## 6. Funding & backers
 
- **The bond itself** is *"supported by an EigenCloud Grant and a strategic investment from Renzo"* (per Renzo's docs) — so both Eigen and Renzo are financially backing Opolis, not just providing rails.
- **Opolis:** ~$13.3M raised total; the $6.6M bridge (July 2023) was led by **Greenfield**, with **NEAR Foundation, Draper Associates, and Polygon Ventures** (at a ~$50M valuation).
- **Renzo:** ~$17M total — $3.2M seed (Jan 2024, led by **Maven11**, with Figment, SevenX, IOSG, OKX Ventures, Bankless Ventures) plus a **Binance Labs** strategic investment (Feb 2024, undisclosed). REZ launched via **Binance Launchpool #53**, April 30, 2024.
 
## 7. Risks & controversies
 
- **Renzo's April 2024 ezETH depeg** is the big historical black mark on a counterparty. Following the REZ tokenomics/airdrop announcement, ezETH lost peg (~18% broad-market; momentarily ~$688–700 / "−79%" on thin DEX pools) because **redemptions weren't enabled**, forcing exits into shallow secondary liquidity. It triggered **~$56–60M+ of liquidations** across ~250 users (Gearbox, Morpho), plus an airdrop-fairness backlash that forced Renzo to revise terms. Lesson: LRT/LST collateral carries real depeg/liquidation tail risk.
- **Limited risk transfer in Opus I:** because it has "no slashing," bondholders aren't actually absorbing insurance losses via slashing — claims are paid from premiums, and the bond is reserve backing + yield. The ~40% APY is therefore funded by stablecoin yield + underwriting profit, which raises the question of *sustainability* if claims run hot. Genuine risk-bearing is deferred to later series.
- **Counterparty/oracle/key-management trust:** EigenLayer itself warns the `redistributionRecipient` is the highest-value attack surface (compromise of slashing keys + recipient "can drain the entirety of Operator and Staker allocated stake").
- **Data-reliability caveat:** every primary site is WAF-blocked to automated fetching, so exact current figures (especially Opus II status, live TVL/price) should be re-verified directly.
 
## 8. Why this matters for RIZK
 
This is the most useful part for you, because **Opolis is doing a *milder cousin* of what RIZK proposes**, and the landscape research surfaced your real competitors and the design lessons.
 
**Opolis Opus I vs RIZK — same neighborhood, different building:**
- **Opolis:** restaked stablecoin as **reserve backing**; claims paid **from premiums**; **no slashing**; principal protected; yield = stablecoin yield + underwriting profit. It's closer to a *yield product with insurance branding*.
- **RIZK:** catbond-token principal **is** at risk and **gets slashed via `redistributionRecipient`** to pay parametric claims, with **UMA** resolving the trigger and an order book trading the $0–$1 token. It's a *true catastrophe bond* (principal-at-risk, parametric).
 
So Opolis validates the "restaking-backed insurance" thesis commercially, but RIZK is a more aggressive, more crypto-native design. **Nobody found is shipping RIZK's exact combination** (parametric + UMA + redistributable-slashing payout + tradable $0–$1 tranche token) end-to-end. Your risk is execution, not category invalidation.
 
**The competitors/precedents you should actually study:**
- **Cap (cap.app)** — EigenLayer's *named first redistribution AVS*. Restakers underwrite operator credit risk; on default, stake is **slashed and redistributed to make stablecoin holders whole**. This is the closest match to RIZK's *plumbing* (slash → recipient → payout), just for credit risk instead of parametric events. Study its recipient architecture, keeper incentives, and safeguards hardest. (Raised ~$11M; Franklin Templeton-led $8M.)
- **Symbiotic + Re² "Slashing Insurance Vaults"** — the **tranching blueprint** (junior/mezzanine/senior, Lloyd's/MBS-style, premiums priced via **expected-excess-loss**). Maps directly onto your tranche idea and premium pricing.
- **Re Protocol (re.xyz)** — tokenized reinsurance / ILS economics (junior reUSDe absorbs first loss, senior reUSD protected). Closest *economic* analog to a cat bond, though it uses licensed insurers, not parametric triggers.
- **Sherlock** — the **UMA-as-claims-court** precedent: committee votes first, denied claims escalate to UMA for a sizable bonded fee (refunded if upheld). Lift this two-layer, anti-frivolous-claim pattern directly.
- **Nexus Mutual** — integrated Symbiotic (Nov 2025) for **duration-aligned underwriting vaults** — relevant to your "Duration Vaults" capital-matching.
- **Etherisc / Neptune Mutual** — live parametric on-chain cover precedents (but pooled capital + Chainlink, not restaking/slashing).
 
**Concrete design lessons for RIZK:**
1. Point `redistributionRecipient` at an **immutable, timelocked payout/escrow contract**, never a hot wallet (it can't be changed after operator-set creation anyway).
2. Handle the **two-step, non-atomic** slash → `clearBurnOrRedistributableShares` flow; incentivize a keeper to call the clearing function.
3. Align coverage epochs with EigenLayer **safety/deallocation delays** (and track **ELIP-016**'s redistribution-delay) so underwriters can't exit between event and UMA resolution.
4. **Tranche** catbond tokens and price each off **expected-excess-loss**, not a flat rate.
5. Keep UMA triggers **crisp and machine-verifiable**; use UMA as an escalation court, generous liveness, bonded assertions.
6. Own the **basis risk** (parametric ≠ indemnity) explicitly — it's acceptable for a cat bond but the trigger definition *is* the product.
7. If you accept LRTs (ezETH) as collateral, haircut and stress-test the **correlation tail** — a restaking systemic event could trigger payouts *and* crater collateral simultaneously (cf. the 2024 ezETH depeg).
