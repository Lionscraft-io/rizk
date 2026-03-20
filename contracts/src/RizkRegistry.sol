// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title RizkRegistry — Admin-managed risk holder whitelist
/// @notice Manages KYB-verified risk holders who can create protection markets.
///         In v0.9, the registrar is a single owner (deployer). In production, this
///         would be a multisig or governance contract.
contract RizkRegistry is Ownable {
    struct RiskHolderProfile {
        string name;
        string jurisdiction;
        bytes32 verificationHash; // Hash of off-chain KYB documents
        uint256 approvedAt;
    }

    mapping(address => bool) public approvedRiskHolders;
    mapping(address => RiskHolderProfile) public riskHolderProfiles;

    event RiskHolderApproved(address indexed entity, string name, string jurisdiction);
    event RiskHolderRevoked(address indexed entity);

    constructor() Ownable(msg.sender) {}

    /// @notice Approve a risk holder after off-chain KYB verification
    /// @param entity The address of the risk holder
    /// @param name Human-readable name
    /// @param jurisdiction Legal jurisdiction (e.g., "JM" for Jamaica)
    /// @param verificationHash Keccak256 of off-chain verification documents
    function approveRiskHolder(
        address entity,
        string calldata name,
        string calldata jurisdiction,
        bytes32 verificationHash
    ) external onlyOwner {
        require(entity != address(0), "Invalid address");
        require(!approvedRiskHolders[entity], "Already approved");

        approvedRiskHolders[entity] = true;
        riskHolderProfiles[entity] = RiskHolderProfile({
            name: name,
            jurisdiction: jurisdiction,
            verificationHash: verificationHash,
            approvedAt: block.timestamp
        });

        emit RiskHolderApproved(entity, name, jurisdiction);
    }

    /// @notice Revoke a risk holder's approval
    function revokeRiskHolder(address entity) external onlyOwner {
        require(approvedRiskHolders[entity], "Not approved");
        approvedRiskHolders[entity] = false;
        emit RiskHolderRevoked(entity);
    }

    /// @notice Check if an address is an approved risk holder
    function isApprovedRiskHolder(address entity) external view returns (bool) {
        return approvedRiskHolders[entity];
    }

    /// @notice Get a risk holder's profile
    function getProfile(address entity) external view returns (RiskHolderProfile memory) {
        return riskHolderProfiles[entity];
    }
}
