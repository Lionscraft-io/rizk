// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title CoverageAgreement — On-chain record of protection terms
/// @notice Purely informational contract storing the coverage terms for a market.
///         Used by MockOracle to determine slash percentage based on event severity.
///         Attachment points define graduated payout thresholds.
contract CoverageAgreement {
    enum Status {
        PENDING,
        ACTIVE,
        TRIGGERED,
        MATURED,
        TERMINATED
    }

    struct AttachmentPoint {
        uint256 threshold; // Severity value (e.g., wind speed in km/h)
        uint256 slashBps; // Slash percentage in basis points (5000 = 50%)
    }

    address public immutable riskHolder;
    address public immutable payoutAddress;
    uint256 public immutable marketId;
    string public perilType;
    bytes32 public immutable regionHash;
    uint32 public immutable duration;
    string public metadataURI;
    address public admin;
    address public oracle; // MockOracle — can mark triggered

    AttachmentPoint[] public attachmentPoints;
    Status public status;
    uint256 public lockedAt;

    event StatusChanged(Status oldStatus, Status newStatus);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    modifier onlyAdminOrOracle() {
        require(msg.sender == admin || msg.sender == oracle, "Only admin or oracle");
        _;
    }

    constructor(
        address _riskHolder,
        address _payoutAddress,
        uint256 _marketId,
        string memory _perilType,
        bytes32 _regionHash,
        uint32 _duration,
        string memory _metadataURI,
        AttachmentPoint[] memory _attachmentPoints,
        address _admin
    ) {
        riskHolder = _riskHolder;
        payoutAddress = _payoutAddress;
        marketId = _marketId;
        perilType = _perilType;
        regionHash = _regionHash;
        duration = _duration;
        metadataURI = _metadataURI;
        admin = _admin;
        status = Status.PENDING;

        // Copy attachment points (must be sorted ascending by threshold)
        for (uint256 i = 0; i < _attachmentPoints.length; i++) {
            if (i > 0) {
                require(
                    _attachmentPoints[i].threshold > _attachmentPoints[i - 1].threshold,
                    "Attachment points must be sorted ascending"
                );
            }
            require(_attachmentPoints[i].slashBps > 0 && _attachmentPoints[i].slashBps <= 10000, "Invalid slash bps");
            attachmentPoints.push(_attachmentPoints[i]);
        }
    }

    /// @notice Activate the coverage agreement (called when vault locks)
    function activate() external onlyAdmin {
        require(status == Status.PENDING, "Not pending");
        status = Status.ACTIVE;
        lockedAt = block.timestamp;
        emit StatusChanged(Status.PENDING, Status.ACTIVE);
    }

    /// @notice Set the oracle address (called once by factory)
    function setOracle(address _oracle) external onlyAdmin {
        require(oracle == address(0), "Already set");
        oracle = _oracle;
    }

    /// @notice Mark as triggered (called after oracle resolution + slash)
    function markTriggered() external onlyAdminOrOracle {
        require(status == Status.ACTIVE, "Not active");
        Status old = status;
        status = Status.TRIGGERED;
        emit StatusChanged(old, Status.TRIGGERED);
    }

    /// @notice Mark as matured (called after normal expiry)
    function markMatured() external onlyAdmin {
        require(status == Status.ACTIVE, "Not active");
        Status old = status;
        status = Status.MATURED;
        emit StatusChanged(old, Status.MATURED);
    }

    /// @notice Transfer admin role to a new address (used by factory after wiring)
    function transferAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "Zero address");
        admin = newAdmin;
    }

    /// @notice Mark as terminated (called on premium default early exit)
    function markTerminated() external onlyAdmin {
        require(status == Status.ACTIVE || status == Status.PENDING, "Cannot terminate");
        Status old = status;
        status = Status.TERMINATED;
        emit StatusChanged(old, Status.TERMINATED);
    }

    /// @notice Given an oracle-resolved severity value, return the slash percentage
    /// @param severityValue The resolved severity (e.g., 195 km/h wind speed)
    /// @return slashBps Slash percentage in basis points (0 if below first threshold)
    function getSlashPercentage(uint256 severityValue) external view returns (uint256) {
        uint256 result = 0;
        for (uint256 i = 0; i < attachmentPoints.length; i++) {
            if (severityValue >= attachmentPoints[i].threshold) {
                result = attachmentPoints[i].slashBps;
            } else {
                break;
            }
        }
        return result;
    }

    /// @notice Whether the agreement is currently active
    function isActive() external view returns (bool) {
        return status == Status.ACTIVE && block.timestamp <= lockedAt + duration;
    }

    /// @notice Get all attachment points
    function getAttachmentPoints() external view returns (AttachmentPoint[] memory) {
        return attachmentPoints;
    }

    /// @notice Number of attachment points
    function attachmentPointCount() external view returns (uint256) {
        return attachmentPoints.length;
    }
}
