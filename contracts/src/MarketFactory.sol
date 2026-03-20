// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./RizkRegistry.sol";
import "./MarketRegistry.sol";
import "./SimpleVault.sol";
import "./VaultWrapper.sol";
import "./CatbondToken.sol";
import "./CommitmentManager.sol";
import "./PremiumEscrow.sol";
import "./CoverageAgreement.sol";
import "./MockOracle.sol";
import "./OrderBook.sol";
import "./VaultDeployer.sol";
import "./MarketDeployer.sol";
import "./AgreementDeployer.sol";

/// @title MarketFactory — Deploys all contracts for a new protection market
/// @notice Uses VaultDeployer, MarketDeployer, and AgreementDeployer helpers
///         to stay under EIP-170 contract size limit.
contract MarketFactory {
    using SafeERC20 for IERC20;

    struct MarketConfig {
        address riskHolder;
        address payoutAddress;
        uint256 coverageTarget;
        uint256 minimumFillBps;
        uint256 premiumRateBps;
        uint32 duration;
        uint32 commitmentWindow;
        uint256 commitmentBondBps;
        bool autoLockAtTarget;
        string perilType;
        bytes32 regionHash;
        string metadataURI;
        CoverageAgreement.AttachmentPoint[] attachmentPoints;
    }

    IERC20 public immutable usdc;
    RizkRegistry public immutable registry;
    MarketRegistry public immutable marketRegistry;
    MockOracle public immutable oracle;
    VaultDeployer public immutable vaultDeployer;
    MarketDeployer public immutable marketDeployer;
    AgreementDeployer public immutable agreementDeployer;
    address public admin;

    event MarketCreated(
        uint256 indexed marketId,
        address indexed riskHolder,
        string perilType,
        address simpleVault,
        address vaultWrapper,
        address catbondToken,
        address commitmentManager,
        address premiumEscrow,
        address coverageAgreement,
        address orderBook
    );

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    constructor(
        address _usdc,
        address _registry,
        address _marketRegistry,
        address _oracle,
        address _vaultDeployer,
        address _marketDeployer,
        address _agreementDeployer,
        address _admin
    ) {
        usdc = IERC20(_usdc);
        registry = RizkRegistry(_registry);
        marketRegistry = MarketRegistry(_marketRegistry);
        oracle = MockOracle(_oracle);
        vaultDeployer = VaultDeployer(_vaultDeployer);
        marketDeployer = MarketDeployer(_marketDeployer);
        agreementDeployer = AgreementDeployer(_agreementDeployer);
        admin = _admin;
    }

    /// @notice Create a new protection market
    function createProtectionMarket(MarketConfig calldata config, uint256 initialEscrow)
        external
        returns (uint256 marketId)
    {
        // ─── Validation ─────────────────────────────────────────
        require(registry.isApprovedRiskHolder(config.riskHolder), "Risk holder not approved");
        require(config.coverageTarget > 0, "Zero coverage target");
        require(config.minimumFillBps > 0 && config.minimumFillBps <= 10000, "Invalid minimum fill");
        require(config.premiumRateBps > 0, "Zero premium rate");
        require(config.duration > 0, "Zero duration");
        require(config.commitmentWindow > 0, "Zero commitment window");
        require(config.attachmentPoints.length > 0, "No attachment points");
        require(initialEscrow > 0, "Zero initial escrow");

        marketId = marketRegistry.nextMarketId();

        // ─── Deploy vault-side contracts ─────────────────────────
        (address simpleVaultAddr, address vaultWrapperAddr, address catbondTokenAddr) =
            vaultDeployer.deploy(
                address(usdc),
                address(this),
                admin,
                config.payoutAddress,
                config.coverageTarget,
                config.duration,
                marketId,
                string.concat("RIZK Cat Bond - ", config.perilType),
                string.concat("rCB-", _uint2str(marketId))
            );

        // ─── Deploy commitment + escrow ──────────────────────────
        uint256 quarterlyPremium = (config.coverageTarget * config.premiumRateBps) / 40000;

        (address cmAddr, address escrowAddr) =
            marketDeployer.deploy(
                MarketDeployer.MarketParams({
                    usdc: address(usdc),
                    vaultWrapper: vaultWrapperAddr,
                    factoryAddr: address(this),
                    protocolAdmin: admin,
                    riskHolder: config.riskHolder,
                    marketId: marketId,
                    coverageTarget: config.coverageTarget,
                    minimumFillBps: config.minimumFillBps,
                    commitmentBondBps: config.commitmentBondBps,
                    autoLockAtTarget: config.autoLockAtTarget,
                    commitmentWindow: config.commitmentWindow,
                    quarterlyPremium: quarterlyPremium
                })
            );

        // ─── Deploy coverage agreement ───────────────────────────
        address agreementAddr = agreementDeployer.deploy(
            config.riskHolder,
            config.payoutAddress,
            marketId,
            config.perilType,
            config.regionHash,
            config.duration,
            config.metadataURI,
            config.attachmentPoints,
            address(this)
        );

        // ─── Deploy OrderBook directly (small bytecode) ──────────
        address orderBookAddr = address(new OrderBook(address(usdc), catbondTokenAddr, marketId));

        // ─── Wire everything together ────────────────────────────
        SimpleVault(simpleVaultAddr).setVaultWrapper(vaultWrapperAddr);
        SimpleVault(simpleVaultAddr).setOracle(address(oracle));

        VaultWrapper wrapper = VaultWrapper(vaultWrapperAddr);
        wrapper.setCatbondToken(catbondTokenAddr);
        wrapper.setCommitmentManager(cmAddr);
        wrapper.setPremiumEscrow(escrowAddr);
        wrapper.setOracle(address(oracle));

        CoverageAgreement(agreementAddr).setOracle(address(oracle));

        oracle.registerMarket(marketId, agreementAddr, simpleVaultAddr, vaultWrapperAddr);

        // ─── Register in MarketRegistry ──────────────────────────
        marketRegistry.registerMarket(MarketRegistry.MarketInfo({
            marketId: marketId,
            riskHolder: config.riskHolder,
            coverageAgreement: agreementAddr,
            vaultWrapper: vaultWrapperAddr,
            catbondToken: catbondTokenAddr,
            premiumEscrow: escrowAddr,
            commitmentManager: cmAddr,
            orderBook: orderBookAddr,
            simpleVault: simpleVaultAddr,
            perilType: config.perilType,
            status: MarketRegistry.MarketStatus.COMMITTING,
            coverageTarget: config.coverageTarget,
            actualFill: 0,
            premiumRateBps: config.premiumRateBps,
            duration: config.duration,
            lockedAt: 0,
            metadataURI: config.metadataURI
        }));

        // ─── Transfer initial escrow via depositPremium() ────────
        usdc.safeTransferFrom(msg.sender, address(this), initialEscrow);
        usdc.approve(escrowAddr, initialEscrow);
        PremiumEscrow(escrowAddr).depositPremium(initialEscrow);

        emit MarketCreated(
            marketId, config.riskHolder, config.perilType,
            simpleVaultAddr, vaultWrapperAddr, catbondTokenAddr,
            cmAddr, escrowAddr, agreementAddr, orderBookAddr
        );
    }

    /// @notice Lock a market after deposit day (admin only)
    function lockMarket(uint256 marketId) external onlyAdmin {
        MarketRegistry.MarketInfo memory info = marketRegistry.getMarket(marketId);

        CommitmentManager cm = CommitmentManager(info.commitmentManager);
        cm.lockMarket();
        uint256 actualFill = cm.totalDeposited();

        SimpleVault vault = SimpleVault(info.simpleVault);
        vault.updateStakeCap(actualFill);
        vault.lock();

        CoverageAgreement(info.coverageAgreement).activate();

        PremiumEscrow escrow = PremiumEscrow(info.premiumEscrow);
        escrow.onMarketLocked();
        escrow.adjustForActualFill(actualFill, info.coverageTarget);

        marketRegistry.updateMarketStatus(marketId, MarketRegistry.MarketStatus.ACTIVE);
        marketRegistry.updateActualFill(marketId, actualFill);
        marketRegistry.updateLockedAt(marketId, block.timestamp);
    }

    /// @notice Mark a market as matured after duration elapses
    function matureMarket(uint256 marketId) external {
        MarketRegistry.MarketInfo memory info = marketRegistry.getMarket(marketId);

        SimpleVault(info.simpleVault).markMatured();
        CoverageAgreement(info.coverageAgreement).markMatured();
        PremiumEscrow(info.premiumEscrow).settle();

        marketRegistry.updateMarketStatus(marketId, MarketRegistry.MarketStatus.MATURED);
    }

    function _uint2str(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) { digits++; temp /= 10; }
        bytes memory buffer = new bytes(digits);
        while (value != 0) { digits -= 1; buffer[digits] = bytes1(uint8(48 + uint256(value % 10))); value /= 10; }
        return string(buffer);
    }
}
