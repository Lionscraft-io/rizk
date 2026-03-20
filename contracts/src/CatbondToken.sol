// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title CatbondToken — Vault share token for RIZK protection markets
/// @notice Freely transferable ERC-20 minted/burned exclusively by the VaultWrapper.
///         Implements Synthetix-style reward tracking so premium dividends accrue
///         correctly to holders, including secondary market buyers.
contract CatbondToken is ERC20 {
    address public immutable vaultWrapper;
    uint256 public immutable marketId;
    string private _tokenName;
    string private _tokenSymbol;

    // ─── Premium reward tracking (Synthetix pattern) ────────────
    uint256 public rewardPerTokenStored; // Accumulated rewards per token (1e18 precision)
    mapping(address => uint256) public userRewardPerTokenPaid; // Snapshot per user
    mapping(address => uint256) public rewards; // Unclaimed rewards per user

    event RewardAdded(uint256 reward);
    event RewardClaimed(address indexed user, uint256 amount);

    modifier onlyWrapper() {
        require(msg.sender == vaultWrapper, "Only wrapper");
        _;
    }

    constructor(string memory name_, string memory symbol_, uint256 _marketId, address _vaultWrapper)
        ERC20(name_, symbol_)
    {
        _tokenName = name_;
        _tokenSymbol = symbol_;
        marketId = _marketId;
        vaultWrapper = _vaultWrapper;
    }

    function decimals() public pure override returns (uint8) {
        return 6; // Match USDC decimals
    }

    // ─── Mint / Burn (VaultWrapper only) ────────────────────────

    function mint(address to, uint256 amount) external onlyWrapper {
        _updateReward(to);
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external onlyWrapper {
        _updateReward(from);
        _burn(from, amount);
    }

    // ─── Premium reward distribution ────────────────────────────

    /// @notice Notify that new premium rewards have been added
    /// @dev Called by VaultWrapper when premium drips arrive
    function notifyRewardAmount(uint256 reward) external onlyWrapper {
        if (totalSupply() == 0) return;
        rewardPerTokenStored += (reward * 1e18) / totalSupply();
        emit RewardAdded(reward);
    }

    /// @notice Calculate earned but unclaimed rewards for a user
    function earned(address account) public view returns (uint256) {
        return rewards[account]
            + (balanceOf(account) * (rewardPerTokenStored - userRewardPerTokenPaid[account])) / 1e18;
    }

    /// @notice Claim accumulated premium rewards
    /// @return reward Amount of USDC rewards claimed
    function claimReward(address account) external onlyWrapper returns (uint256 reward) {
        _updateReward(account);
        reward = rewards[account];
        if (reward > 0) {
            rewards[account] = 0;
            emit RewardClaimed(account, reward);
        }
    }

    // ─── Internal: update rewards on every transfer ─────────────

    function _updateReward(address account) internal {
        if (account != address(0)) {
            rewards[account] = earned(account);
            userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }
    }

    /// @dev Override _update to track rewards on every transfer
    function _update(address from, address to, uint256 amount) internal override {
        if (from != address(0)) _updateReward(from);
        if (to != address(0)) _updateReward(to);
        super._update(from, to, amount);
    }
}
