# RIZK — Architecture document

**Version:** 0.1 (Draft)
**Date:** March 2026
**Status:** Design phase

---

## 1. Executive summary

RIZK is an on-chain catastrophe bond and protection market protocol. It enables verified risk holders (sovereign nations, agricultural cooperatives, regional utilities) to obtain parametric catastrophe coverage by opening protection markets where permissionless capital providers stake collateral. Capital providers receive tradeable catbond-tokens representing their vault position, which can be bought and sold on a built-in market — creating the first liquid, retail-accessible catastrophe risk market.

The protocol sits on three infrastructure layers: an EigenLayer Duration Vault for collateral lockup and slashing-based payouts, UMA's Optimistic Oracle for event verification, and RIZK's own market and protocol contracts for instrument issuance, premium management, and secondary trading.

---

## 2. System architecture overview

RIZK is organized into three layers. Each layer has distinct responsibilities and can be reasoned about independently.

### Layer 1: Market (user-facing)

The trading interface and order book. This is what retail and institutional participants interact with. Includes the order book engine (on-chain limit orders for v1), market registry (catalog of all active protection markets), and a liquidity rewards program to incentivize tight spreads.

### Layer 2: Protocol (business logic)

The smart contracts that define RIZK's instrument mechanics. Includes the Market Factory (deploys new markets), Vault Wrapper (bridges between catbond-tokens and EigenLayer), Premium Escrow (manages risk holder payments), Commitment Manager (ICO-style deposit coordination), Coverage Agreement (on-chain record of risk holder terms), and the RIZK AVS (slash logic that connects oracle resolution to EigenLayer slashing).

### Layer 3: Settlement (external infrastructure)

EigenLayer (Duration Vault for locked collateral, AllocationManager for slashing, RewardsCoordinator for premium distribution) and UMA (Optimistic Oracle for event verification, DVM for dispute resolution).

---

## 3. Smart contracts

### 3.1 RIZK protocol contracts

#### 3.1.1 RizkRegistry

Manages the whitelist of approved risk holders. Risk holders must complete KYB verification off-chain; an authorized registrar then writes an on-chain attestation granting them the ability to create protection markets.

**Key state:**

- `approvedRiskHolders` — mapping of address → bool
- `riskHolderProfiles` — mapping of address → RiskHolderProfile (name, jurisdiction, verification hash)

**Key functions:**

- `approveRiskHolder(address entity, RiskHolderProfile profile)` — registrar only; adds entity to whitelist
- `revokeRiskHolder(address entity)` — registrar only; removes entity
- `isApprovedRiskHolder(address entity) → bool` — used by MarketFactory to gate market creation

**Access control:** Registrar role (multisig or governance contract). In v1, Registrar is a RIZK-controlled multisig.

#### 3.1.2 MarketFactory

The entry point for creating new protection markets. Deploys the full set of contracts for a market and registers the market in the MarketRegistry.

**Key function:**

```
createProtectionMarket(MarketConfig config) → marketId
```

**MarketConfig struct:**

```
struct MarketConfig {
    address riskHolder;              // Must be in RizkRegistry
    address payoutAddress;           // Where slashed funds go (becomes redistributionRecipient)
    IERC20 underlyingToken;          // USDC for v1
    uint256 coverageTarget;          // Desired vault size (e.g., 100_000_000e6)
    uint256 minimumFill;             // Min % to lock (e.g., 30 = 30%)
    uint256 premiumRateBps;          // Annual premium in basis points (e.g., 1000 = 10%)
    uint32 duration;                 // Coverage period in seconds
    uint32 commitmentWindow;         // Commitment phase duration in seconds
    uint256 commitmentBondBps;       // Bond as bps of commitment (e.g., 100 = 1%)
    bool autoLockAtTarget;           // Auto-lock when deposits hit coverageTarget
    string perilType;                // "HURRICANE", "EARTHQUAKE", etc.
    bytes32 regionHash;              // Keccak of geographic coordinates + radius
    string metadataURI;              // IPFS URI for full market metadata
    AttachmentPoint[] attachmentPoints; // Graduated payout thresholds
}

struct AttachmentPoint {
    uint256 threshold;               // Severity value (e.g., wind speed in km/h)
    uint256 slashBps;                // Slash percentage in basis points (e.g., 5000 = 50%)
}
```

**What `createProtectionMarket` deploys:**

1. CoverageAgreement — records the terms, risk holder, payout address
2. VaultWrapper — the EigenLayer staker contract that mints catbond-tokens
3. PremiumEscrow — holds and drips the risk holder's premium payments
4. CommitmentManager — manages the ICO-style commitment and deposit flow
5. CatbondToken — ERC-20 token (deployed by VaultWrapper)
6. Calls `StrategyFactory.deployDurationVaultStrategy()` on EigenLayer to create the Duration Vault
7. Registers the market in MarketRegistry

**Requirements:**

- `riskHolder` must be in RizkRegistry
- `duration` must be ≤ MAX_DURATION (2 years, per EigenLayer)
- `minimumFill` must be > 0 and ≤ 100
- `attachmentPoints` must be sorted ascending by threshold
- `premiumRateBps` must be > 0
- Premium escrow deposit (minimum commitment scenario) must be provided in the same transaction

#### 3.1.3 CommitmentManager

Manages the ICO-style commitment and deposit flow for each market. One instance per market.

**States:** COMMITMENT_OPEN → DEPOSIT_DAY → CLOSED

**Key state:**

- `commitments` — mapping of address → CommitmentTicket
- `totalCommitted` — running total of committed capital
- `commitmentDeadline` — timestamp when commitment window closes
- `depositDeadline` — timestamp when deposit day ends (commitmentDeadline + 24h)
- `priorityRoundEnd` — timestamp for priority round cutoff (commitmentDeadline + 12h)

**CommitmentTicket struct:**

```
struct CommitmentTicket {
    uint256 amount;           // Committed capital
    uint256 bondDeposited;    // 1% bond held
    bool deposited;           // Whether they deposited on deposit day
    uint256 actualAllocation; // Actual allocation (may be pro-rata if oversubscribed)
}
```

**Key functions:**

- `commit(uint256 amount)` — during commitment window; requires 1% bond transfer. Mints a ticket.
- `deposit()` — during priority round (first 12h of deposit day); ticket holders only. Deposits up to committed amount (or pro-rata allocation if oversubscribed). Bond is applied toward deposit.
- `depositOpen(uint256 amount)` — during open round (last 12h); anyone, if capacity remains. First come, first served.
- `claimBondRefund()` — after deposit day, for ticket holders who deposited. Returns unused bond (if pro-rata reduced their allocation). No-shows forfeit their bond.
- `getProRataAllocation(address investor) → uint256` — returns actual allocation if oversubscribed.

**Oversubscription logic:**

When commitment window closes, if `totalCommitted > coverageTarget`, each ticket holder's allocation is: `allocation = commitment × (coverageTarget / totalCommitted)`. Computed lazily on deposit call.

#### 3.1.4 VaultWrapper

The critical bridging contract between catbond-tokens and EigenLayer. This contract IS the staker in EigenLayer's eyes — it delegates to the Duration Vault, holds the vault shares, and issues catbond-tokens as liquid claims against those shares.

**Key state:**

- `catbondToken` — address of the ERC-20 catbond-token
- `durationVault` — address of the EigenLayer Duration Vault
- `totalDeposited` — total USDC deposited (before any slash)
- `slashAmount` — amount slashed (0 until trigger)
- `redemptionRate` — tokens to USDC rate (1.0 initially, decreases on slash)

**Key functions:**

- `deposit(uint256 amount)` — called by CommitmentManager during deposit phase. Deposits USDC into Duration Vault, mints catbond-tokens 1:1 to the depositor.
- `redeem(uint256 tokenAmount)` — called by token holders after vault enters WITHDRAWALS. Burns catbond-tokens, queues withdrawal from Duration Vault, sends pro-rata USDC to caller.
- `onSlash(uint256 slashedAmount)` — called by RIZK AVS (or detected via event). Updates `redemptionRate`. If 50% slashed, rate becomes 0.5.
- `getRedemptionRate() → uint256` — returns current USDC per catbond-token (1e18 precision).

**Premium distribution:**

The VaultWrapper implements a dividend-bearing ERC-20 pattern for the catbond-token. When premium rewards are distributed via EigenLayer's RewardsCoordinator, they accrue to the VaultWrapper (as the staker of record). The wrapper tracks "rewards per token" using a checkpoint mechanism — when a token holder claims rewards, they receive their pro-rata share based on how long they held tokens. This is the same pattern used by Synthetix's StakingRewards and Compound's cToken. Secondary market buyers inherit premium rights from the point of purchase.

**EigenLayer integration:**

The VaultWrapper must:
1. Delegate to the Duration Vault (which acts as its own operator) before any deposits
2. Call `StrategyManager.depositIntoStrategy()` for each deposit
3. After vault matures or is triggered, call `DelegationManager.queueWithdrawals()` and later `DelegationManager.completeQueuedWithdrawals()` to retrieve USDC for redemptions

#### 3.1.5 PremiumEscrow

Holds the risk holder's premium payments and drips them to the RewardsCoordinator on schedule.

**Key state:**

- `riskHolder` — the paying entity
- `quarterlyAmount` — premium per quarter (adjusted at lock based on actual fill)
- `nextPaymentDue` — timestamp of next required deposit
- `gracePeriod` — 14 days
- `totalDripped` — running total of premium distributed

**Key functions:**

- `depositPremium(uint256 amount)` — risk holder deposits quarterly premium
- `drip()` — permissionless; callable by anyone. Transfers accrued premium to RewardsCoordinator for distribution to token holders. Called continuously (e.g., daily or weekly by a keeper).
- `checkDefault() → bool` — returns true if premium is overdue past grace period
- `adjustForActualFill(uint256 actualFill)` — called once at lock. Recalculates quarterlyAmount based on actual vault fill. Refunds excess escrow to risk holder.
- `refundUnused()` — after settlement (trigger or maturity). Returns remaining escrowed premium to risk holder.

**Premium default flow:**

If `checkDefault()` returns true and grace period has elapsed, the RIZK arbitrator contract (or a keeper) calls `advanceToWithdrawals()` on the Duration Vault via the arbitrator role. This terminates coverage and allows token holders to exit.

#### 3.1.6 CoverageAgreement

On-chain record of the protection terms. Not a token — purely informational and used by the RIZK AVS for slash determination.

**Key state:**

- `riskHolder` — address
- `payoutAddress` — where slashed funds go
- `marketId` — reference to MarketRegistry
- `perilType` — string identifier
- `regionHash` — geographic hash
- `attachmentPoints` — sorted array of (threshold, slashBps)
- `duration` — coverage period
- `lockedAt` — timestamp when vault locked
- `status` — PENDING | ACTIVE | TRIGGERED | MATURED | TERMINATED

**Key functions:**

- `getSlashPercentage(uint256 severityValue) → uint256` — given an oracle-resolved severity, returns the appropriate slash percentage by walking the attachment point table. Returns 0 if below first threshold.
- `isActive() → bool` — true if status == ACTIVE and current time is within coverage period.

#### 3.1.7 RizkAVS

The Actively Validated Service registered on EigenLayer. This contract is the bridge between UMA's oracle resolution and EigenLayer's slashing mechanism.

**Key state:**

- `pendingAssertions` — mapping of marketId → UMA assertion ID
- `resolvedAssertions` — mapping of marketId → resolved severity value

**Key functions:**

- `requestOracleResolution(uint256 marketId, bytes ancillaryData)` — initiates a UMA oracle request for a specific market. Can be called by anyone who believes a qualifying event has occurred. The ancillary data encodes the question (e.g., "What was the maximum sustained wind speed in km/h within 50km of coordinates X,Y between dates A and B?").
- `onOracleResolution(uint256 marketId, int256 resolvedValue)` — callback from UMA adapter when assertion is finalized. Reads the severity value, queries CoverageAgreement.getSlashPercentage(), and if > 0, executes the slash.
- `executeSlash(uint256 marketId)` — calls `AllocationManager.slashOperator()` with the appropriate `wadsToSlash`. The operator being slashed is the Duration Vault itself (since it acts as its own operator).

**Slash execution:**

```
SlashingParams {
    operator: address(durationVault),      // Vault is its own operator
    operatorSetId: market.operatorSetId,
    strategies: [address(durationVault)],  // The strategy being slashed
    wadsToSlash: [slashPercentage],        // e.g., 0.5e18 for 50%
    description: "RIZK trigger: [perilType] [marketId]"
}
```

After slashing, `clearBurnOrRedistributeShares()` is called (permissionless) to transfer slashed funds to the `redistributionRecipient` (the risk holder's payout address).

#### 3.1.8 CatbondToken

Standard ERC-20 with additional accounting for premium distribution.

**Key properties:**

- Freely transferable (no restrictions post-mint)
- Fractional (18 decimals)
- Minted by VaultWrapper on deposit, burned by VaultWrapper on redemption
- Implements reward checkpoint tracking (rewards per token share, per-holder reward debt)
- No transfer restrictions — anyone can buy/sell on secondary market

#### 3.1.9 OrderBook

On-chain limit order book for catbond-token / USDC trading.

**Key state:**

- `bids` — sorted list of buy orders (price descending)
- `asks` — sorted list of sell orders (price ascending)
- `orders` — mapping of orderId → Order struct

**Order struct:**

```
struct Order {
    address maker;
    bool isBuy;
    uint256 price;       // USDC per token (6 decimals, range 0–1e6)
    uint256 amount;      // Token quantity
    uint256 filled;      // Amount already filled
    uint256 timestamp;
}
```

**Key functions:**

- `placeLimitOrder(bool isBuy, uint256 price, uint256 amount) → orderId` — places a limit order. Buy orders escrow USDC; sell orders escrow catbond-tokens.
- `cancelOrder(uint256 orderId)` — cancels and returns escrowed funds
- `fillOrder(uint256 orderId, uint256 amount)` — fills against a resting order. Partial fills allowed.
- `marketBuy(uint256 usdcAmount)` — walks the ask book, filling cheapest asks first
- `marketSell(uint256 tokenAmount)` — walks the bid book, filling highest bids first

**Matching rules:**

- Price-time priority (same price → earlier order fills first)
- Minimum tick size: $0.01 (1e4 USDC units)
- No self-trading (maker cannot fill own orders)
- Orders can span the full $0.00–$1.00 range

**Market phases:**

- During FILLING: order book active but most buys are mints at par via CommitmentManager. Sell orders from early depositors wanting to exit before lock.
- During ACTIVE: full secondary market. All buys/sells are peer-to-peer via order book.
- During SETTLEMENT: order book winds down. Token price converges to redemption rate.

#### 3.1.10 MarketRegistry

Catalog of all markets for frontend discovery.

**Key state:**

- `markets` — mapping of marketId → MarketInfo
- `marketsByPeril` — mapping of perilType → marketId[]
- `marketsByRiskHolder` — mapping of address → marketId[]
- `activeMarkets` — enumerable set of currently active market IDs

**MarketInfo struct:**

```
struct MarketInfo {
    uint256 marketId;
    address riskHolder;
    address coverageAgreement;
    address vaultWrapper;
    address catbondToken;
    address premiumEscrow;
    address commitmentManager;
    address orderBook;
    address durationVault;
    string perilType;
    MarketStatus status;
    uint256 coverageTarget;
    uint256 actualFill;
    uint256 premiumRateBps;
    uint32 duration;
    uint256 lockedAt;
    string metadataURI;
}
```

### 3.2 EigenLayer contracts (external, used by RIZK)

RIZK interacts with EigenLayer's deployed contracts on Ethereum mainnet. No modifications to EigenLayer contracts are needed.

#### 3.2.1 StrategyFactory

**Used by:** MarketFactory

**Purpose:** Deploys new Duration Vault strategies. Called once per market creation.

**Key function used:**

```
deployDurationVaultStrategy(VaultConfig config) → IDurationVaultStrategy
```

**RIZK passes:**

```
VaultConfig {
    underlyingToken: USDC,
    vaultAdmin: address(rizkProtocol),       // RIZK's admin contract
    arbitrator: address(rizkArbitrator),       // For premium default → early exit
    duration: market.duration,
    maxPerDeposit: coverageTarget,            // No per-tx cap initially
    stakeCap: coverageTarget,                 // Total cap = coverage target
    metadataURI: market.metadataURI,
    operatorSet: rizkOperatorSet,             // RIZK's AVS operator set
    operatorSetRegistrationData: bytes(""),
    delegationApprover: address(0),           // Open delegation
    operatorMetadataURI: "..."
}
```

**Critical:** The operator set must be configured as a redistributable operator set, with `redistributionRecipient` set to the risk holder's payout address. This is set at operator set creation time and is immutable.

#### 3.2.2 DurationVaultStrategy

**Used by:** VaultWrapper (deposits/withdrawals), RizkAVS admin (lock/maturity)

**Key functions used:**

- `lock()` — transitions vault from DEPOSITS to ALLOCATIONS. Called by the vault admin (RIZK protocol) when the market locks.
- `markMatured()` — transitions from ALLOCATIONS to WITHDRAWALS after duration. Permissionless.
- `advanceToWithdrawals()` — early exit, called by arbitrator on premium default.
- `updateTVLLimits(maxPerDeposit, stakeCap)` — called at lock to set cap to actual fill.
- `beforeAddShares()` / `beforeRemoveShares()` — hooks called automatically by StrategyManager on deposit/withdrawal. Enforce lifecycle constraints.

**Lifecycle mapping to RIZK states:**

| RIZK state | EigenLayer vault state | Catbond-token behavior |
|---|---|---|
| COMMITTING / DEPOSIT_DAY | Not yet deployed or DEPOSITS | Minting at par |
| ACTIVE | ALLOCATIONS | Secondary market trading |
| TRIGGERED | ALLOCATIONS → WITHDRAWALS | Price reflects post-slash value |
| MATURED | WITHDRAWALS | Redeem at $1.00 |
| EARLY_EXIT | WITHDRAWALS | Redeem at $1.00 (no slash) |

#### 3.2.3 AllocationManager

**Used by:** RizkAVS (slashing)

**Key function used:**

```
slashOperator(address avs, SlashingParams params)
```

The RIZK AVS calls this when the oracle resolves a qualifying event. The Duration Vault is both the operator and the strategy being slashed.

**Post-slash:** A permissionless call to `clearBurnOrRedistributeShares()` on StrategyManager transfers the slashed funds to the `redistributionRecipient`.

#### 3.2.4 DelegationManager

**Used by:** VaultWrapper (delegation, withdrawal queuing)

**Key functions used:**

- `delegateTo(operator, signature, expiry)` — VaultWrapper delegates to the Duration Vault (which is its own operator)
- `queueWithdrawals(params)` — queues withdrawal after vault enters WITHDRAWALS state
- `completeQueuedWithdrawals(withdrawals, tokens, receiveAsTokens)` — completes withdrawal, returns USDC to VaultWrapper for token holder redemptions

#### 3.2.5 RewardsCoordinator

**Used by:** PremiumEscrow (reward submission), VaultWrapper (reward claims)

**Key functions used:**

- `createAVSRewardsSubmission(submissions)` — RIZK submits premium rewards targeting the operator set. Called periodically by PremiumEscrow drip function.
- `processClaim(claim, recipient)` — VaultWrapper claims rewards and distributes to catbond-token holders via the reward checkpoint mechanism.

#### 3.2.6 StrategyManager

**Used by:** VaultWrapper (deposits)

**Key function used:**

- `depositIntoStrategy(strategy, token, amount)` — VaultWrapper deposits USDC into the Duration Vault strategy.

### 3.3 UMA contracts and API (external, used by RIZK)

RIZK uses UMA's Optimistic Oracle V2 for event resolution, following a similar adapter pattern to Polymarket's UmaCtfAdapter.

#### 3.3.1 RizkUmaAdapter

**Purpose:** Custom adapter contract that interfaces between RIZK's markets and UMA's Optimistic Oracle. Modeled on Polymarket's UmaCtfAdapter pattern.

**Key functions:**

- `initializeRequest(uint256 marketId, bytes ancillaryData, uint256 reward, uint256 proposalBond, uint256 liveness)` — sends a price request to UMA's Optimistic Oracle. The ancillary data contains the natural language question plus machine-readable parameters.

- `proposePrice(uint256 marketId, int256 value)` — anyone can propose an answer (the severity value). Requires posting a bond.

- `disputePrice(uint256 marketId)` — anyone can dispute a proposed answer by posting a counter-bond. Escalates to UMA's DVM.

- `settleRequest(uint256 marketId)` — after liveness period (no dispute) or DVM resolution. Calls back to RizkAVS.onOracleResolution() with the finalized value.

**Ancillary data format:**

```
{
    "title": "Jamaica Hurricane Wind Speed - March 2026",
    "description": "What was the maximum sustained wind speed (km/h) recorded within 50km of coordinates 18.1096,-77.2975 between 2026-03-01 and 2026-03-15?",
    "resolution_source": "NOAA National Hurricane Center, Joint Typhoon Warning Center",
    "value_type": "NUMERIC",
    "decimals": 0,
    "market_id": "0x...",
    "rizk_contract": "0x..."
}
```

**UMA resolution flow:**

1. Someone (keeper, risk holder, or anyone) calls `initializeRequest()` when they believe a qualifying event has occurred
2. A UMA proposer asserts a numeric value (e.g., 195 km/h) and posts a bond
3. 2-hour challenge window begins
4. If no dispute: assertion accepted, `settleRequest()` finalizes
5. If disputed: first dispute auto-resets the request; second dispute escalates to DVM (48-72h token holder vote)
6. On settlement: adapter calls `RizkAVS.onOracleResolution(marketId, 195)` which looks up attachment points and executes slash if threshold is met

#### 3.3.2 UMA contracts used

- **OptimisticOracleV2** (deployed on Ethereum) — receives price requests from the adapter, manages propose/dispute/settle lifecycle
- **DVM (Data Verification Mechanism)** — UMA's backstop dispute resolution. Token holders vote on disputed assertions.
- **IdentifierWhitelist** — RIZK registers a custom price identifier (e.g., `RIZK_EVENT_SEVERITY`) or uses UMA's existing `YES_OR_NO_QUERY` / `MULTIPLE_VALUES` identifiers

**Bond and reward configuration:**

- Proposal bond: set per market by risk holder (suggested: $1,000–$10,000 USDC depending on market size). Higher bonds deter spam proposals.
- Dispute bond: matches proposal bond.
- Proposer reward: small USDC reward for correct proposals (paid from premium escrow or protocol treasury).
- Liveness period: 2 hours (standard for Polymarket-type markets).

---

## 4. Frontend architecture

### 4.1 Application structure

Single-page application (React/Next.js) with the following views.

#### Market explorer (home)

The landing page. Shows all active and upcoming protection markets.

Key elements: filterable grid of market cards, each showing the peril type, region, coverage target, fill percentage, premium yield, catbond-token price, days remaining, and market status. Filters by peril type, region, yield range, and status.

Each card links to the market detail page.

#### Market detail / trading page

The core trading experience. Combines market information with the order book and trade execution.

Layout (top to bottom):

- Market header: peril type, risk holder name, coverage amount, duration, status badge (COMMITTING / DEPOSIT_DAY / ACTIVE / MATURED / etc.)
- Stats bar: last price, 24h volume, premium yield (APY), vault TVL, days remaining
- Main area (two columns):
  - Left: order book (bids/asks with depth visualization), recent trades list
  - Right: trade panel (buy/sell tabs, amount input, limit price input, place order button). Shows estimated redemption value, current yield, and risk disclosure.
- Below: market details accordion — full coverage terms, attachment points table, risk holder profile, oracle configuration, contract addresses
- Price chart: historical catbond-token price (line chart with volume bars)

#### Commitment / deposit flow

For markets in COMMITTING or DEPOSIT_DAY state. Replaces the order book with:

- Progress bar showing commitment total vs. target
- Countdown timer (commitment deadline or deposit deadline)
- Commit/deposit action panel: enter amount, approve USDC, commit (during commitment window) or deposit (during deposit day)
- Ticket status: if user has committed, show their ticket details (committed amount, bond, allocation status, deposit status)

#### Portfolio page

User's dashboard showing:

- Holdings: list of catbond-tokens held, current value, unrealized P&L, accrued premium
- Active commitments: pending tickets for markets in commitment phase
- Claimable rewards: premium yield available to claim
- Transaction history: deposits, trades, redemptions, reward claims

#### Risk holder dashboard (gated)

Only visible to verified risk holders. Shows:

- Active markets: status, fill, premium paid/due
- Premium schedule: next payment due, amount, deadline
- Coverage summary: total active coverage across all markets
- Payout history: triggered markets and received amounts
- Create new market: form mapping to MarketConfig

### 4.2 Frontend tech stack

- Framework: Next.js 14+ (App Router)
- Wallet connection: wagmi v2 + viem + ConnectKit or RainbowKit
- State management: TanStack Query for server state, zustand for client state
- Chain: Ethereum mainnet (with potential L2 deployment for order book in v2)
- Styling: Tailwind CSS
- Charts: Lightweight Charts (TradingView) for price chart, custom SVG for order book depth
- Real-time: WebSocket connection to backend for order book updates and price feeds

### 4.3 Key frontend interactions with contracts

| User action | Contract call |
|---|---|
| Commit to market | CommitmentManager.commit(amount) + USDC approve |
| Deposit on deposit day | CommitmentManager.deposit() + USDC approve |
| Place buy order | OrderBook.placeLimitOrder(true, price, amount) + USDC approve |
| Place sell order | OrderBook.placeLimitOrder(false, price, amount) + CatbondToken approve |
| Cancel order | OrderBook.cancelOrder(orderId) |
| Redeem tokens | VaultWrapper.redeem(amount) + CatbondToken approve |
| Claim premium | VaultWrapper.claimRewards() |
| Create market (risk holder) | MarketFactory.createProtectionMarket(config) + USDC approve (escrow) |
| Pay premium (risk holder) | PremiumEscrow.depositPremium(amount) + USDC approve |

---

## 5. Backend services

The backend is a lightweight indexing and API layer. All critical state lives on-chain. The backend provides fast read access, WebSocket feeds, and off-chain coordination.

### 5.1 Indexer service

**Purpose:** Indexes on-chain events to build a queryable database of market state, order book history, and user positions.

**Technology:** Custom indexer using viem/ethers.js event listeners, or a subgraph (The Graph) for each contract. Consider Ponder or Envio for modern indexing.

**Events indexed:**

- MarketFactory: MarketCreated
- CommitmentManager: CommitmentMade, DepositMade, BondForfeited
- VaultWrapper: TokensMinted, TokensRedeemed, SlashDetected
- OrderBook: OrderPlaced, OrderFilled, OrderCancelled
- PremiumEscrow: PremiumDeposited, PremiumDripped, DefaultDetected
- DurationVaultStrategy: VaultLocked, VaultMatured, VaultAdvancedToWithdrawals
- AllocationManager: OperatorSlashed
- UMA OptimisticOracle: PriceProposed, PriceDisputed, PriceSettled

**Database:** PostgreSQL with TimescaleDB extension for time-series data (price history, volume). Redis for caching current order book state.

### 5.2 API service

**Purpose:** REST + WebSocket API serving the frontend.

**Technology:** Node.js (Fastify or Express) or Rust (Axum) for performance.

**REST endpoints:**

```
GET  /markets                        — list all markets (filterable)
GET  /markets/:id                    — market detail
GET  /markets/:id/orderbook          — current order book snapshot
GET  /markets/:id/trades             — recent trades
GET  /markets/:id/price-history      — OHLCV candles
GET  /markets/:id/commitments        — commitment stats
GET  /portfolio/:address             — user's holdings and positions
GET  /portfolio/:address/rewards     — claimable rewards
GET  /risk-holder/:address/markets   — risk holder's markets and premium schedule
```

**WebSocket channels:**

```
ws://api.rizk.xyz/ws

Subscribe:
  { "channel": "orderbook", "market_id": "..." }   — real-time order book updates
  { "channel": "trades", "market_id": "..." }       — trade feed
  { "channel": "price", "market_id": "..." }        — price ticker
  { "channel": "market_status", "market_id": "..." } — state transitions
```

### 5.3 Keeper service

**Purpose:** Automated bot that performs permissionless on-chain actions that need to happen reliably.

**Technology:** Node.js or Python script running on a dedicated server or cloud function.

**Keeper responsibilities:**

- `PremiumEscrow.drip()` — called daily/weekly to push accrued premium to RewardsCoordinator
- `DurationVaultStrategy.markMatured()` — called when duration elapses on any active vault
- `PremiumEscrow.checkDefault()` + arbitrator trigger — monitors for missed premium payments
- `AllocationManager.clearBurnOrRedistributeShares()` — called after a slash to finalize fund redistribution
- `RizkUmaAdapter.settleRequest()` — settles UMA assertions after liveness period
- Order book cleanup — cancels expired orders if time-limited orders are implemented

### 5.4 Oracle monitor service

**Purpose:** Watches real-world data sources and alerts the community when a qualifying event may have occurred, prompting someone to initiate a UMA oracle request.

**Technology:** Python service polling NOAA API, USGS earthquake feeds, weather APIs.

**This service does NOT automatically trigger oracle requests.** It provides information to the RIZK dashboard (e.g., "Tropical Storm approaching Jamaica coverage zone — monitor closely") and can send notifications to subscribed users. Any user can then decide to initiate a UMA assertion.

**Data sources (v1):**

- NOAA National Hurricane Center — hurricane track and intensity data
- USGS Earthquake Hazards Program — seismic event data
- Open-Meteo API — weather data (rainfall, wind speed)

### 5.5 Infrastructure

| Component | Technology | Hosting |
|---|---|---|
| Frontend | Next.js | Vercel or Cloudflare Pages |
| API service | Node.js/Fastify | AWS ECS or Railway |
| Indexer | Ponder/Envio or custom | AWS ECS |
| Database | PostgreSQL + TimescaleDB | AWS RDS or Supabase |
| Cache | Redis | AWS ElastiCache or Upstash |
| Keeper | Node.js cron | AWS Lambda or dedicated EC2 |
| Oracle monitor | Python | AWS Lambda (scheduled) |
| RPC | Ethereum mainnet | Alchemy or Infura (dedicated) |

---

## 6. Data flow: market creation to settlement

### 6.1 Market creation flow

```
Risk holder → MarketFactory.createProtectionMarket(config)
  ├→ Check RizkRegistry.isApprovedRiskHolder()
  ├→ Deploy CoverageAgreement
  ├→ Deploy VaultWrapper + CatbondToken
  ├→ Deploy PremiumEscrow
  ├→ Deploy CommitmentManager
  ├→ Call StrategyFactory.deployDurationVaultStrategy()
  │    └→ EigenLayer deploys Duration Vault
  │    └→ Configures redistributable operator set (recipient = payoutAddress)
  │    └→ Vault registers as operator in DelegationManager
  │    └→ Sets operator split to 0% in RewardsCoordinator
  ├→ VaultWrapper delegates to Duration Vault
  ├→ Register market in MarketRegistry
  └→ Transfer minimum escrow from risk holder to PremiumEscrow
```

### 6.2 Commitment and deposit flow

```
Commitment phase (7 days):
  Investor → CommitmentManager.commit(amount)
    ├→ Transfer 1% bond (USDC)
    └→ Record commitment ticket

Deposit day — priority round (12 hours):
  Ticket holder → CommitmentManager.deposit()
    ├→ Calculate allocation (pro-rata if oversubscribed)
    ├→ Transfer USDC (minus bond already held)
    ├→ CommitmentManager → VaultWrapper.deposit(amount)
    │    ├→ VaultWrapper → StrategyManager.depositIntoStrategy(vault, USDC, amount)
    │    └→ VaultWrapper → CatbondToken.mint(investor, amount)
    └→ Mark ticket as deposited

Deposit day — open round (12 hours):
  Anyone → CommitmentManager.depositOpen(amount)
    └→ Same deposit flow, first come first served until stakeCap

Lock:
  If autoLockAtTarget and vault balance == coverageTarget:
    Automatic lock
  Else risk holder calls lock(minBalance):
    ├→ Check balance ≥ minBalance
    ├→ DurationVaultStrategy.updateTVLLimits(actualFill, actualFill)
    ├→ DurationVaultStrategy.lock()
    ├→ PremiumEscrow.adjustForActualFill(actualFill)
    │    └→ Refund excess escrow to risk holder
    ├→ CoverageAgreement.status = ACTIVE
    └→ Secondary market begins
```

### 6.3 Oracle trigger and slash flow

```
Event occurs (hurricane hits Jamaica):
  Oracle monitor → alerts dashboard
  Any user → RizkUmaAdapter.initializeRequest(marketId, ancillaryData)
    └→ OptimisticOracleV2 receives price request

UMA proposer → proposes value (e.g., 195 km/h)
  └→ Posts bond, 2-hour challenge window begins

If not disputed (happy path):
  After liveness → anyone calls RizkUmaAdapter.settleRequest(marketId)
    └→ RizkAVS.onOracleResolution(marketId, 195)
      ├→ CoverageAgreement.getSlashPercentage(195)
      │    └→ Returns 5000 (50%) — Cat 3 attachment point
      ├→ AllocationManager.slashOperator(slashParams)
      │    └→ Marks 50% of vault shares as redistributable
      ├→ StrategyManager.clearBurnOrRedistributeShares()
      │    └→ Transfers 50% of USDC to risk holder's payoutAddress
      ├→ DurationVaultStrategy → transitions to WITHDRAWALS
      ├→ VaultWrapper.onSlash(slashedAmount)
      │    └→ Updates redemptionRate to 0.5
      └→ CoverageAgreement.status = TRIGGERED

Token holders → VaultWrapper.redeem(tokenAmount)
  ├→ Burns catbond-tokens
  ├→ VaultWrapper → DelegationManager.queueWithdrawals()
  ├→ After withdrawal delay → DelegationManager.completeQueuedWithdrawals()
  └→ Sends USDC to token holder (tokenAmount × 0.5 redemption rate)
```

### 6.4 Normal maturity flow

```
Duration elapses:
  Keeper → DurationVaultStrategy.markMatured()
    ├→ Deallocates magnitude (best-effort)
    ├→ Deregisters from operator set (best-effort)
    └→ Transitions to WITHDRAWALS

  CoverageAgreement.status = MATURED
  VaultWrapper.redemptionRate remains 1.0

  PremiumEscrow.refundUnused() → returns any remaining escrow to risk holder

Token holders → VaultWrapper.redeem(tokenAmount)
  ├→ Burns catbond-tokens
  ├→ Queues + completes EigenLayer withdrawal
  └→ Sends USDC to token holder (tokenAmount × 1.0)
```

---

## 7. Security considerations

### 7.1 Key management

The following roles have elevated privileges and must be secured with multisig or hardware wallets:

- **RIZK Protocol Admin** — vault admin role on all Duration Vaults. Can call `lock()`. Must be a multisig (e.g., 3/5 Safe).
- **RIZK Arbitrator** — can trigger early exit on premium default. Must be a multisig or automated contract with timelock.
- **RizkRegistry Registrar** — can approve/revoke risk holders. Must be a multisig.
- **AVS Slasher Key** — the key that calls `AllocationManager.slashOperator()`. Critical: compromise of this key + `redistributionRecipient` control could drain vaults. Must be behind the RizkAVS contract with oracle verification, not an EOA.

### 7.2 Oracle manipulation

UMA's dispute mechanism is the primary defense. Additional safeguards:

- Proposal bond sized relative to market value (larger markets require larger bonds)
- RIZK can implement a veto period between oracle resolution and slash execution (e.g., 24h delay) allowing governance to intervene if the oracle result appears manipulated
- Multiple oracle sources can be required for high-value markets (UMA primary, Chainlink confirmation for v2)

### 7.3 Smart contract risks

- **VaultWrapper as single staker:** All vault deposits go through the VaultWrapper. If the wrapper has a bug, all deposits are at risk. Requires thorough audit.
- **Premium distribution accounting:** The reward checkpoint mechanism must be correct or token holders receive incorrect premium amounts. Well-known pattern (Synthetix, Compound) but must be verified.
- **Order book manipulation:** On-chain limit orders are visible in the mempool. Sandwich attacks possible on market orders. Mitigation: encourage limit orders, implement minimum order sizes for market orders, consider commit-reveal for large orders.

### 7.4 Economic risks

- **Liquidity risk:** If catbond-token secondary market is thin, holders cannot exit during ACTIVE state at reasonable prices. Mitigation: liquidity rewards program, market maker partnerships.
- **Correlated risk:** Multiple markets covering the same region/peril could all trigger simultaneously. Protocol-level concentration limits may be needed.
- **Premium default cascading:** If a risk holder defaults on premium, the early exit returns principal to token holders, but they lose remaining expected yield. Not a loss of principal, but a missed opportunity.

---

## 8. Version roadmap

### 8.1 v0.9 — Testnet prototype (Sepolia)

**Goal:** Working end-to-end prototype on Sepolia. Prove the full lifecycle — market creation through settlement — with mock external infrastructure. Contracts + basic frontend.

**Target chain:** Sepolia

**Key architectural decisions for v0.9:**

**Mock Duration Vault (SimpleVault).** EigenLayer's Duration Vault Strategies (ELIP-15) were approved by Protocol Council on March 12, 2026 and are not yet deployed on any testnet. For v0.9 we build a SimpleVault — a standalone USDC vault under RIZK's control that implements the same lifecycle phases (DEPOSITS → LOCKED → WITHDRAWALS) and supports slashing (admin reduces withdrawable balance, sends slashed funds to payout address). The SimpleVault exposes the same external interface as the Duration Vault spec (`lock()`, `markMatured()`, `advanceToWithdrawals()`) so that the VaultWrapper does not need to change when we swap in the real EigenLayer contracts.

**Mock Oracle (MockOracle).** Instead of integrating with UMA's Optimistic Oracle on Sepolia, we deploy a MockOracle contract where an admin can trigger events by calling `triggerEvent(marketId, severityValue)`. This queries CoverageAgreement for the slash percentage and executes the slash on the SimpleVault. The MockOracle implements the same callback interface (`onOracleResolution`) that the real RizkAVS/UMA adapter will use, so the integration point is clean.

**Mock USDC.** We deploy our own ERC-20 (MockUSDC) with a public `mint(address to, uint256 amount)` faucet function. Anyone can mint test USDC for interacting with the protocol.

**ERC-4626 on VaultWrapper.** The VaultWrapper implements the ERC-4626 Tokenized Vault Standard. CatbondTokens ARE the vault shares. This gives the protocol free composability — any DeFi aggregator, wallet, or portfolio tracker that understands ERC-4626 can automatically display catbond positions with correct valuations. The lifecycle constraints are handled via `maxDeposit()` (returns 0 when vault is locked) and `maxWithdraw()` (returns 0 until WITHDRAWALS state). The CommitmentManager sits in front of the vault for the commitment/deposit phase and calls the vault's deposit on behalf of users.

**Built-in premium dividends.** Without EigenLayer's RewardsCoordinator, the VaultWrapper implements a Synthetix-style `rewardsPerTokenStored` mechanism directly. PremiumEscrow drips premium to the VaultWrapper, which tracks accrued rewards per share. CatbondToken holders (including secondary market buyers) claim proportionally based on time held.

**ERC-3475 and ERC-3643: not used in v0.9.** ERC-3475 (Abstract Storage Bonds) offers multi-class bond metadata but has near-zero ecosystem adoption — catbond-tokens would not appear in wallets or be tradeable on standard DEXes. The metadata benefits are achieved by storing bond terms in CoverageAgreement and exposing them via `metadataURI`. ERC-3643 (Security Token Standard / T-REX) provides identity-based transfer restrictions for regulated securities; this conflicts with the permissionless capital provider model. Risk holder gatekeeping is handled by RizkRegistry at the market creation level, not the token transfer level.

**v0.9 contract inventory:**

| # | Contract | Purpose | Standard |
|---|---|---|---|
| 1 | MockUSDC | Test collateral token with public faucet | ERC-20 |
| 2 | RizkRegistry | Admin-managed risk holder whitelist | — |
| 3 | MarketFactory | Deploys all per-market contracts in one tx | — |
| 4 | MarketRegistry | Catalog of all markets for frontend discovery | — |
| 5 | SimpleVault | Mock Duration Vault: USDC lockup with DEPOSITS → LOCKED → WITHDRAWALS lifecycle, slashable | — |
| 6 | VaultWrapper | Bridges catbond-tokens to SimpleVault, handles deposit/redeem, premium distribution | ERC-4626 |
| 7 | CatbondToken | Vault share token, freely transferable, mint/burn by VaultWrapper only | ERC-20 |
| 8 | CommitmentManager | ICO-style commitment/deposit flow: commit with 1% bond → priority round → open round → pro-rata allocation | — |
| 9 | PremiumEscrow | Holds risk holder premium, permissionless drip to VaultWrapper, default detection | — |
| 10 | CoverageAgreement | On-chain record of terms, attachment points, slash % lookup | — |
| 11 | MockOracle | Admin-triggered event resolution → slash execution | — |
| 12 | OrderBook | On-chain limit order book for CatbondToken/USDC trading | — |

**v0.9 frontend scope:**

| View | Description |
|---|---|
| Market Explorer | Filterable grid of markets: peril type, region, fill %, yield, status |
| Market Detail / Trading | Order book visualization, trade panel (limit buy/sell), market stats, price chart |
| Commitment Flow | Commit/deposit UI with progress bar, countdown timer, ticket status |
| Portfolio | Holdings, current value, P&L, accrued premium, claimable rewards, tx history |
| Risk Holder Dashboard | Create market form, premium payment schedule, coverage status |

**v0.9 test coverage (Foundry):**

Full lifecycle tests covering: create market → commit → deposit → lock → trade on orderbook → oracle trigger → slash → redeem at reduced rate. Also: normal maturity (redeem at $1.00), oversubscription pro-rata, premium drip + claim, premium default → early exit, bond forfeit for no-shows.

**v0.9 deployment:**

Foundry deployment scripts configured via `.env` (private key, Sepolia RPC URL). All contracts verified on Sepolia Etherscan.

---

### 8.2 v1 — Testnet with real integrations

**Goal:** Replace mock infrastructure with real EigenLayer and UMA integrations on Sepolia. Prove the protocol works against production-grade external infrastructure.

**Upgrades from v0.9:**

- **SimpleVault → EigenLayer Duration Vault.** Swap the mock vault for a real Duration Vault Strategy deployed via EigenLayer's StrategyFactory on Sepolia. VaultWrapper calls `StrategyManager.depositIntoStrategy()` for deposits, `DelegationManager.queueWithdrawals()` / `completeQueuedWithdrawals()` for redemptions. Requires ELIP-15 contracts to be deployed on Sepolia.
- **MockOracle → RizkAVS + RizkUmaAdapter.** Deploy the RIZK AVS contract and UMA adapter. Integrate with UMA's Optimistic Oracle V2 on Sepolia. Full propose/dispute/settle lifecycle with real bonds.
- **MockUSDC → testnet USDC or keep mock.** Depending on EigenLayer's accepted token list on Sepolia.
- **Premium distribution via RewardsCoordinator.** Replace the built-in dividend mechanism with EigenLayer's native rewards flow: PremiumEscrow → `RewardsCoordinator.createAVSRewardsSubmission()` → VaultWrapper claims via `processClaim()`.
- **Keeper service.** Automated bot for `drip()`, `markMatured()`, `checkDefault()`, `settleRequest()`, `clearBurnOrRedistributeShares()`.

**v1 scope (unchanged from original):**

- Single peril type per market
- USDC as sole collateral token
- On-chain limit order book
- UMA Optimistic Oracle for all event types
- Quarterly advance premium payments
- Proportional scale-down on partial fill
- ICO-style commitment/deposit system
- No risk holder early termination (arbitrator only on premium default)
- Auto-lock at target (configurable)

---

### 8.3 v2 — Backlog (see rizk-backlog.md)

- Pre-market price discovery
- Dynamic premium adjustment during filling
- Tranche markets (potential ERC-3475 revisit if ecosystem adoption grows)
- Voluntary early termination
- Hybrid CLOB (off-chain matching, on-chain settlement)
- Chainlink oracle integration (dual-oracle confirmation for high-value markets)
- Multi-peril coverage
- Token holder governance
- Secondary market for protection positions (protection buyer side)
- Rolling/renewable vaults
- ERC-3643 compliance layer (if regulated market entry requires identity-based transfer restrictions)
- L2 deployment for order book (reduced gas for high-frequency trading)

---

## 9. Contract deployment plan

### Phase 1: v0.9 on Sepolia

Deploy all RIZK contracts with mock infrastructure (SimpleVault, MockOracle, MockUSDC). Create test markets with mock risk holders. Verify full lifecycle from commitment through settlement. Ship basic frontend.

### Phase 2: v1 on Sepolia

Swap mock infrastructure for real EigenLayer Duration Vault + UMA Optimistic Oracle (pending ELIP-15 testnet deployment). Deploy keeper service. Full integration testing.

### Phase 3: Mainnet — single market pilot

Deploy RIZK contracts to Ethereum mainnet. Onboard one risk holder for a single, small-scale market ($1M-$5M coverage). Verify integration with mainnet EigenLayer and UMA. Monitor keeper performance, oracle resolution, and order book behavior.

### Phase 4: Mainnet — general availability

Open market creation to additional verified risk holders. Scale coverage targets. Enable liquidity rewards program. Begin market maker onboarding.
