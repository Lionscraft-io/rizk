// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./SimpleVault.sol";
import "./VaultWrapper.sol";
import "./CatbondToken.sol";

/// @title VaultDeployer — Helper that deploys vault-side contracts
/// @notice Separated from MarketFactory to stay under EIP-170 size limit
contract VaultDeployer {
    function deploy(
        address usdc,
        address factoryAddr,
        address arbitrator,
        address payoutAddress,
        uint256 coverageTarget,
        uint32 duration,
        uint256 marketId,
        string calldata tokenName,
        string calldata tokenSymbol
    )
        external
        returns (address simpleVault, address vaultWrapper, address catbondToken)
    {
        SimpleVault vault = new SimpleVault(
            usdc,
            factoryAddr,  // factory as admin
            arbitrator,
            payoutAddress,
            coverageTarget,
            duration
        );

        VaultWrapper wrapper = new VaultWrapper(
            address(vault),
            usdc,
            marketId,
            factoryAddr  // factory as admin
        );

        CatbondToken token = new CatbondToken(
            tokenName,
            tokenSymbol,
            marketId,
            address(wrapper)
        );

        return (address(vault), address(wrapper), address(token));
    }
}
