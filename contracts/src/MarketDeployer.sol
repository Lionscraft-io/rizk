// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./CommitmentManager.sol";
import "./PremiumEscrow.sol";

/// @title MarketDeployer — Deploys CommitmentManager + PremiumEscrow
/// @notice Separated from MarketFactory to stay under EIP-170 size limit.
contract MarketDeployer {
    struct MarketParams {
        address usdc;
        address vaultWrapper;
        address factoryAddr;
        address protocolAdmin;
        address riskHolder;
        uint256 marketId;
        uint256 coverageTarget;
        uint256 minimumFillBps;
        uint256 commitmentBondBps;
        bool autoLockAtTarget;
        uint32 commitmentWindow;
        uint256 quarterlyPremium;
    }

    function deploy(MarketParams calldata p)
        external
        returns (address commitmentManager, address premiumEscrow)
    {
        PremiumEscrow escrow = new PremiumEscrow(
            p.usdc,
            p.vaultWrapper,
            p.marketId,
            p.riskHolder,
            p.quarterlyPremium,
            p.factoryAddr
        );

        CommitmentManager cm = new CommitmentManager(
            p.usdc,
            p.vaultWrapper,
            p.marketId,
            p.coverageTarget,
            p.minimumFillBps,
            p.commitmentBondBps,
            p.autoLockAtTarget,
            p.commitmentWindow,
            p.factoryAddr,
            p.riskHolder,
            p.protocolAdmin
        );

        return (address(cm), address(escrow));
    }
}
