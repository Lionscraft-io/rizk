// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title MockUSDC — Test collateral token with public faucet
/// @notice Anyone can mint unlimited test USDC. 6 decimals like real USDC.
contract MockUSDC is ERC20 {
    constructor() ERC20("Mock USDC", "USDC") {}

    function decimals() public pure override returns (uint8) {
        return 6;
    }

    /// @notice Public faucet — anyone can mint test tokens
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
