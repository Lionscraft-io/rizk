// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./CoverageAgreement.sol";

/// @title AgreementDeployer — Deploys CoverageAgreement
/// @notice Separated from MarketFactory to stay under EIP-170 size limit.
contract AgreementDeployer {
    function deploy(
        address riskHolder,
        address payoutAddress,
        uint256 marketId,
        string calldata perilType,
        bytes32 regionHash,
        uint32 duration,
        string calldata metadataURI,
        CoverageAgreement.AttachmentPoint[] calldata attachmentPoints,
        address factoryAddr
    ) external returns (address) {
        CoverageAgreement agreement = new CoverageAgreement(
            riskHolder,
            payoutAddress,
            marketId,
            perilType,
            regionHash,
            duration,
            metadataURI,
            attachmentPoints,
            factoryAddr
        );
        return address(agreement);
    }
}
