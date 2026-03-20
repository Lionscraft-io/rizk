// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/MockUSDC.sol";
import "../src/RizkRegistry.sol";
import "../src/MarketRegistry.sol";
import "../src/MockOracle.sol";
import "../src/MarketFactory.sol";
import "../src/SimpleVault.sol";
import "../src/VaultWrapper.sol";
import "../src/CatbondToken.sol";
import "../src/CommitmentManager.sol";
import "../src/PremiumEscrow.sol";
import "../src/CoverageAgreement.sol";
import "../src/OrderBook.sol";
import "../src/VaultDeployer.sol";
import "../src/MarketDeployer.sol";
import "../src/AgreementDeployer.sol";

/// @title RizkLifecycleTest — Full lifecycle integration tests
contract RizkLifecycleTest is Test {
    MockUSDC usdc;
    RizkRegistry registry;
    MarketRegistry marketRegistry;
    MockOracle oracle;
    VaultDeployer vaultDeployer;
    MarketDeployer marketDeployer;
    AgreementDeployer agreementDeployer;
    MarketFactory factory;

    address admin = address(this);
    address riskHolder = address(0xA);
    address investor1 = address(0xB);
    address investor2 = address(0xC);
    address investor3 = address(0xD);
    address trader1 = address(0xE);

    uint256 constant COVERAGE_TARGET = 1_000_000e6; // 1M USDC
    uint256 constant INITIAL_ESCROW = 25_000e6;

    function setUp() public {
        // Deploy protocol
        usdc = new MockUSDC();
        registry = new RizkRegistry();
        marketRegistry = new MarketRegistry();
        oracle = new MockOracle(admin);
        vaultDeployer = new VaultDeployer();
        marketDeployer = new MarketDeployer();
        agreementDeployer = new AgreementDeployer();
        factory = new MarketFactory(
            address(usdc), address(registry), address(marketRegistry), address(oracle),
            address(vaultDeployer), address(marketDeployer), address(agreementDeployer), admin
        );
        marketRegistry.setFactory(address(factory));
        oracle.setRegistrar(address(factory));

        // Approve risk holder
        registry.approveRiskHolder(riskHolder, "Jamaica Cat Fund", "JM", keccak256("docs"));

        // Fund accounts
        usdc.mint(riskHolder, 100_000e6);
        usdc.mint(investor1, 500_000e6);
        usdc.mint(investor2, 500_000e6);
        usdc.mint(investor3, 500_000e6);
        usdc.mint(trader1, 100_000e6);
    }

    // ─── Helpers ────────────────────────────────────────────────

    function _createTestMarket() internal returns (uint256 marketId) {
        CoverageAgreement.AttachmentPoint[] memory aps = new CoverageAgreement.AttachmentPoint[](3);
        aps[0] = CoverageAgreement.AttachmentPoint(119, 2500);  // Cat 1: 25%
        aps[1] = CoverageAgreement.AttachmentPoint(178, 5000);  // Cat 3: 50%
        aps[2] = CoverageAgreement.AttachmentPoint(252, 10000); // Cat 5: 100%

        vm.startPrank(riskHolder);
        usdc.approve(address(factory), INITIAL_ESCROW);

        MarketFactory.MarketConfig memory config = MarketFactory.MarketConfig({
            riskHolder: riskHolder,
            payoutAddress: riskHolder,
            coverageTarget: COVERAGE_TARGET,
            minimumFillBps: 3000,
            premiumRateBps: 1000,
            duration: 365 days,
            commitmentWindow: 7 days,
            commitmentBondBps: 100,
            autoLockAtTarget: false,
            perilType: "HURRICANE",
            regionHash: keccak256("jamaica"),
            metadataURI: "ipfs://test",
            attachmentPoints: aps
        });

        marketId = factory.createProtectionMarket(config, INITIAL_ESCROW);
        vm.stopPrank();
    }

    function _getMarketContracts(uint256 marketId)
        internal
        view
        returns (
            CommitmentManager cm,
            VaultWrapper wrapper,
            CatbondToken token,
            SimpleVault vault,
            OrderBook orderBook,
            PremiumEscrow escrow,
            CoverageAgreement agreement
        )
    {
        MarketRegistry.MarketInfo memory info = marketRegistry.getMarket(marketId);
        cm = CommitmentManager(info.commitmentManager);
        wrapper = VaultWrapper(info.vaultWrapper);
        token = CatbondToken(info.catbondToken);
        vault = SimpleVault(info.simpleVault);
        orderBook = OrderBook(info.orderBook);
        escrow = PremiumEscrow(info.premiumEscrow);
        agreement = CoverageAgreement(info.coverageAgreement);
    }

    // ─── Test: Market creation ──────────────────────────────────

    function test_createMarket() public {
        uint256 marketId = _createTestMarket();
        assertEq(marketId, 1);

        MarketRegistry.MarketInfo memory info = marketRegistry.getMarket(marketId);
        assertEq(info.riskHolder, riskHolder);
        assertEq(info.coverageTarget, COVERAGE_TARGET);
        assertTrue(info.vaultWrapper != address(0));
        assertTrue(info.catbondToken != address(0));
    }

    function test_revertNonApprovedRiskHolder() public {
        CoverageAgreement.AttachmentPoint[] memory aps = new CoverageAgreement.AttachmentPoint[](1);
        aps[0] = CoverageAgreement.AttachmentPoint(119, 2500);

        MarketFactory.MarketConfig memory config = MarketFactory.MarketConfig({
            riskHolder: address(0xDEAD), // Not approved
            payoutAddress: address(0xDEAD),
            coverageTarget: COVERAGE_TARGET,
            minimumFillBps: 3000,
            premiumRateBps: 1000,
            duration: 365 days,
            commitmentWindow: 7 days,
            commitmentBondBps: 100,
            autoLockAtTarget: false,
            perilType: "HURRICANE",
            regionHash: keccak256("test"),
            metadataURI: "ipfs://test",
            attachmentPoints: aps
        });

        vm.expectRevert("Risk holder not approved");
        factory.createProtectionMarket(config, INITIAL_ESCROW);
    }

    // ─── Test: Commitment flow ──────────────────────────────────

    function test_commitAndDeposit() public {
        uint256 marketId = _createTestMarket();
        (CommitmentManager cm, VaultWrapper wrapper, CatbondToken token,,,,) = _getMarketContracts(marketId);

        // Investor1 commits 400k
        vm.startPrank(investor1);
        uint256 bond1 = (400_000e6 * 100) / 10000; // 1% = 4,000
        usdc.approve(address(cm), bond1);
        cm.commit(400_000e6);
        vm.stopPrank();

        assertEq(cm.totalCommitted(), 400_000e6);

        // Investor2 commits 300k
        vm.startPrank(investor2);
        uint256 bond2 = (300_000e6 * 100) / 10000; // 3,000
        usdc.approve(address(cm), bond2);
        cm.commit(300_000e6);
        vm.stopPrank();

        assertEq(cm.totalCommitted(), 700_000e6);

        // Advance past commitment window
        vm.warp(block.timestamp + 7 days + 1);
        cm.startDepositDay();

        // Investor1 deposits during priority round
        vm.startPrank(investor1);
        uint256 depositAmount1 = 400_000e6 - bond1; // 396,000 (bond counts toward deposit)
        usdc.approve(address(cm), depositAmount1);
        cm.deposit();
        vm.stopPrank();

        assertEq(token.balanceOf(investor1), 400_000e6);

        // Investor2 deposits during priority round
        vm.startPrank(investor2);
        uint256 depositAmount2 = 300_000e6 - bond2;
        usdc.approve(address(cm), depositAmount2);
        cm.deposit();
        vm.stopPrank();

        assertEq(token.balanceOf(investor2), 300_000e6);
        assertEq(cm.totalDeposited(), 700_000e6);
    }

    // ─── Test: Full lifecycle — normal maturity ─────────────────

    function test_normalMaturity() public {
        uint256 marketId = _createTestMarket();
        (CommitmentManager cm, VaultWrapper wrapper, CatbondToken token, SimpleVault vault,,,) =
            _getMarketContracts(marketId);

        // Commit and deposit
        vm.startPrank(investor1);
        uint256 bond = (400_000e6 * 100) / 10000;
        usdc.approve(address(cm), bond);
        cm.commit(400_000e6);
        vm.stopPrank();

        vm.warp(block.timestamp + 7 days + 1);
        cm.startDepositDay();

        vm.startPrank(investor1);
        usdc.approve(address(cm), 400_000e6 - bond);
        cm.deposit();
        vm.stopPrank();

        // Lock market
        vm.warp(block.timestamp + 24 hours + 1);
        factory.lockMarket(marketId);

        assertEq(uint256(vault.state()), uint256(SimpleVault.VaultState.LOCKED));
        assertEq(wrapper.getRedemptionRate(), 1e6); // $1.00

        // Advance to maturity
        vm.warp(block.timestamp + 365 days + 1);
        factory.matureMarket(marketId);

        assertEq(uint256(vault.state()), uint256(SimpleVault.VaultState.WITHDRAWALS));

        // Redeem tokens
        uint256 balanceBefore = usdc.balanceOf(investor1);
        vm.startPrank(investor1);
        wrapper.redeem(token.balanceOf(investor1));
        vm.stopPrank();

        uint256 balanceAfter = usdc.balanceOf(investor1);
        assertEq(balanceAfter - balanceBefore, 400_000e6); // Full redemption at $1.00
    }

    // ─── Test: Full lifecycle — oracle trigger + slash ───────────

    function test_oracleTriggerAndSlash() public {
        uint256 marketId = _createTestMarket();
        (CommitmentManager cm, VaultWrapper wrapper, CatbondToken token, SimpleVault vault,,,) =
            _getMarketContracts(marketId);

        // Commit, deposit, lock
        vm.startPrank(investor1);
        uint256 bond = (400_000e6 * 100) / 10000;
        usdc.approve(address(cm), bond);
        cm.commit(400_000e6);
        vm.stopPrank();

        vm.warp(block.timestamp + 7 days + 1);
        cm.startDepositDay();

        vm.startPrank(investor1);
        usdc.approve(address(cm), 400_000e6 - bond);
        cm.deposit();
        vm.stopPrank();

        vm.warp(block.timestamp + 24 hours + 1);
        factory.lockMarket(marketId);

        // Record risk holder balance before trigger
        uint256 riskHolderBefore = usdc.balanceOf(riskHolder);

        // Trigger oracle: Category 3 hurricane (195 km/h) → 50% slash
        oracle.triggerEvent(marketId, 195);

        assertEq(uint256(vault.state()), uint256(SimpleVault.VaultState.WITHDRAWALS));
        assertEq(wrapper.getRedemptionRate(), 500000); // $0.50

        // Risk holder received slashed funds
        uint256 riskHolderAfter = usdc.balanceOf(riskHolder);
        assertEq(riskHolderAfter - riskHolderBefore, 200_000e6); // 50% of 400k

        // Investor redeems at reduced rate
        uint256 investorBefore = usdc.balanceOf(investor1);
        vm.startPrank(investor1);
        wrapper.redeem(token.balanceOf(investor1));
        vm.stopPrank();

        uint256 investorAfter = usdc.balanceOf(investor1);
        assertEq(investorAfter - investorBefore, 200_000e6); // 50% of 400k
    }

    // ─── Test: Oversubscription pro-rata ────────────────────────

    function test_oversubscription() public {
        uint256 marketId = _createTestMarket();
        (CommitmentManager cm,, CatbondToken token,,,,) = _getMarketContracts(marketId);

        // 3 investors commit 500k each = 1.5M total > 1M target
        vm.startPrank(investor1);
        usdc.approve(address(cm), 5_000e6);
        cm.commit(500_000e6);
        vm.stopPrank();

        vm.startPrank(investor2);
        usdc.approve(address(cm), 5_000e6);
        cm.commit(500_000e6);
        vm.stopPrank();

        vm.startPrank(investor3);
        usdc.approve(address(cm), 5_000e6);
        cm.commit(500_000e6);
        vm.stopPrank();

        assertTrue(cm.isOversubscribed());
        assertEq(cm.totalCommitted(), 1_500_000e6);

        // Each investor gets 1/3 of target = 333,333.333... USDC
        uint256 allocation1 = cm.getProRataAllocation(investor1);
        assertApproxEqAbs(allocation1, 333_333e6, 1e6); // Allow 1 USDC rounding
    }

    // ─── Test: OrderBook trading ────────────────────────────────

    function test_orderBookTrading() public {
        uint256 marketId = _createTestMarket();
        (CommitmentManager cm, VaultWrapper wrapper, CatbondToken token,, OrderBook orderBook,,) =
            _getMarketContracts(marketId);

        // Setup: commit, deposit, lock
        vm.startPrank(investor1);
        uint256 bond = (400_000e6 * 100) / 10000;
        usdc.approve(address(cm), bond);
        cm.commit(400_000e6);
        vm.stopPrank();

        vm.warp(block.timestamp + 7 days + 1);
        cm.startDepositDay();

        vm.startPrank(investor1);
        usdc.approve(address(cm), 400_000e6 - bond);
        cm.deposit();
        vm.stopPrank();

        vm.warp(block.timestamp + 24 hours + 1);
        factory.lockMarket(marketId);

        // Investor1 places sell order: 100k tokens at $0.95
        vm.startPrank(investor1);
        token.approve(address(orderBook), 100_000e6);
        orderBook.placeLimitOrder(false, 950000, 100_000e6); // sell 100k at $0.95
        vm.stopPrank();

        // Trader1 places buy order: 50k tokens at $0.95
        vm.startPrank(trader1);
        usdc.approve(address(orderBook), 47_500e6); // 50k * $0.95
        orderBook.placeLimitOrder(true, 950000, 50_000e6);
        vm.stopPrank();

        // The buy should have matched against the sell
        assertEq(token.balanceOf(trader1), 50_000e6); // Trader got 50k tokens
        assertEq(orderBook.lastTradePrice(), 950000);  // Last trade at $0.95
    }

    // ─── Test: Premium drip and claim ───────────────────────────

    function test_premiumDripAndClaim() public {
        uint256 marketId = _createTestMarket();
        (CommitmentManager cm, VaultWrapper wrapper, CatbondToken token,,, PremiumEscrow escrow,) =
            _getMarketContracts(marketId);

        // Commit, deposit, lock
        vm.startPrank(investor1);
        uint256 bond = (400_000e6 * 100) / 10000;
        usdc.approve(address(cm), bond);
        cm.commit(400_000e6);
        vm.stopPrank();

        vm.warp(block.timestamp + 7 days + 1);
        cm.startDepositDay();

        vm.startPrank(investor1);
        usdc.approve(address(cm), 400_000e6 - bond);
        cm.deposit();
        vm.stopPrank();

        vm.warp(block.timestamp + 24 hours + 1);
        factory.lockMarket(marketId);

        // Advance 30 days and drip premium
        vm.warp(block.timestamp + 30 days);
        escrow.drip();

        // Check investor has claimable rewards
        uint256 claimable = wrapper.claimableRewards(investor1);
        assertTrue(claimable > 0, "Should have claimable premium rewards");

        // Claim rewards
        uint256 balanceBefore = usdc.balanceOf(investor1);
        vm.prank(investor1);
        wrapper.claimRewards();
        uint256 balanceAfter = usdc.balanceOf(investor1);

        assertTrue(balanceAfter > balanceBefore, "Should have received premium");
    }

    // ─── Test: Bond forfeit for no-shows ────────────────────────

    function test_bondForfeit() public {
        uint256 marketId = _createTestMarket();
        (CommitmentManager cm,,,,,, ) = _getMarketContracts(marketId);

        // Investor commits but won't deposit
        vm.startPrank(investor1);
        uint256 bond = (400_000e6 * 100) / 10000; // 4,000 USDC
        usdc.approve(address(cm), bond);
        cm.commit(400_000e6);
        vm.stopPrank();

        // Advance past deposit deadline without depositing
        vm.warp(block.timestamp + 7 days + 24 hours + 1);

        // Anyone can forfeit the bond
        uint256 adminBefore = usdc.balanceOf(admin);
        cm.forfeitBond(investor1);
        uint256 adminAfter = usdc.balanceOf(admin);

        assertEq(adminAfter - adminBefore, bond); // Admin received forfeited bond
    }

    // ─── Test: No slash below threshold ─────────────────────────

    function test_noSlashBelowThreshold() public {
        uint256 marketId = _createTestMarket();
        (CommitmentManager cm, VaultWrapper wrapper,, SimpleVault vault,,,) = _getMarketContracts(marketId);

        // Commit, deposit, lock
        vm.startPrank(investor1);
        uint256 bond = (400_000e6 * 100) / 10000;
        usdc.approve(address(cm), bond);
        cm.commit(400_000e6);
        vm.stopPrank();

        vm.warp(block.timestamp + 7 days + 1);
        cm.startDepositDay();

        vm.startPrank(investor1);
        usdc.approve(address(cm), 400_000e6 - bond);
        cm.deposit();
        vm.stopPrank();

        vm.warp(block.timestamp + 24 hours + 1);
        factory.lockMarket(marketId);

        // Trigger with severity below first threshold (100 km/h < 119)
        oracle.triggerEvent(marketId, 100);

        // No slash should have occurred — vault stays LOCKED
        assertEq(uint256(vault.state()), uint256(SimpleVault.VaultState.LOCKED));
        assertEq(wrapper.getRedemptionRate(), 1e6); // Still $1.00
    }
}
