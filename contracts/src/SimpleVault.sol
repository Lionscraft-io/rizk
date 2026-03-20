// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// @title SimpleVault — Mock Duration Vault for v0.9
/// @notice Standalone USDC vault implementing the same lifecycle as EigenLayer's
///         Duration Vault Strategy (ELIP-15): DEPOSITS → LOCKED → WITHDRAWALS.
///         Supports slashing with fund redistribution to a payout address.
///         Designed to be swapped for real EigenLayer Duration Vault in v1.
contract SimpleVault {
    using SafeERC20 for IERC20;

    enum VaultState {
        DEPOSITS,
        LOCKED,
        WITHDRAWALS
    }

    IERC20 public immutable underlyingToken;
    address public admin; // RIZK protocol admin (locks vault)
    address public arbitrator; // Can trigger early exit on premium default
    address public oracle; // MockOracle — can slash
    address public payoutAddress; // Where slashed funds go (risk holder)
    address public vaultWrapper; // Only the wrapper can deposit/withdraw

    VaultState public state;
    uint256 public stakeCap; // Max deposits
    uint256 public totalDeposited;
    uint256 public slashedAmount;
    uint256 public duration; // Coverage period in seconds
    uint256 public lockedAt; // Timestamp when locked
    uint256 public maturesAt; // Timestamp when coverage ends

    event Deposited(address indexed from, uint256 amount);
    event Withdrawn(address indexed to, uint256 amount);
    event Locked(uint256 timestamp, uint256 maturesAt);
    event Matured(uint256 timestamp);
    event AdvancedToWithdrawals(uint256 timestamp);
    event Slashed(uint256 amount, address indexed payoutAddress);
    event StakeCapUpdated(uint256 newCap);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    modifier onlyArbitrator() {
        require(msg.sender == arbitrator, "Only arbitrator");
        _;
    }

    modifier onlyOracle() {
        require(msg.sender == oracle, "Only oracle");
        _;
    }

    modifier onlyWrapper() {
        require(msg.sender == vaultWrapper, "Only wrapper");
        _;
    }

    modifier inState(VaultState _state) {
        require(state == _state, "Wrong state");
        _;
    }

    constructor(
        address _underlyingToken,
        address _admin,
        address _arbitrator,
        address _payoutAddress,
        uint256 _stakeCap,
        uint256 _duration
    ) {
        underlyingToken = IERC20(_underlyingToken);
        admin = _admin;
        arbitrator = _arbitrator;
        payoutAddress = _payoutAddress;
        stakeCap = _stakeCap;
        duration = _duration;
        state = VaultState.DEPOSITS;
    }

    /// @notice Set the vault wrapper address (called once by factory)
    function setVaultWrapper(address _wrapper) external onlyAdmin {
        require(vaultWrapper == address(0), "Already set");
        vaultWrapper = _wrapper;
    }

    /// @notice Set the oracle address (called once by factory)
    function setOracle(address _oracle) external onlyAdmin {
        require(oracle == address(0), "Already set");
        oracle = _oracle;
    }

    /// @notice Transfer admin role to a new address (used by factory after wiring)
    function transferAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "Zero address");
        admin = newAdmin;
    }

    // ─── Deposits ───────────────────────────────────────────────

    /// @notice Deposit USDC into the vault (only during DEPOSITS state)
    /// @param amount Amount of USDC to deposit
    function deposit(uint256 amount) external onlyWrapper inState(VaultState.DEPOSITS) {
        require(totalDeposited + amount <= stakeCap, "Exceeds stake cap");
        totalDeposited += amount;
        underlyingToken.safeTransferFrom(msg.sender, address(this), amount);
        emit Deposited(msg.sender, amount);
    }

    // ─── Lifecycle transitions ──────────────────────────────────

    /// @notice Lock the vault — transitions from DEPOSITS to LOCKED
    function lock() external onlyAdmin inState(VaultState.DEPOSITS) {
        require(totalDeposited > 0, "No deposits");
        state = VaultState.LOCKED;
        lockedAt = block.timestamp;
        maturesAt = block.timestamp + duration;
        emit Locked(block.timestamp, maturesAt);
    }

    /// @notice Mark the vault as matured — permissionless, callable after duration
    function markMatured() external inState(VaultState.LOCKED) {
        require(block.timestamp >= maturesAt, "Not matured yet");
        state = VaultState.WITHDRAWALS;
        emit Matured(block.timestamp);
    }

    /// @notice Early exit triggered by arbitrator (premium default)
    function advanceToWithdrawals() external onlyArbitrator inState(VaultState.LOCKED) {
        state = VaultState.WITHDRAWALS;
        emit AdvancedToWithdrawals(block.timestamp);
    }

    /// @notice Update stake cap (called at lock to match actual fill)
    function updateStakeCap(uint256 newCap) external onlyAdmin {
        stakeCap = newCap;
        emit StakeCapUpdated(newCap);
    }

    // ─── Slashing ───────────────────────────────────────────────

    /// @notice Slash a percentage of the vault, send to payout address
    /// @param wadToSlash Percentage to slash in WAD (1e18 = 100%)
    function slash(uint256 wadToSlash) external onlyOracle inState(VaultState.LOCKED) {
        require(wadToSlash > 0 && wadToSlash <= 1e18, "Invalid slash wad");

        uint256 currentBalance = totalDeposited - slashedAmount;
        uint256 slashAmt = (currentBalance * wadToSlash) / 1e18;

        slashedAmount += slashAmt;

        // Transfer slashed funds to the risk holder's payout address
        underlyingToken.safeTransfer(payoutAddress, slashAmt);

        // Transition to withdrawals after slash
        state = VaultState.WITHDRAWALS;

        emit Slashed(slashAmt, payoutAddress);
    }

    // ─── Withdrawals ────────────────────────────────────────────

    /// @notice Withdraw USDC from the vault (only during WITHDRAWALS state)
    /// @param amount Amount of USDC to withdraw
    /// @param to Recipient address
    function withdraw(uint256 amount, address to) external onlyWrapper inState(VaultState.WITHDRAWALS) {
        require(amount <= withdrawableBalance(), "Insufficient balance");
        underlyingToken.safeTransfer(to, amount);
        emit Withdrawn(to, amount);
    }

    // ─── View functions ─────────────────────────────────────────

    /// @notice Total withdrawable balance (deposits minus slashed)
    function withdrawableBalance() public view returns (uint256) {
        return totalDeposited - slashedAmount;
    }

    /// @notice Remaining deposit capacity
    function remainingCapacity() external view returns (uint256) {
        if (state != VaultState.DEPOSITS) return 0;
        return stakeCap - totalDeposited;
    }

    /// @notice Whether the vault has matured
    function isMatured() external view returns (bool) {
        return state == VaultState.LOCKED && block.timestamp >= maturesAt;
    }
}
