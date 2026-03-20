// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title MarketRegistry — Catalog of all protection markets
/// @notice Stores references to all deployed market contracts for frontend discovery.
///         Only the MarketFactory can register new markets.
contract MarketRegistry is Ownable {
    enum MarketStatus {
        COMMITTING,
        DEPOSIT_DAY,
        ACTIVE,
        TRIGGERED,
        MATURED,
        EARLY_EXIT
    }

    struct MarketInfo {
        uint256 marketId;
        address riskHolder;
        address coverageAgreement;
        address vaultWrapper;
        address catbondToken;
        address premiumEscrow;
        address commitmentManager;
        address orderBook;
        address simpleVault;
        string perilType;
        MarketStatus status;
        uint256 coverageTarget;
        uint256 actualFill;
        uint256 premiumRateBps;
        uint32 duration;
        uint256 lockedAt;
        string metadataURI;
    }

    uint256 public nextMarketId = 1;
    mapping(uint256 => MarketInfo) public markets;
    mapping(string => uint256[]) public marketsByPeril;
    mapping(address => uint256[]) public marketsByRiskHolder;
    uint256[] public activeMarketIds;

    address public factory;

    event MarketRegistered(uint256 indexed marketId, address indexed riskHolder, string perilType);
    event MarketStatusUpdated(uint256 indexed marketId, MarketStatus newStatus);

    constructor() Ownable(msg.sender) {}

    /// @notice Set the authorized factory address
    function setFactory(address _factory) external onlyOwner {
        require(_factory != address(0), "Invalid factory");
        factory = _factory;
    }

    modifier onlyFactory() {
        require(msg.sender == factory, "Only factory");
        _;
    }

    modifier onlyFactoryOrMarketContract(uint256 marketId) {
        require(
            msg.sender == factory || msg.sender == markets[marketId].commitmentManager
                || msg.sender == markets[marketId].vaultWrapper || msg.sender == markets[marketId].coverageAgreement,
            "Unauthorized"
        );
        _;
    }

    /// @notice Register a new market (called by MarketFactory)
    function registerMarket(MarketInfo calldata info) external onlyFactory returns (uint256 marketId) {
        marketId = nextMarketId++;
        MarketInfo storage m = markets[marketId];
        m.marketId = marketId;
        m.riskHolder = info.riskHolder;
        m.coverageAgreement = info.coverageAgreement;
        m.vaultWrapper = info.vaultWrapper;
        m.catbondToken = info.catbondToken;
        m.premiumEscrow = info.premiumEscrow;
        m.commitmentManager = info.commitmentManager;
        m.orderBook = info.orderBook;
        m.simpleVault = info.simpleVault;
        m.perilType = info.perilType;
        m.status = MarketStatus.COMMITTING;
        m.coverageTarget = info.coverageTarget;
        m.premiumRateBps = info.premiumRateBps;
        m.duration = info.duration;
        m.metadataURI = info.metadataURI;

        marketsByPeril[info.perilType].push(marketId);
        marketsByRiskHolder[info.riskHolder].push(marketId);
        activeMarketIds.push(marketId);

        emit MarketRegistered(marketId, info.riskHolder, info.perilType);
    }

    /// @notice Update market status
    function updateMarketStatus(uint256 marketId, MarketStatus newStatus)
        external
        onlyFactoryOrMarketContract(marketId)
    {
        require(markets[marketId].marketId != 0, "Market not found");
        markets[marketId].status = newStatus;
        emit MarketStatusUpdated(marketId, newStatus);
    }

    /// @notice Update actual fill amount
    function updateActualFill(uint256 marketId, uint256 fill) external onlyFactoryOrMarketContract(marketId) {
        markets[marketId].actualFill = fill;
    }

    /// @notice Update locked timestamp
    function updateLockedAt(uint256 marketId, uint256 timestamp) external onlyFactoryOrMarketContract(marketId) {
        markets[marketId].lockedAt = timestamp;
    }

    /// @notice Get market info
    function getMarket(uint256 marketId) external view returns (MarketInfo memory) {
        require(markets[marketId].marketId != 0, "Market not found");
        return markets[marketId];
    }

    /// @notice Get all active market IDs
    function getActiveMarketIds() external view returns (uint256[] memory) {
        return activeMarketIds;
    }

    /// @notice Get markets by peril type
    function getMarketsByPeril(string calldata perilType) external view returns (uint256[] memory) {
        return marketsByPeril[perilType];
    }

    /// @notice Get markets by risk holder
    function getMarketsByRiskHolder(address riskHolder) external view returns (uint256[] memory) {
        return marketsByRiskHolder[riskHolder];
    }

    /// @notice Total number of markets
    function totalMarkets() external view returns (uint256) {
        return nextMarketId - 1;
    }
}
