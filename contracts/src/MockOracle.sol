// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./CoverageAgreement.sol";
import "./SimpleVault.sol";
import "./VaultWrapper.sol";

/// @title MockOracle — Admin-triggered event resolution for v0.9
/// @notice Replaces the UMA Optimistic Oracle + RizkAVS for the prototype.
///         An admin can trigger events with a severity value, which resolves
///         against the CoverageAgreement's attachment points and executes
///         a slash on the SimpleVault. Implements the same callback interface
///         (onOracleResolution) that the real system will use.
contract MockOracle {
    struct MarketOracle {
        address coverageAgreement;
        address simpleVault;
        address vaultWrapper;
        bool resolved;
        uint256 resolvedSeverity;
        uint256 slashBps;
    }

    address public admin;
    address public registrar; // Factory address authorized to register markets
    mapping(uint256 => MarketOracle) public marketOracles;

    event MarketRegistered(uint256 indexed marketId);
    event EventTriggered(uint256 indexed marketId, uint256 severity, uint256 slashBps, uint256 slashedAmount);
    event NoSlash(uint256 indexed marketId, uint256 severity);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    constructor(address _admin) {
        admin = _admin;
    }

    /// @notice Set the registrar (factory) address that can register markets
    function setRegistrar(address _registrar) external onlyAdmin {
        registrar = _registrar;
    }

    /// @notice Register a market's contracts with the oracle (called by factory)
    function registerMarket(
        uint256 marketId,
        address coverageAgreement,
        address simpleVault,
        address vaultWrapper
    ) external {
        require(marketOracles[marketId].coverageAgreement == address(0), "Already registered");
        marketOracles[marketId] = MarketOracle({
            coverageAgreement: coverageAgreement,
            simpleVault: simpleVault,
            vaultWrapper: vaultWrapper,
            resolved: false,
            resolvedSeverity: 0,
            slashBps: 0
        });
        emit MarketRegistered(marketId);
    }

    /// @notice Trigger an event for a market with a given severity value
    /// @dev This is the v0.9 equivalent of a UMA oracle resolution.
    ///      In v1, this would be called by RizkAVS.onOracleResolution()
    /// @param marketId The market to trigger
    /// @param severityValue The observed severity (e.g., 195 km/h wind speed)
    function triggerEvent(uint256 marketId, uint256 severityValue) external onlyAdmin {
        MarketOracle storage mo = marketOracles[marketId];
        require(mo.coverageAgreement != address(0), "Market not registered");
        require(!mo.resolved, "Already resolved");

        // Look up slash percentage from coverage agreement
        CoverageAgreement agreement = CoverageAgreement(mo.coverageAgreement);
        uint256 slashBps = agreement.getSlashPercentage(severityValue);

        mo.resolved = true;
        mo.resolvedSeverity = severityValue;
        mo.slashBps = slashBps;

        if (slashBps == 0) {
            emit NoSlash(marketId, severityValue);
            return;
        }

        // Execute slash on SimpleVault
        // Convert basis points to WAD (1e18 precision)
        uint256 wadToSlash = (slashBps * 1e18) / 10000;

        SimpleVault vault = SimpleVault(mo.simpleVault);
        vault.slash(wadToSlash);

        // Notify VaultWrapper of the slash
        VaultWrapper wrapper = VaultWrapper(mo.vaultWrapper);
        uint256 slashedAmount = (vault.totalDeposited() * slashBps) / 10000;
        wrapper.onSlash(slashedAmount);

        // Mark coverage agreement as triggered
        agreement.markTriggered();

        emit EventTriggered(marketId, severityValue, slashBps, slashedAmount);
    }

    /// @notice Check if a market has been resolved
    function isResolved(uint256 marketId) external view returns (bool) {
        return marketOracles[marketId].resolved;
    }

    /// @notice Get resolution details
    function getResolution(uint256 marketId) external view returns (uint256 severity, uint256 slashBps) {
        MarketOracle memory mo = marketOracles[marketId];
        return (mo.resolvedSeverity, mo.slashBps);
    }
}
