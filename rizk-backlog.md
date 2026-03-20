# RIZK — Product backlog

## v1 scope (current design)

### Core instrument
- **Catbond-token**: ERC-20, freely transferable, represents proportional claim on Duration Vault principal
- Par value: $1.00 USDC. Redemption range: $0.00–$1.00 depending on slash severity
- Premium yield flows separately via EigenLayer RewardsCoordinator
- No minimum purchase (fractional tokens OK, $1 entry)

### Risk holder side
- KYB-verified via RIZK Registry (on-chain attestation)
- Coverage agreement = smart contract state, not a token
- Payout via EigenLayer `redistributionRecipient` (immutable at vault creation)
- Quarterly advance premium into escrow; rate = premiumRate × actualFill
- Partial fill: risk holder can lock below target (above `minimumFill`), terms adjust proportionally (Option A: proportional scale-down)
- Minimum escrow at creation based on `minimumFill` scenario; top-up at lock for actual fill
- Lock call snapshots current balance; supports `minBalance` parameter as safety check
- Auto-lock when vault hits target (`autoLockAtTarget: true` by default)

### Capital provider side
- Permissionless — anyone with USDC
- ICO-style commitment system: commitment window (7 days) → deposit day (24h: 12h priority round for ticket holders, 12h open round)
- 1% commitment bond (applied toward deposit, forfeited on no-show)
- Pro-rata allocation if oversubscribed
- Exit pre-lock: redeem 1:1 from vault or sell on market
- Exit post-lock: sell on built-in market only (no vault withdrawal until maturity/trigger)

### Built-in market
- Integrated order book (CLOB), part of RIZK protocol — not external
- Trading pair: catbond-token / USDC
- Price range: $0.00–$1.00 (bounded by redemption value)
- Active during FILLING (at par) + ACTIVE (floating) + post-settlement (converge to redemption)
- Market maker liquidity rewards program (Polymarket-style Q-score)

### Oracle and settlement
- UMA Optimistic Oracle: propose → dispute → DVM fallback
- Natural language assertion resolved to numeric value
- Graduated payout: attachment points map severity → slash % (`wadsToSlash`)
- EigenLayer Duration Vault, redistributable operator set, ERC-20 only (USDC)
- Arbitrator triggers early exit on premium default only (14-day grace period)

### Market parameters (set by risk holder at creation)
- `coverageTarget` — desired total vault size
- `minimumFill` — minimum % to lock (default 30%)
- `premiumRate` — annual rate on actual fill
- `duration` — coverage period (max 2 years per EigenLayer)
- `commitmentWindow` — days for ticket reservations (default 7)
- `commitmentBond` — % of committed amount (default 1%)
- `perilType` — category of risk (hurricane, earthquake, flood, drought)
- `region` — geographic coordinates + radius
- `attachmentPoints` — array of [threshold, slashPercentage] pairs
- `autoLockAtTarget` — auto-lock when fill = 100% (default true)

### Market states
```
CREATED → COMMITTING → DEPOSIT_DAY → DECISION/AUTO-LOCK → ACTIVE → TRIGGERED/MATURED/EARLY_EXIT → SETTLEMENT
```

### Three-layer architecture
1. **Layer 1: Market** — order book, market registry, liquidity rewards
2. **Layer 2: Protocol** — market factory, vault wrapper, premium escrow, RIZK AVS, coverage agreement
3. **Layer 3: Settlement** — EigenLayer Duration Vault, redistribution, UMA Oracle

---

## v2 backlog

### V2-001: Pre-market price discovery
**Priority:** High
**Description:** Allow investors to place limit orders BEFORE the vault is created/funded. The risk holder publishes market parameters and investors express interest at various price points. This provides a pricing signal — if bids cluster at $0.88 instead of $0.90, the market is saying 10% premium isn't enough.
**Depends on:** Active market maker participation, sufficient user base
**Notes:** Commitment totals during v1's commitment window serve as a rudimentary version of this signal.

### V2-002: Premium rate adjustment during filling (Option C)
**Priority:** High
**Description:** If the vault isn't filling, the risk holder can increase the premium rate to attract more capital. All existing depositors benefit from the higher rate (not just new ones). Alternative: risk holder sweetens the deal rather than accepting partial fill.
**Depends on:** V2-001 for full effect (pre-market signal tells risk holder what rate the market wants)
**Notes:** In v1, underfill is handled by Option A (proportional scale-down). Option C replaces this with dynamic pricing.

### V2-003: Tranche markets
**Priority:** Medium
**Description:** Multiple vaults per coverage agreement, each with different attachment points. Allows capital providers to pick their risk layer: Cat 1 tranche (lower yield, more likely trigger) vs. Cat 5 tranche (higher yield, tail risk). Market factory deploys 2-3 vaults instead of one.
**Depends on:** Sufficient liquidity to avoid fragmenting markets
**Notes:** Each tranche has its own catbond-token and order book. Start with 2-3 tranches max.

### V2-004: Voluntary early termination by risk holder
**Priority:** Medium
**Description:** Jamaica can request early exit from coverage (e.g., found cheaper coverage elsewhere, risk profile changed). Requires: early termination fee paid to token holders, governance approval or timelock, remaining premium forfeited for elapsed period.
**Depends on:** Arbitrator contract upgrade, governance framework
**Notes:** In v1, arbitrator only triggers on premium default. V2 adds voluntary termination as an arbitrator function with fee logic.

### V2-005: CLOB upgrade from AMM
**Priority:** Medium
**Description:** Upgrade built-in market from simple on-chain order book to full hybrid CLOB (off-chain matching, on-chain settlement) for tighter spreads and institutional-grade execution.
**Depends on:** Trading volume justifying infrastructure investment
**Notes:** V1 starts with on-chain limit orders. CLOB adds off-chain matching engine, WebSocket order book feeds, API for market makers.

### V2-006: Commitment bond tiering
**Priority:** Low
**Description:** Instead of flat 1% commitment bond, implement tiered rates: 1% up to $1M commitment, 0.5% for $1M-$10M, 0.25% above $10M. Reduces absolute cost for large institutional commitments.
**Depends on:** Institutional demand feedback
**Notes:** V1 uses flat 1% — simple and sufficient for initial markets.

### V2-007: Multi-peril coverage
**Priority:** Low
**Description:** A single coverage agreement covering multiple perils (hurricane + earthquake + flood) with independent triggers. One vault, but multiple oracle assertions can fire independently, each applying its own attachment point table.
**Depends on:** Oracle architecture supporting multiple independent assertions per market
**Notes:** V1 is single-peril per market. Risk holders needing multi-peril can open separate markets.

### V2-008: Chainlink integration for automated parametric triggers
**Priority:** Low
**Description:** For high-volume, well-defined perils (e.g., earthquake magnitude from USGS), add Chainlink data feeds as an alternative to UMA. Automated trigger: no human proposal needed, just oracle pushes data when threshold is met. Hybrid: Chainlink for automated triggers, UMA as fallback/dispute layer.
**Depends on:** Chainlink weather/seismic data feed availability
**Notes:** V1 uses UMA exclusively (flexible, supports any peril type). V2 adds Chainlink for specific perils where automated feeds exist.

### V2-009: Token holder governance for market parameters
**Priority:** Low
**Description:** Catbond-token holders can vote on specific market decisions: accept/reject early termination requests, approve premium rate changes mid-coverage, ratify disputed oracle resolutions before slash execution.
**Depends on:** Governance framework, sufficient token holder participation
**Notes:** V1 has no governance — arbitrator is a protocol-controlled address. V2 could make arbitrator a governance contract.

### V2-010: Secondary market for protection positions
**Priority:** Low
**Description:** Allow risk holders to transfer their coverage agreement to another verified entity (e.g., Jamaica transfers hurricane coverage to another Caribbean nation). Requires both parties to be KYB-verified. Assignment of benefits model.
**Depends on:** Legal/regulatory clarity on coverage transfer
**Notes:** V1: coverage agreement is non-transferable. V2 explores transferability between verified entities only.

### V2-011: Rolling / renewable vaults
**Priority:** Medium
**Description:** When a vault matures without trigger, offer automatic rollover into a new vault for the next coverage period. Existing token holders can opt in (their principal rolls over) or opt out (redeem). Reduces friction for multi-year coverage relationships.
**Depends on:** V1 market proving demand for recurring coverage
**Notes:** Duration Vaults are single-use by design. Rolling vaults would auto-deploy a new vault at maturity.

### V2-012: Deposit window configurability
**Priority:** Low
**Description:** Allow risk holders to customize commitment window length (3-14 days), deposit day duration (12-48h), priority/open round split, and minimum commitment amounts beyond the defaults.
**Depends on:** Feedback from v1 market creation experience
**Notes:** V1 defaults: 7-day commitment, 24h deposit day (12/12 split), 1% bond, no minimum commitment.
