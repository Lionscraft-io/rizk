// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/interfaces/IERC4626.sol";
import "./SimpleVault.sol";
import "./CatbondToken.sol";

/// @title VaultWrapper — ERC-4626 bridge between CatbondTokens and SimpleVault
/// @notice Deposits USDC into SimpleVault, mints CatbondTokens 1:1 (pre-slash).
///         Handles redemption at the current redemption rate (reduced after slash).
///         Distributes premium rewards to token holders via Synthetix dividend pattern.
///         Implements ERC-4626 for composability with DeFi aggregators.
contract VaultWrapper {
    using SafeERC20 for IERC20;

    SimpleVault public immutable vault;
    CatbondToken public catbondToken; // Set after deployment
    IERC20 public immutable underlyingToken;
    uint256 public immutable marketId;

    address public admin;
    address public oracle; // MockOracle — can notify slashes
    address public commitmentManager; // Authorized depositor during commitment phase
    address public premiumEscrow; // Source of premium drips

    uint256 public totalDeposited; // Total USDC deposited (before any slash)
    uint256 public totalSlashed; // Amount slashed
    bool public slashed; // Whether a slash has occurred

    event Deposited(address indexed depositor, uint256 assets, uint256 shares);
    event Redeemed(address indexed redeemer, uint256 shares, uint256 assets);
    event SlashDetected(uint256 slashedAmount, uint256 newRedemptionRate);
    event PremiumDistributed(uint256 amount);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    modifier onlyCommitmentManager() {
        require(msg.sender == commitmentManager, "Only commitment manager");
        _;
    }

    constructor(address _vault, address _underlyingToken, uint256 _marketId, address _admin) {
        vault = SimpleVault(_vault);
        underlyingToken = IERC20(_underlyingToken);
        marketId = _marketId;
        admin = _admin;
    }

    /// @notice Set the CatbondToken address (called once by factory after both are deployed)
    function setCatbondToken(address _token) external onlyAdmin {
        require(address(catbondToken) == address(0), "Already set");
        catbondToken = CatbondToken(_token);
    }

    /// @notice Set the CommitmentManager address (called once by factory)
    function setCommitmentManager(address _cm) external onlyAdmin {
        require(commitmentManager == address(0), "Already set");
        commitmentManager = _cm;
    }

    /// @notice Set the PremiumEscrow address (called once by factory)
    function setPremiumEscrow(address _escrow) external onlyAdmin {
        require(premiumEscrow == address(0), "Already set");
        premiumEscrow = _escrow;
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

    // ─── ERC-4626-style deposit ─────────────────────────────────

    /// @notice Deposit USDC and mint CatbondTokens (called by CommitmentManager)
    /// @param assets Amount of USDC to deposit
    /// @param receiver Who receives the CatbondTokens
    /// @return shares Amount of CatbondTokens minted
    function deposit(uint256 assets, address receiver) external onlyCommitmentManager returns (uint256 shares) {
        require(vault.state() == SimpleVault.VaultState.DEPOSITS, "Vault not accepting deposits");
        require(assets > 0, "Zero deposit");

        shares = assets; // 1:1 before any slash

        // Transfer USDC from CommitmentManager to this contract, then to vault
        underlyingToken.safeTransferFrom(msg.sender, address(this), assets);
        underlyingToken.approve(address(vault), assets);
        vault.deposit(assets);

        totalDeposited += assets;

        // Mint CatbondTokens to the receiver
        catbondToken.mint(receiver, shares);

        emit Deposited(receiver, assets, shares);
    }

    // ─── ERC-4626-style redeem ──────────────────────────────────

    /// @notice Redeem CatbondTokens for USDC (after vault enters WITHDRAWALS)
    /// @param shares Amount of CatbondTokens to burn
    /// @return assets Amount of USDC received
    function redeem(uint256 shares) external returns (uint256 assets) {
        require(vault.state() == SimpleVault.VaultState.WITHDRAWALS, "Vault not in withdrawals");
        require(shares > 0, "Zero redeem");
        require(catbondToken.balanceOf(msg.sender) >= shares, "Insufficient tokens");

        // Calculate USDC amount based on redemption rate
        assets = convertToAssets(shares);

        // Burn CatbondTokens
        catbondToken.burn(msg.sender, shares);

        // Withdraw from vault
        vault.withdraw(assets, msg.sender);

        emit Redeemed(msg.sender, shares, assets);
    }

    // ─── Slash handling ─────────────────────────────────────────

    /// @notice Called after SimpleVault is slashed to update redemption accounting
    /// @param slashedAmt The amount that was slashed from the vault
    function onSlash(uint256 slashedAmt) external {
        require(msg.sender == address(vault) || msg.sender == admin || msg.sender == oracle, "Unauthorized");
        totalSlashed += slashedAmt;
        slashed = true;
        emit SlashDetected(slashedAmt, getRedemptionRate());
    }

    // ─── Premium distribution ───────────────────────────────────

    /// @notice Receive premium drip and distribute to token holders
    /// @param amount Amount of USDC premium to distribute
    function distributePremium(uint256 amount) external {
        require(msg.sender == premiumEscrow, "Only escrow");
        require(amount > 0, "Zero amount");

        underlyingToken.safeTransferFrom(msg.sender, address(this), amount);
        catbondToken.notifyRewardAmount(amount);

        emit PremiumDistributed(amount);
    }

    /// @notice Claim accumulated premium rewards
    function claimRewards() external returns (uint256 reward) {
        reward = catbondToken.claimReward(msg.sender);
        if (reward > 0) {
            underlyingToken.safeTransfer(msg.sender, reward);
        }
    }

    // ─── ERC-4626 view functions ────────────────────────────────

    /// @notice Current USDC per CatbondToken (1e6 precision, matching USDC decimals)
    function getRedemptionRate() public view returns (uint256) {
        if (totalDeposited == 0) return 1e6;
        return ((totalDeposited - totalSlashed) * 1e6) / totalDeposited;
    }

    /// @notice Convert CatbondToken shares to USDC assets
    function convertToAssets(uint256 shares) public view returns (uint256) {
        if (totalDeposited == 0) return shares;
        return (shares * (totalDeposited - totalSlashed)) / totalDeposited;
    }

    /// @notice Convert USDC assets to CatbondToken shares
    function convertToShares(uint256 assets) public view returns (uint256) {
        if (totalDeposited == 0) return assets;
        return (assets * totalDeposited) / (totalDeposited - totalSlashed);
    }

    /// @notice Maximum deposit amount (0 if vault not in DEPOSITS state)
    function maxDeposit() external view returns (uint256) {
        if (vault.state() != SimpleVault.VaultState.DEPOSITS) return 0;
        return vault.stakeCap() - vault.totalDeposited();
    }

    /// @notice Maximum withdrawable amount for a user (0 if not in WITHDRAWALS)
    function maxWithdraw(address owner) external view returns (uint256) {
        if (vault.state() != SimpleVault.VaultState.WITHDRAWALS) return 0;
        return convertToAssets(catbondToken.balanceOf(owner));
    }

    /// @notice Total assets held in the underlying vault
    function totalAssets() external view returns (uint256) {
        return totalDeposited - totalSlashed;
    }

    /// @notice Claimable premium reward for a user
    function claimableRewards(address account) external view returns (uint256) {
        return catbondToken.earned(account);
    }
}
