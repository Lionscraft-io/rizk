# Nayms / OnRe Crypto‑Denominated ILW — On‑Chain Footprint Verification Report

**Prepared:** 2026‑06‑14
**Subject:** Verify and document the on‑chain footprint of Nayms' (now **OnRe**) crypto‑denominated Industry Loss Warranty (ILW) reinsurance transactions, separating what is verifiable on‑chain from marketing claims.

**Confidence flags used throughout:**
- ✅ **confirmed** via on‑chain / block‑explorer data, or from the issuer's own deterministic primary source (deployment registry)
- 🟡 **inferred** / primary‑source but not independently chain‑re‑confirmed in this environment
- ⚠️ **cannot verify** — split into **(never disclosed)** and **(tooling‑blocked)**

---

## 0. Bottom line up front

**Almost nothing about the *specific ILW deals* is independently verifiable on‑chain.** That conclusion is robust for three compounding reasons — only one of which is a tooling limit:

1. **Nayms never published** a cell address, participation‑token address, or transaction hash for *either* ILW, or for the November‑2023 secondary trade. (Confirmed by exhaustive multi‑angle search across primary press, trade press, GitHub, and docs.)
2. **The architecture hides per‑deal data by design.** Nayms is a single **EIP‑2535 "diamond"** contract. When USDC is deposited it is minted into an **internal ledger as a `bytes32` object ID**; participation / cell tokens are **internal ledger entries inside that one diamond — not separate ERC‑20 contracts**. So there is *no per‑ILW token address* to look up holders on, and the Nov‑2023 trade was an *internal ledger transfer*, not a standard ERC‑20 `Transfer` event. Even an analyst with full Etherscan access could not cleanly isolate one cell's collateral without the (unpublished) object ID.
3. **This environment blocked every block explorer and RPC** (Etherscan, Basescan, Blockscout, Routescan, Ethplorer, Blockchair, public RPC nodes) — all returned HTTP 403 to the fetch tool or were egress‑blocked to shell `curl`. Only **GitHub** (`raw.githubusercontent.com`) and **WebSearch result snippets** of indexed explorer pages were reachable.

What **is** verifiable sits at the **platform level**, not the deal level: the diamond contracts exist and are the addresses Nayms published; the public NAYM and ONyc tokens and their holder counts are visible. **The headline ILW trade sizes the user wanted are not in the public record at all.**

| The five asks | Verdict |
|---|---|
| 1. Contract addresses (ETH + Base) | ✅ **Found** — diamond proxies + all facets, from Nayms' own deployment registry |
| 2. USDC size of each ILW | ⚠️ **Never disclosed**, and not isolable on‑chain (internal‑ledger architecture). The cited **~$12M is total capital raised, NOT either ILW.** |
| 3. Nov‑2023 secondary trade (~50%) | 🟡 **Reported & plausible, but NO on‑chain proof published** — no tx hash, no addresses, counterparties unnamed |
| 4. Did either ILW trigger / pay out? | ✅ **Neither trigger was breached** (off‑chain cat‑loss data) → both expired without payout |
| 5. Participation‑token holder counts | ⚠️ **Not a public token** — a handful of permissioned institutional entities inside the diamond, not publicly enumerable. (The *public* NAYM governance token has **5,529** holders — unrelated to the ILWs.) |

---

## 1. Method & hard limitations

**Reachable in this environment:** GitHub (`github.com`, `raw.githubusercontent.com`, GitHub API), and WebSearch (which returns search‑engine snippets — and these *did* surface live explorer data such as token holder counts and supply).

**Blocked in this environment (independently checkable by you):**
- `curl` from the shell is restricted to a host allowlist that **excludes all crypto RPCs and explorers** (`eth.llamarpc.com`, `mainnet.base.org`, `*.publicnode.com`, `rpc.ankr.com`, `1rpc.io`, `api.etherscan.io`, `api.basescan.org` — all "Host not in allowlist").
- WebFetch returned **HTTP 403** on every explorer / on‑chain API tried: `etherscan.io`, `basescan.org`, `api.etherscan.io`, `eth.blockscout.com`, `base.blockscout.com`, `api.ethplorer.io`, `api.blockchair.com`, `api.routescan.io`, `api.llama.fi`, `docs.nayms.com`, `docs.onre.finance`. `web.archive.org` was hard‑blocked for the tool.

**Consequence:** live on‑chain tracing (USDC balances, transfer history, event decoding) was **not possible**. Contract addresses below come from **Nayms' own published deployment registry** (`gemforge.deployments.json`) — authoritative for "what was deployed" but not independently re‑confirmed against a block explorer here. Two figures (NAYM holder count/supply; ONyc price/market cap) came through **WebSearch snippets of Basescan / aggregator pages** and are marked ✅ on that basis.

**Discipline:** all Nayms/OnRe press and marketing content is treated as **claims to be checked**, not facts. Negative findings ("never disclosed") are stated explicitly.

---

## 2. Contract addresses

**Primary source for all of Section 2:** `https://raw.githubusercontent.com/nayms/contracts-v3/main/gemforge.deployments.json` (cross‑confirmed by the repo README). 🟡 *Authoritative for "what Nayms deployed"; not independently explorer‑re‑confirmed in this environment.*

### 2.1 Ethereum mainnet (chain ID 1)
| Contract | Address |
|---|---|
| **Diamond proxy (marketplace)** | `0x39e2f550fef9ee15b459d16bD4B243b04b1f60e5` |
| TokenizedVaultFacet | `0xF2a003c4e86d00C90f58150993c92Cf3Cb48684E` |
| TokenizedVaultIOFacet | `0xE62d440d48Cf455BF90e16876604b7Ba46dd934a` |
| ACLFacet | `0x3568712e440955485B737E3d5B79c5C93cE3ffd6` |
| AdminFacet | `0x389C7A9d8DEB7E5516487e9237F6eC4db6D7C838` |
| EntityFacet | `0xBD6fBf3214666BF347888fE629454CDe97e92222` |
| GovernanceFacet | `0xdC3a51d47C069c24A3E35DDCBFFD7bB2C3D21281` |
| MarketFacet | `0xfd9239f87A7c3c6CcdA49EcdA8e287510BCdbd02` |
| NaymsOwnershipFacet | `0x7A0a9cD2Ac7Db16240346265016ce446D9834af4` |
| SimplePolicyFacet | `0x787Ec175614500fDeCf5D22178aBccaFE0355e4D` |
| StakingFacet | `0x4390D892DF9E79da6f64f2466F5A3d0a74629C74` |
| SystemFacet | `0xB2839a759300c025296848D73d76AFF5957F0047` |
| UserFacet | `0xef03F8eCAE6DdB5d63E6dd4354ea2ce5cc3C4c5F` |
| ZapFacet | `0x29c65Ba894A4Eea1c833D12a5458063988C4c731` |
| PhasedDiamondCutFacet | `0x4726277f61C488E25B51255A56dd323C83483cdb` |
| DiamondLoupeFacet | `0xe8bc322665d85d82cBFf2298274f617f5b73995b` |

### 2.2 Base (chain ID 8453)
| Contract | Address |
|---|---|
| **Diamond proxy (marketplace)** | `0x546Fb1621CF8C0e8e3ED8E3508b7c5100ADdBc03` |
| TokenizedVaultFacet | `0xEB0E8aCCe947A7688782305543d15f8Cb42c1041` |
| TokenizedVaultIOFacet | `0xf680AB32DF25618361A7423E59f2B7e6f200d2Fe` |
| ACLFacet | `0xEB971430a9c6962024c8027369C27165Eff54DD6` |
| AdminFacet | `0x9963A3DB0139Dd178B7473a314b0231D3127178C` |
| EntityFacet | `0xA626519d35d43e06E0431c58eA945124C5683980` |
| GovernanceFacet | `0xb4B8307712C2309e155406B94Fd53554f12beE49` |
| MarketFacet | `0x0330632c81cea6E50947c932eCC6EFDd71A635dB` |
| NaymsOwnershipFacet | `0x9f770f9D24ec224B893fCa5F287769A172c44883` |
| SimplePolicyFacet | `0xC3f59206d6038DEA4C816893825779c37bf27a60` |
| StakingFacet | `0x7Ac67aC5348a4e90193471547CaD9CE72D996756` |
| SystemFacet | `0xc250018c6E9162241333d5e2853eEc1a964AB2B0` |
| UserFacet | `0xCDAB0EBe722c0D541eA7208c2B7E612A425796aD` |
| ZapFacet | `0xbFdA39e3e5E8BcaE6ffEB3dd5c70FC08e0326518` |
| PhasedDiamondCutFacet | `0x320031935b9A9CBE004F7490f0cDe7455944A140` |
| InitDiamond | `0x81E1F74BC675cC55AfEE4D39d475911e904d5Cd1` |

### 2.3 Testnet diamond proxies (same registry)
- Sepolia (11155111): `0xc9FBBCA30856A960f48667834C129011EFD5612a`
- Base Sepolia (84532): `0x2561E3F2f79b2597CCF1752C47fb2EA54F463c95`
- Goerli (5): `0x428c9347a76943E4c625C11813A303Ca12B8675f`
- Base Goerli (84531): `0x99AEa617F26CF33d9e077D09776dFed6CAf8D3CC`
- Aurora Testnet: `0x4F10acBA59A206a66713380De02F9c09880A822F`

### 2.4 Tokens
| Token | Chain | Address | Notes | Flag |
|---|---|---|---|---|
| **NAYM** governance ERC‑20 | Base | `0x314d7f9e2f55B430ef656FBB98A7635D43a2261E` | Public sale 23 Oct 2024; **5,529 holders**, 1,000,000,000 supply (Basescan, Jun 2026) | ✅ |
| NAYM (tracker) | BSC | `0xc83e1d89803229e856cb51e3b9cc996933fcb065` | — | 🟡 |
| **OnRe "ONyc"** yield token | **Solana** (SPL) | `5Y8NV33Vv7WbnLfq3zBcKSdYPrk7g2KoiQoe7M2tcxp5` | Post‑rebrand; ~$1.10, ~$167M mcap (Jun 2026); sUSDe‑backed | ✅ |
| sUSDe (Ethena) deposit asset | Ethereum | `0x9D39A5DE30e57443BfF2A8307A4256c8797A3497` | OnRe deposit collateral | 🟡 |

### 2.5 Collateral (USDC) — canonical addresses
- Ethereum mainnet USDC: `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`
- Base USDC: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`

⚠️ **(tooling‑blocked)** Could not confirm on‑chain that the diamonds hold/held any specific USDC balance. Nayms states USDC (and USDM/USDG) are used as collateral; supported tokens are set on‑chain via the diamond's admin functions (not hard‑coded in repo config).

### 2.6 Chain mapping of the deals (🟡 inferred from timeline)
- **2023 ILW + Nov‑2023 secondary trade → Ethereum mainnet** (the diamond `0x39e2…60e5`).
- **2024 Florida ILW → Base** (the Base marketplace launched 11 Jan 2024; the diamond `0x546F…bc03`).
- Logical and well‑supported by dates, but **Nayms never tied either deal to an address.**

---

## 3. The two ILWs — structure confirmed, **size never disclosed**

### 3.1 The 2023 ILW
- **Issued 1 July 2023** (press release 6 July 2023). *Correction to the lead's "around June."*
- Structure: **US named‑windstorm retrocession** ILW, **attaching above a $60 billion** industry‑loss trigger.
- Issuer/vehicle: **"Nayms SAC Ltd.", the second segregated account ("cell").**
- Collateral: **USDC**, held in the segregated account on an *"independently audited Ethereum smart contract,"* secured via a *"digital multi‑signature process."*
- Buyer / cedent: **Prospero Re** (Bermuda Class 3A reinsurer, launched 2013, **wholly owned by Resolute Global Partners Ltd.**).
- Broker: **Guy Carpenter** (Marsh McLennan), **sole placing broker.**
- Underwriting assist: **Daniel Vestergren** (CEO, Varius Capital Partners; former head of ILS at Hiscox Bermuda).
- Trigger basis: 🟡 cited as **Prospero Re's proprietary "Footprint" cat‑modeling product — NOT PCS or PERILS** (correction to the lead). No index provider is named.
- Executive quote: **Tom Libassi** (Co‑Founder & Managing Partner, Resolute Global Partners): *"…the first‑ever property catastrophe reinsurance contract denominated in cryptocurrency."*

### 3.2 The 2024 ILW (on Base)
- **Launched 11 January 2024** as "the first institutional tokenized (re)insurance marketplace on Base"; the first product was this ILW.
- Peril: **Florida named windstorm.**
- Trigger: **dual** — verbatim, *"two independent named windstorms in Florida must each separately cause damage exceeding **$10 billion** to **the state's insured property** during the **2024 in‑force period**."*
- Collateral: **USDC**, Bermuda SAC structure, multi‑sig.
- Marketing: target **"mid‑high teen returns"** (a projection, not realized).
- Cedent / broker: ⚠️ **not named** in any accessible source (plausibly Resolute/Prospero again, but unsourced).

### 3.3 The size question (the crux)
> ⚠️ **(never disclosed)** The **USDC notional / limit / collateral size of each ILW is disclosed nowhere.** Probed 6+ ways across every primary and trade source. The only quantified figures in coverage are the **trigger levels** ($60bn / $10bn — industry‑loss thresholds, **not** the deal's capital) and market‑TAM color ($230bn / $300bn / $700–750bn). **Do not infer a deal size from these.**

---

## 4. The November 2023 "secondary trade"

- **Reported (🟡):** On **9 November 2023**, Nayms facilitated the *"first secondary trade of participation tokens (p‑tokens)"*: **"over 50%"** (Nayms' Medium) / **"50%"** (Artemis) of the 2023 ILW's capital was *"swapped between two capital providers… immutably recorded and seamlessly reconciled on the Ethereum blockchain."*
- **Sourcing is thin:** only **Nayms' own Medium post** + **Artemis.bm** (plus a LinkedIn repost). No CoinDesk / The Block / Ledger Insights / Reinsurance News coverage of *this specific trade*. (Do not confuse with the July‑2023 *issuance*, which was widely syndicated.)
- ⚠️ **(never disclosed) On‑chain proof: none.** No transaction hash, no wallet/counterparty addresses, no cell/object ID was ever published. The **two counterparties are not named** ("two capital providers"). No dollar amount given.
- 🟡 The trade most plausibly executed *inside* the mainnet diamond `0x39e2…60e5` as an **internal ledger transfer** — but that is inference, and such a transfer would **not** appear as a normal ERC‑20 transfer that could be filtered for without the unpublished object ID.

**Net:** a *reported milestone on Nayms' word + one trade outlet*. **Not independently confirmable on‑chain** from anything in the public record.

---

## 5. Did either ILW trigger? — **No. Both expired without payout.** ✅ (off‑chain cat data, high confidence)

| ILW | Threshold | Actual losses in covered period | Breached? |
|---|---|---|---|
| **2023** US named‑wind | **$60bn** US industry | 2023's only major US hurricane was **Idalia ≈ $2.5–5bn** (best ~$3.5bn). Total US named‑wind **≪ $10bn**. 2023's record cat year (~$108bn total) was driven by **severe convective storms (~$60bn), not hurricanes**. | ❌ **No** (~$55bn margin) |
| **2024** Florida dual‑wind | **two** storms, **each >$10bn** to **Florida** insured property | **Milton ≈ $20–25bn** (Florida landfall, Sarasota) ✅ cleared. **Helene's Florida share ≈ $3–5bn** ❌ (its larger US total was inland flood across GA/Carolinas/TN). **Debby <$1.5bn**. Only **one** of the required **two** storms cleared $10bn *in Florida*. | ❌ **No** (needed 2, got 1) |

The verbatim 2024 wording — *"the state's insured property"* — resolves the Florida‑vs‑US ambiguity: on a **Florida** basis the dual trigger is **not met**. (It would flip to a payout only under an aggressive US‑wide, all‑perils reading that the contract language rules out.)

### 5.1 Catastrophe‑loss evidence (sources)
- **Idalia (2023):** Moody's RMS $3–5bn (best $3.5bn); Verisk $2.5–4bn.
- **2023 macro:** Swiss Re — 2023 SCS insured losses ~$60bn (record); North Atlantic hurricane losses "below average."
- **Milton (Oct 2024):** Munich Re ~$25bn (largest single nat‑cat loss of 2024); Verisk $30–50bn onshore.
- **Helene (Sep 2024):** Moody's RMS $8–14bn (best $11bn) US; Verisk $6–11bn US; Munich Re $16bn (incl. flood/NFIP); KCC ~$6.4bn across nine states; **CoreLogic FL+GA wind/surge $3–5bn** → Florida‑only share single‑digit billions.
- **Debby (Aug 2024):** Moody's RMS "will not exceed $1.5bn" US private market.

**Implication:** Both ILWs most likely **expired profitably for the capital providers** (premium kept, no claim paid). Consistent with the absence of any settlement/commutation/payout transaction — though, per Sections 1–2, such a transaction could not have been observed on‑chain here even if one existed.

---

## 6. Holder / transfer counts

- ⚠️ **(never disclosed)** **The ILW participation tokens are NOT a public token.** They are internal, permissioned cell positions held by a **handful of whitelisted institutional capital providers**. There is no public token contract to enumerate holders on, and none was published. "A handful of institutional wallets" is the correct mental model; an exact count is not publicly determinable.
- ✅ **The public NAYM governance token** (Base `0x314d…261E`) shows **5,529 holders, 1,000,000,000 supply** (Basescan via search‑indexed data, Jun 2026). **This is the Oct‑2024 public‑sale governance token and is unrelated to the ILW participations** — do not conflate.
- ✅ **OnRe ONyc** (Solana): ~**$1.10**, market cap **~$167M** (Jun 2026) — the **post‑rebrand Solana yield product**, not the ILW line.

---

## 7. Capital figures — keep them separate

- **~$12M = total capital Nayms ever raised** (private token sale, ~2022; led by UDHC, with New Form, Tokentus, Keyrock). ✅ A corporate raise.
- **It is NOT the size of either ILW.** ILW sizes are **undisclosed** (Section 3.3).
- Other large numbers ($230bn / $300bn / $700–750bn) are **reinsurance‑market TAM marketing**, not deal sizes.

---

## 8. The OnRe rebrand (~May 2025) — context

- **Nayms → OnRe**, ~May 2025 (structured‑yield product launch 21 May 2025). CEO **Dan Roberts**: *"not just rebranding… completely restructured the company: new name, new team, new tech, new investors."* 🟡 Strict legal‑entity continuity is deliberately ambiguous.
- Backers: **Ethena, Solana Ventures/Foundation, RockawayX.** Regulated by the **Bermuda Monetary Authority** as a Segregated Accounts Company (IIGB + DABA licenses).
- **OnRe's product runs on Solana** (not Base/Ethereum): **ONyc** (Onchain Yield Coin, evolved from launch token **"ONe"**), backed by **Ethena sUSDe**; plus a revenue/airdrop token **$ONRE**.
- ⚠️ The leads **"onUSD"** and **"sONe"** appear **unfounded** — no such tokens; the staked asset is Ethena's **sUSDe**.
- **Therefore the OnRe era is NOT a continuation of the on‑chain ILW instruments** — different chain (Solana), different product (sUSDe yield pool). The EVM Nayms diamond is the legacy/parallel system.

---

## 9. Audits — the "independently audited" claim

- ⚠️ **(could not locate)** Nayms repeatedly markets an *"independently audited Ethereum smart contract,"* but **no audit report or named auditor for the EVM diamond could be found** (checked Halborn's public‑reports repo, the `contracts-v3` repo — no `audits/`/`security/` folder or PDFs — and search; no Halborn/ChainSecurity/Trail of Bits/Zellic report surfaced).
- The **only** audits located are **Quantstamp audits of the *Solana* OnRe app** — a different codebase:
  - "Nayms – OnRe Offer/Redemption Program Spec" — `https://certificate.quantstamp.com/full/nayms-on-re-offer-redemption-program-spec/caed5b0c-4b32-4d01-9a3a-aa2174f5485f/index.html`
  - "OnRe Solana Diff" — `https://certificate.quantstamp.com/full/on-re-solana-diff/b36b9c22-ed00-48e4-bbd1-66f98285a37b/index.html`
- **Net:** the EVM‑era ILW audit claim is **currently unsubstantiated from primary sources.**

---

## 10. Architecture — *why* the ILW data isn't on‑chain‑traceable

From `docs.nayms.com` (External Tokens + Platform Participation Tokens):

- Nayms v3 implements **EIP‑2535 (the Diamond standard)**, deployed via **Gemforge**.
- **External tokens:** "When an ERC‑20 token is transferred into Nayms, an internal token amount equal to the amount transferred is minted, the ID of which is derived from the address. The internal ledger then keeps track of ownership… When the ERC‑20 is withdrawn… the amount is burned and transferred out. **All balances and transfers are then done on the internal ledger.**" An external token is represented internally by a **`bytes32` object ID**.
- **Platform / participation tokens:** "A platform token is the token of an entity… identified by the `bytes32` object ID given to a tokenized entity. **A token of a Cell represents a share of the capital** in the insurance portfolio."

**Implications for forensics:**
1. There is **no separate ERC‑20 contract** per ILW participation token → no per‑deal address to query holders/transfers on.
2. USDC collateral is **pooled inside the diamond** and tracked as internal ledger balances → per‑cell collateral is **not separately visible** as a distinct on‑chain balance.
3. The Nov‑2023 trade was an **internal ledger transfer** emitting Nayms‑specific events, not a standard ERC‑20 `Transfer` → not filterable without the (unpublished) object ID + event decoding.

This is the core reason the deal‑level questions are not answerable from chain data **even with full explorer access** — compounded by Nayms never publishing the identifiers, and by this environment's blocked explorers.

---

## 11. Corrections to the original leads

| Lead | Finding |
|---|---|
| Trigger index "PCS or PERILS" (2023) | 🟡 Cited as **Prospero Re's "Footprint" cat‑model**; no index provider named |
| 2023 ILW issued "around June" | ✅ **1 July 2023** (PR 6 July) |
| Secondary trade "~50%" | ✅ **"over 50%"** (Nayms) / "50%" (Artemis) |
| 2024 trigger basis (Florida vs US) | ✅ **Florida** — "the state's insured property" → trigger **not met** |
| 2024 buyer/broker | ⚠️ **not disclosed** (cannot confirm "same as 2023") |
| OnRe tokens "onUSD"/"sONe" | ⚠️ **unfounded**; real assets are **sUSDe** (deposit), **ONyc** (yield), **$ONRE** (revenue) |
| OnRe = continuation of the ILWs | ❌ OnRe is **Solana**, a different sUSDe‑yield product; ILWs are the EVM Nayms diamond |

---

## 12. Explicit list of what could NOT be determined

**(a) Never disclosed by Nayms — hard/impossible to isolate even with full explorer access:**
- USDC size / collateral of the 2023 ILW and the 2024 ILW.
- Any cell address, participation‑token object ID, or tx hash for either ILW.
- The Nov‑2023 trade's tx hash, the two counterparties, and its dollar amount.
- The 2024 ILW's cedent and broker.
- A primary‑source audit report / named auditor for the **EVM** diamond.

**(b) Blocked by this environment's tooling — independently checkable by you:**
- Live USDC balances / historical flows of the diamonds `0x39e2…60e5` (ETH) and `0x546F…bc03` (Base).
- Independent block‑explorer re‑confirmation that those diamonds are verified and active.
- Decoding internal diamond events to bound aggregate collateral (an upper bound on total system TVL).

> **Optional upgrade:** the items in bucket (b) are recoverable. If you allowlist `api.etherscan.io` + `api.basescan.org` in the network egress and provide a free Etherscan/Basescan API key (or add an RPC host), I can pull the diamonds' **aggregate USDC balance history** and **exact holder counts**, and take a decoding pass at the July‑2023 deposit events. That still won't surface the unpublished per‑deal sizes or the trade hash (bucket (a)).

---

## 13. Independently checkable anchors & sources

**On‑chain / primary‑source anchors**
- Deployment registry (all addresses): `https://raw.githubusercontent.com/nayms/contracts-v3/main/gemforge.deployments.json`
- Repo: `https://github.com/nayms/contracts-v3` · Org: `https://github.com/nayms` · OnRe org: `https://github.com/onre-finance`
- ETH diamond: `https://etherscan.io/address/0x39e2f550fef9ee15b459d16bD4B243b04b1f60e5`
- Base diamond: `https://basescan.org/address/0x546Fb1621CF8C0e8e3ED8E3508b7c5100ADdBc03`
- NAYM token: `https://basescan.org/token/0x314d7f9e2f55B430ef656FBB98A7635D43a2261E`
- ONyc (Solana): `https://solscan.io/token/5Y8NV33Vv7WbnLfq3zBcKSdYPrk7g2KoiQoe7M2tcxp5`
- Architecture: `https://docs.nayms.com/general/external-tokens/` · `https://docs.nayms.com/general/platform-tokens/`

**2023 ILW**
- Artemis: `https://www.artemis.bm/news/resolute-and-nayms-partner-on-crypto-denominated-industry-loss-warranty-ilw/`
- The Insurer: `https://www.theinsurer.com/ti/news/prospero-re-secures-first-ever-crypto-ilw-from-nayms/`
- Reinsurance News: `https://www.reinsurancene.ws/nayms-launches-the-worlds-first-crypto-denominated-industry-loss-warranty/`
- PRNewswire: `https://www.prnewswire.com/news-releases/nayms-issues-worlds-first-crypto-denominated-industry-loss-warranty-ilw-301870868.html`
- Royal Gazette: `https://www.royalgazette.com/re-insurance/business/article/20230706/nayms-claims-an-industry-first/`

**Nov‑2023 secondary trade**
- Artemis: `https://www.artemis.bm/news/nayms-facilitates-secondary-trade-of-tokenised-crypto-denominated-ilw/`
- Nayms Medium: `https://medium.com/nayms/nayms-first-secondary-trade-of-tokenised-insurance-assets-e3ab791fa3f4`

**2024 Base ILW**
- captive.com: `https://www.captive.com/news/a-new-tokenized-reinsurance-blockchain-arrangement-launches`
- PRNewswire: `https://www.prnewswire.com/news-releases/nayms-launches-the-first-institutional-tokenized-reinsurance-marketplace-on-base-announcing-next-investment-opportunity-302032078.html`
- Royal Gazette: `https://www.royalgazette.com/international-business/business/article/20240114/nayms-launches-on-base/`

**OnRe rebrand**
- Insurtech Gateway: `https://www.insurtechgateway.com/2025/05/29/insurance-incubator-to-on-chain-reinsurer/`
- Reinsurance News: `https://www.reinsurancene.ws/ethena-backed-onre-launches-structured-yield-product/`
- The Block: `https://www.theblock.co/post/355248/solana-backed-onre-taps-ethena-for-first-one-token-and-pool-targets-750-billion-reinsurance-market`
- CoinGecko ONyc: `https://www.coingecko.com/en/coins/onyc`

**Catastrophe losses**
- Idalia: `https://www.verisk.com/company/newsroom/verisk-estimates-insured-losses-from-hurricane-idalia-to-range-from-usd-2-5-billion-to-usd-4-billion/`
- 2023 SCS record: `https://www.swissre.com/press-release/Insured-losses-from-severe-thunderstorms-reach-new-all-time-high-of-USD-60-billion-in-2023-Swiss-Re-Institute-estimates/4a15acf7-64b4-4766-8662-1c35d268ab12`
- Milton (Verisk): `https://www.verisk.com/company/newsroom/verisk-estimates-industry-insured-losses-for-hurricane-milton-will-range-between-usd-30-billion-to-usd-50-billion/`
- Helene (Verisk): `https://www.verisk.com/company/newsroom/verisk-estimates-industry-insured-losses-in-u.s.-for-hurricane-helene-will-range-between-usd-6-billion-to-usd-11-billion/`
- Helene wind/surge (CoreLogic): `https://www.businesswire.com/news/home/20240927600682/en/`
- 2024 figures (Munich Re): `https://www.munichre.com/en/company/media-relations/media-information-and-corporate-news/media-information/2025/natural-disaster-figures-2024.html`
- Debby (Moody's RMS): `https://www.rms.com/newsroom/announcement/2024-08-14/`

**Audits**
- Quantstamp (Solana OnRe): `https://certificate.quantstamp.com/full/nayms-on-re-offer-redemption-program-spec/caed5b0c-4b32-4d01-9a3a-aa2174f5485f/index.html`

---

## 14. Confidence‑flagged claim register (summary)

| # | Claim | Flag |
|---|---|---|
| 1 | Nayms diamond proxies deployed at ETH `0x39e2…60e5` and Base `0x546F…bc03` (+ facets) | ✅ (issuer registry) / 🟡 (not explorer‑re‑confirmed) |
| 2 | NAYM governance token (Base) has 5,529 holders, 1B supply | ✅ |
| 3 | ONyc (Solana) ~$1.10, ~$167M mcap | ✅ |
| 4 | 2023 ILW: US named‑wind retro, $60bn trigger, Prospero Re buyer, Guy Carpenter broker, issued 1 Jul 2023, USDC collateral, 2nd cell | ✅ (structure, via trade press) |
| 5 | 2023 trigger basis = "Footprint" model, not PCS/PERILS | 🟡 |
| 6 | 2024 ILW: Florida dual trigger, two storms each >$10bn FL insured, on Base, launched 11 Jan 2024 | ✅ (structure) |
| 7 | Size/notional of either ILW | ⚠️ never disclosed |
| 8 | Nov‑2023 secondary trade happened (over 50%, two providers, on Ethereum) | 🟡 (reported, 2 sources) |
| 9 | On‑chain proof (tx hash/addresses/counterparties) for the trade | ⚠️ never disclosed |
| 10 | 2023 $60bn trigger NOT breached (~$55bn margin) | ✅ |
| 11 | 2024 dual‑$10bn FL trigger NOT breached (only Milton cleared, Helene FL ~$3–5bn) | ✅ |
| 12 | Participation‑token holders = handful of permissioned institutions, not publicly enumerable | ⚠️ never disclosed (architecture) |
| 13 | ~$12M = total capital raised, NOT either ILW | ✅ |
| 14 | OnRe = Solana product (ONyc/sUSDe/$ONRE), separate from EVM ILWs; "onUSD"/"sONe" unfounded | ✅ / ⚠️ (those leads) |
| 15 | EVM diamond "independently audited" claim | ⚠️ could not locate report/auditor |
| 16 | Live USDC balances/flows of the diamonds | ⚠️ tooling‑blocked |

---

*End of report. All dollar figures for the ILW deals themselves are undisclosed in the public record; all addresses above are independently checkable on Etherscan/Basescan/Solscan.*
