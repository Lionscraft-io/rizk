// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./VaultWrapper.sol";

/// @title PremiumEscrow — Holds and distributes risk holder premium payments
/// @notice Risk holders deposit quarterly premium. A permissionless drip()
///         function distributes accrued premium to the VaultWrapper for
///         distribution to CatbondToken holders. Detects premium defaults.
contract PremiumEscrow {
    using SafeERC20 for IERC20;

    IERC20 public immutable usdc;
    VaultWrapper public immutable vaultWrapper;
    uint256 public immutable marketId;

    address public riskHolder;
    address public admin;

    uint256 public quarterlyAmount; // Premium per quarter (adjusted at lock)
    uint256 public nextPaymentDue; // Timestamp of next required deposit
    uint256 public constant GRACE_PERIOD = 14 days;
    uint256 public constant QUARTER = 90 days;

    uint256 public totalEscrowed; // Total premium deposited by risk holder
    uint256 public totalDripped; // Total premium distributed to token holders
    uint256 public lastDripTimestamp;

    bool public locked; // Whether the market has been locked
    bool public settled; // Whether the market has been settled (matured/triggered)

    event PremiumDeposited(address indexed riskHolder, uint256 amount);
    event PremiumDripped(uint256 amount, address indexed to);
    event DefaultDetected(uint256 marketId, uint256 amountOverdue);
    event AdjustedForActualFill(uint256 oldAmount, uint256 newAmount, uint256 refund);
    event UnusedRefunded(address indexed riskHolder, uint256 amount);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    modifier onlyRiskHolder() {
        require(msg.sender == riskHolder, "Only risk holder");
        _;
    }

    constructor(
        address _usdc,
        address _vaultWrapper,
        uint256 _marketId,
        address _riskHolder,
        uint256 _quarterlyAmount,
        address _admin
    ) {
        usdc = IERC20(_usdc);
        vaultWrapper = VaultWrapper(_vaultWrapper);
        marketId = _marketId;
        riskHolder = _riskHolder;
        quarterlyAmount = _quarterlyAmount;
        admin = _admin;
    }

    // ─── Premium deposits ───────────────────────────────────────

    /// @notice Risk holder deposits premium (quarterly)
    function depositPremium(uint256 amount) external {
        require(amount > 0, "Zero amount");
        usdc.safeTransferFrom(msg.sender, address(this), amount);
        totalEscrowed += amount;
        emit PremiumDeposited(msg.sender, amount);
    }

    // ─── Premium distribution (drip) ────────────────────────────

    /// @notice Permissionless drip — distributes accrued premium to VaultWrapper
    /// @dev Can be called by anyone (keeper, user, etc.)
    function drip() external {
        require(locked, "Market not locked");
        require(!settled, "Market settled");

        uint256 available = totalEscrowed - totalDripped;
        require(available > 0, "Nothing to drip");

        // Calculate how much to drip based on time elapsed
        // Drip proportionally: (timeElapsed / quarter) * quarterlyAmount
        uint256 dripAmount;
        if (lastDripTimestamp == 0) {
            // First drip — use a reasonable initial amount
            dripAmount = available > quarterlyAmount ? quarterlyAmount : available;
        } else {
            uint256 elapsed = block.timestamp - lastDripTimestamp;
            dripAmount = (quarterlyAmount * elapsed) / QUARTER;
            if (dripAmount > available) dripAmount = available;
        }

        require(dripAmount > 0, "Nothing to drip yet");

        totalDripped += dripAmount;
        lastDripTimestamp = block.timestamp;

        // Transfer to VaultWrapper for distribution
        usdc.approve(address(vaultWrapper), dripAmount);
        vaultWrapper.distributePremium(dripAmount);

        emit PremiumDripped(dripAmount, address(vaultWrapper));
    }

    // ─── Lifecycle ──────────────────────────────────────────────

    /// @notice Called when the market locks — sets payment schedule
    function onMarketLocked() external onlyAdmin {
        locked = true;
        nextPaymentDue = block.timestamp + QUARTER;
        lastDripTimestamp = block.timestamp;
    }

    /// @notice Adjust premium for actual vault fill (called at lock)
    /// @param actualFill Actual USDC deposited into the vault
    /// @param coverageTarget Original coverage target
    function adjustForActualFill(uint256 actualFill, uint256 coverageTarget) external onlyAdmin {
        require(locked, "Not locked");

        if (actualFill >= coverageTarget) return; // Full fill, no adjustment

        uint256 oldAmount = quarterlyAmount;
        quarterlyAmount = (quarterlyAmount * actualFill) / coverageTarget;

        // Refund excess escrow to risk holder
        uint256 totalExpected = quarterlyAmount * 4; // Rough: 4 quarters per year
        if (totalEscrowed > totalExpected + totalDripped) {
            uint256 refund = totalEscrowed - totalExpected - totalDripped;
            totalEscrowed -= refund;
            usdc.safeTransfer(riskHolder, refund);
            emit AdjustedForActualFill(oldAmount, quarterlyAmount, refund);
        } else {
            emit AdjustedForActualFill(oldAmount, quarterlyAmount, 0);
        }
    }

    /// @notice Check if premium payment is overdue past grace period
    function checkDefault() external view returns (bool) {
        if (!locked || settled) return false;
        if (nextPaymentDue == 0) return false;
        return block.timestamp > nextPaymentDue + GRACE_PERIOD && totalEscrowed - totalDripped < quarterlyAmount;
    }

    /// @notice Mark as settled and refund remaining escrow
    function settle() external onlyAdmin {
        require(locked, "Not locked");
        settled = true;

        uint256 remaining = totalEscrowed - totalDripped;
        if (remaining > 0) {
            totalEscrowed = totalDripped;
            usdc.safeTransfer(riskHolder, remaining);
            emit UnusedRefunded(riskHolder, remaining);
        }
    }

    // ─── View functions ─────────────────────────────────────────

    /// @notice Available premium to drip
    function availableToDrip() external view returns (uint256) {
        return totalEscrowed - totalDripped;
    }

    /// @notice Whether premium is overdue (but still within grace)
    function isOverdue() external view returns (bool) {
        if (!locked || settled || nextPaymentDue == 0) return false;
        return block.timestamp > nextPaymentDue;
    }
}
