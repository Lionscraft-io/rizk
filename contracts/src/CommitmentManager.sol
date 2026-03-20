// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./VaultWrapper.sol";

/// @title CommitmentManager — ICO-style commitment and deposit flow
/// @notice Manages the two-phase capital raising process for each market:
///         1. COMMITMENT_OPEN: investors commit capital and post 1% bond
///         2. DEPOSIT_DAY: priority round (12h) for committed investors,
///            then open round (12h) for anyone
///         Handles oversubscription via pro-rata allocation.
contract CommitmentManager {
    using SafeERC20 for IERC20;

    enum State {
        COMMITMENT_OPEN,
        DEPOSIT_DAY,
        CLOSED
    }

    struct CommitmentTicket {
        uint256 amount; // Committed capital
        uint256 bondDeposited; // 1% bond held
        bool deposited; // Whether they deposited on deposit day
        uint256 actualAllocation; // Actual allocation (may be pro-rata)
    }

    IERC20 public immutable usdc;
    VaultWrapper public immutable vaultWrapper;
    uint256 public immutable marketId;
    uint256 public immutable coverageTarget;
    uint256 public immutable minimumFillBps; // Min % to lock (e.g., 3000 = 30%)
    uint256 public immutable commitmentBondBps; // Bond as bps of commitment (e.g., 100 = 1%)
    bool public immutable autoLockAtTarget;

    address public admin;
    address public riskHolder;
    address public bondRecipient; // Where forfeited bonds go (protocol admin)

    // Timestamps
    uint256 public commitmentDeadline;
    uint256 public depositDeadline; // commitmentDeadline + 24h
    uint256 public priorityRoundEnd; // commitmentDeadline + 12h

    // State
    State public state;
    uint256 public totalCommitted;
    uint256 public totalDeposited;
    mapping(address => CommitmentTicket) public commitments;
    address[] public committedInvestors;

    // Bond forfeiture
    uint256 public totalForfeitedBonds;

    event CommitmentMade(address indexed investor, uint256 amount, uint256 bond);
    event DepositMade(address indexed investor, uint256 amount, uint256 shares);
    event OpenDeposit(address indexed investor, uint256 amount, uint256 shares);
    event BondRefunded(address indexed investor, uint256 amount);
    event BondForfeited(address indexed investor, uint256 amount);
    event MarketLocked(uint256 totalFill);
    event MarketCancelled(uint256 totalCommitted, uint256 minimumRequired);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    modifier inState(State _state) {
        require(state == _state, "Wrong state");
        _;
    }

    constructor(
        address _usdc,
        address _vaultWrapper,
        uint256 _marketId,
        uint256 _coverageTarget,
        uint256 _minimumFillBps,
        uint256 _commitmentBondBps,
        bool _autoLockAtTarget,
        uint32 _commitmentWindow,
        address _admin,
        address _riskHolder,
        address _bondRecipient
    ) {
        usdc = IERC20(_usdc);
        vaultWrapper = VaultWrapper(_vaultWrapper);
        marketId = _marketId;
        coverageTarget = _coverageTarget;
        minimumFillBps = _minimumFillBps;
        commitmentBondBps = _commitmentBondBps;
        autoLockAtTarget = _autoLockAtTarget;
        admin = _admin;
        riskHolder = _riskHolder;
        bondRecipient = _bondRecipient;

        commitmentDeadline = block.timestamp + _commitmentWindow;
        priorityRoundEnd = commitmentDeadline + 12 hours;
        depositDeadline = commitmentDeadline + 24 hours;

        state = State.COMMITMENT_OPEN;
    }

    // ─── Commitment phase ───────────────────────────────────────

    /// @notice Commit capital during the commitment window
    /// @param amount Amount of USDC to commit (bond will be 1% of this)
    function commit(uint256 amount) external inState(State.COMMITMENT_OPEN) {
        require(block.timestamp < commitmentDeadline, "Commitment window closed");
        require(amount > 0, "Zero commitment");
        require(commitments[msg.sender].amount == 0, "Already committed");

        uint256 bond = (amount * commitmentBondBps) / 10000;
        require(bond > 0, "Bond too small");

        // Transfer bond from investor
        usdc.safeTransferFrom(msg.sender, address(this), bond);

        commitments[msg.sender] = CommitmentTicket({
            amount: amount,
            bondDeposited: bond,
            deposited: false,
            actualAllocation: 0
        });

        totalCommitted += amount;
        committedInvestors.push(msg.sender);

        emit CommitmentMade(msg.sender, amount, bond);

        // Check if commitment window should transition
        _checkTransition();
    }

    // ─── Deposit day ────────────────────────────────────────────

    /// @notice Transition to deposit day (permissionless, after commitment deadline)
    function startDepositDay() external inState(State.COMMITMENT_OPEN) {
        require(block.timestamp >= commitmentDeadline, "Commitment window not over");
        state = State.DEPOSIT_DAY;
    }

    /// @notice Deposit during priority round (first 12h) — ticket holders only
    function deposit() external inState(State.DEPOSIT_DAY) {
        require(block.timestamp < priorityRoundEnd, "Priority round over");

        CommitmentTicket storage ticket = commitments[msg.sender];
        require(ticket.amount > 0, "No commitment");
        require(!ticket.deposited, "Already deposited");

        uint256 allocation = getProRataAllocation(msg.sender);
        ticket.actualAllocation = allocation;
        ticket.deposited = true;

        // Amount to transfer = allocation minus bond (bond counts toward deposit)
        uint256 remaining = allocation - ticket.bondDeposited;

        // Transfer remaining USDC from investor
        if (remaining > 0) {
            usdc.safeTransferFrom(msg.sender, address(this), remaining);
        }

        // Deposit into VaultWrapper
        usdc.approve(address(vaultWrapper), allocation);
        uint256 shares = vaultWrapper.deposit(allocation, msg.sender);

        totalDeposited += allocation;

        emit DepositMade(msg.sender, allocation, shares);
    }

    /// @notice Deposit during open round (last 12h) — anyone, first come first served
    function depositOpen(uint256 amount) external inState(State.DEPOSIT_DAY) {
        require(block.timestamp >= priorityRoundEnd, "Open round not started");
        require(block.timestamp < depositDeadline, "Deposit day over");
        require(amount > 0, "Zero deposit");

        // Cap to remaining capacity
        uint256 remaining = coverageTarget - totalDeposited;
        require(remaining > 0, "Fully filled");
        if (amount > remaining) amount = remaining;

        // Transfer USDC
        usdc.safeTransferFrom(msg.sender, address(this), amount);

        // Deposit into VaultWrapper
        usdc.approve(address(vaultWrapper), amount);
        uint256 shares = vaultWrapper.deposit(amount, msg.sender);

        totalDeposited += amount;

        emit OpenDeposit(msg.sender, amount, shares);
    }

    // ─── Lock ───────────────────────────────────────────────────

    /// @notice Lock the market after deposit day (admin or permissionless after deadline)
    function lockMarket() external {
        require(state == State.DEPOSIT_DAY, "Not in deposit day");
        require(block.timestamp >= depositDeadline || msg.sender == admin, "Too early");

        uint256 minimumRequired = (coverageTarget * minimumFillBps) / 10000;
        require(totalDeposited >= minimumRequired, "Below minimum fill");

        state = State.CLOSED;
        emit MarketLocked(totalDeposited);
    }

    /// @notice Cancel market if minimum fill not met
    function cancelMarket() external onlyAdmin {
        require(state == State.DEPOSIT_DAY, "Not in deposit day");
        require(block.timestamp >= depositDeadline, "Deposit day not over");

        uint256 minimumRequired = (coverageTarget * minimumFillBps) / 10000;
        require(totalDeposited < minimumRequired, "Minimum met, cannot cancel");

        state = State.CLOSED;
        emit MarketCancelled(totalCommitted, minimumRequired);
        // TODO: In a full implementation, handle refunds for deposited users
    }

    // ─── Bond refunds and forfeits ──────────────────────────────

    /// @notice Claim bond refund (for investors who deposited). Refunds excess bond if pro-rata reduced.
    function claimBondRefund() external {
        require(state == State.CLOSED || block.timestamp >= depositDeadline, "Too early");

        CommitmentTicket storage ticket = commitments[msg.sender];
        require(ticket.amount > 0, "No commitment");
        require(ticket.deposited, "Did not deposit - bond forfeited");

        // If pro-rata reduced allocation, refund the difference in bond
        uint256 usedBond = ticket.actualAllocation < ticket.bondDeposited
            ? ticket.actualAllocation
            : ticket.bondDeposited;
        uint256 refund = ticket.bondDeposited - usedBond;

        if (refund > 0) {
            ticket.bondDeposited = usedBond;
            usdc.safeTransfer(msg.sender, refund);
            emit BondRefunded(msg.sender, refund);
        }
    }

    /// @notice Forfeit bond for no-show investors (permissionless, after deposit deadline)
    function forfeitBond(address investor) external {
        require(block.timestamp >= depositDeadline, "Too early");

        CommitmentTicket storage ticket = commitments[investor];
        require(ticket.amount > 0, "No commitment");
        require(!ticket.deposited, "Investor deposited");
        require(ticket.bondDeposited > 0, "Already forfeited");

        uint256 forfeited = ticket.bondDeposited;
        ticket.bondDeposited = 0;
        totalForfeitedBonds += forfeited;

        // Forfeited bonds go to the protocol admin (bondRecipient)
        usdc.safeTransfer(bondRecipient, forfeited);

        emit BondForfeited(investor, forfeited);
    }

    // ─── View functions ─────────────────────────────────────────

    /// @notice Calculate pro-rata allocation for an investor
    function getProRataAllocation(address investor) public view returns (uint256) {
        CommitmentTicket memory ticket = commitments[investor];
        if (ticket.amount == 0) return 0;

        if (totalCommitted <= coverageTarget) {
            // Not oversubscribed — full allocation
            return ticket.amount;
        }

        // Oversubscribed — pro-rata
        return (ticket.amount * coverageTarget) / totalCommitted;
    }

    /// @notice Whether the market is oversubscribed
    function isOversubscribed() external view returns (bool) {
        return totalCommitted > coverageTarget;
    }

    /// @notice Number of committed investors
    function committedInvestorCount() external view returns (uint256) {
        return committedInvestors.length;
    }

    /// @notice Get commitment ticket for an investor
    function getTicket(address investor) external view returns (CommitmentTicket memory) {
        return commitments[investor];
    }

    /// @notice Fill percentage (basis points)
    function fillPercentageBps() external view returns (uint256) {
        if (coverageTarget == 0) return 0;
        return (totalDeposited * 10000) / coverageTarget;
    }

    // ─── Internal ───────────────────────────────────────────────

    function _checkTransition() internal {
        // Auto-transition to deposit day if commitment deadline passed
        if (block.timestamp >= commitmentDeadline && state == State.COMMITMENT_OPEN) {
            state = State.DEPOSIT_DAY;
        }
    }
}
